"""data.gov.in / AGMARKNET client and normalizer.

The public resource is a daily dataset. This service deliberately stores the
source observation date and does not turn it into a live market quote.
"""
from __future__ import annotations

import hashlib
import json
from datetime import datetime
from decimal import Decimal, InvalidOperation
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings
from django.db import IntegrityError, transaction
from django.utils import timezone

from api.models import MarketObservation, MarketSyncLog


class MarketDataError(RuntimeError):
    """A recoverable data.gov.in request or payload error."""


class AgmarknetMarketService:
    source_name = 'data.gov.in / AGMARKNET'

    def __init__(self, opener=urlopen):
        self.opener = opener

    @property
    def endpoint(self):
        return f"{settings.DATA_GOV_MARKET_ENDPOINT.rstrip('/')}/{settings.DATA_GOV_MARKET_RESOURCE_ID}"

    def fetch_page(self, offset=0, limit=None, filters=None):
        if not settings.DATA_GOV_API_KEY:
            raise MarketDataError('DATA_GOV_API_KEY is not configured.')
        params = {
            'api-key': settings.DATA_GOV_API_KEY,
            'format': 'json',
            'limit': limit or settings.DATA_GOV_MARKET_PAGE_SIZE,
            'offset': offset,
        }
        # data.gov.in resource APIs accept filters[field]=value. The field names
        # below match this resource’s documented lowercase column names.
        for key, value in (filters or {}).items():
            if value:
                params[f'filters[{key}]'] = value
        request = Request(f'{self.endpoint}?{urlencode(params)}', headers={'Accept': 'application/json', 'User-Agent': 'Agri-MART/1.0'})
        try:
            with self.opener(request, timeout=settings.DATA_GOV_MARKET_TIMEOUT_SECONDS) as response:
                payload = json.loads(response.read().decode('utf-8'))
        except HTTPError as exc:
            raise MarketDataError(f'data.gov.in returned HTTP {exc.code}.') from exc
        except (URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise MarketDataError(f'Could not retrieve data.gov.in market data: {exc}.') from exc
        if not isinstance(payload, dict) or not isinstance(payload.get('records'), list):
            raise MarketDataError('data.gov.in returned an unexpected market-data payload.')
        return payload

    @staticmethod
    def _value(record, *keys):
        normalized = {str(key).strip().lower().replace(' ', '_'): value for key, value in record.items()}
        for key in keys:
            value = normalized.get(key)
            if value not in (None, ''):
                return str(value).strip()
        return ''

    @staticmethod
    def _decimal(value, required=True):
        if value in (None, ''):
            if required:
                raise ValueError('required numeric value is missing')
            return None
        try:
            return Decimal(str(value).replace(',', '').strip())
        except (InvalidOperation, AttributeError) as exc:
            raise ValueError(f'invalid numeric value {value!r}') from exc

    @staticmethod
    def _date(value):
        for pattern in ('%d/%m/%Y', '%Y-%m-%d', '%d-%m-%Y', '%d/%m/%y'):
            try:
                return datetime.strptime(value, pattern).date()
            except (TypeError, ValueError):
                continue
        raise ValueError(f'invalid arrival date {value!r}')

    def normalize_record(self, record):
        """Map the resource's documented fields to the internal model schema."""
        state = self._value(record, 'state')
        district = self._value(record, 'district')
        market = self._value(record, 'market', 'market_name')
        commodity = self._value(record, 'commodity')
        arrival_date = self._date(self._value(record, 'arrival_date'))
        if not all((state, district, market, commodity)):
            raise ValueError('state, district, market, and commodity are required')
        variety = self._value(record, 'variety')
        source_id = self._value(record, '_id', 'id')
        if not source_id:
            source_id = hashlib.sha256('|'.join((state, district, market, commodity, variety, arrival_date.isoformat())).encode()).hexdigest()[:40]
        return {
            'state': state, 'district': district, 'market_name': market,
            'commodity': commodity, 'variety': variety, 'arrival_date': arrival_date,
            'min_price': self._decimal(self._value(record, 'min_price')),
            'max_price': self._decimal(self._value(record, 'max_price')),
            'modal_price': self._decimal(self._value(record, 'modal_price')),
            'arrival_quantity': self._decimal(self._value(record, 'arrival_quantity'), required=False),
            'price_unit': 'INR/Qtl', 'source_name': self.source_name,
            'source_url': self.endpoint, 'source_record_id': source_id, 'data_kind': 'official',
        }

    def upsert(self, record):
        values = self.normalize_record(record)
        lookup = {'source_name': self.source_name, 'source_record_id': values['source_record_id']}
        with transaction.atomic():
            try:
                instance = MarketObservation.objects.select_for_update().get(**lookup)
                # Official revisions may correct a record; update only fields sourced
                # from that same immutable source record, never another day's row.
                for field, value in values.items():
                    setattr(instance, field, value)
                instance.save()
                return False
            except MarketObservation.DoesNotExist:
                try:
                    MarketObservation.objects.create(**values)
                    return True
                except IntegrityError:
                    # Concurrent sync created it. Treat as an update on the next run.
                    return False

    def synchronize(self, filters=None, max_pages=None, all_states=False):
        # Karnataka is the default priority. A deliberate all-state run supports
        # national discovery where Karnataka has no reported market that day.
        effective_filters = dict(filters or {})
        if not all_states:
            effective_filters = {'state': 'Karnataka', **effective_filters}
        log = MarketSyncLog.objects.create(filters_used=effective_filters)
        offset = 0
        pages = 0
        try:
            while max_pages is None or pages < max_pages:
                payload = self.fetch_page(offset=offset, filters=effective_filters)
                records = payload['records']
                if not records:
                    break
                log.records_fetched += len(records)
                for record in records:
                    try:
                        if self.upsert(record):
                            log.records_inserted += 1
                        else:
                            log.records_updated += 1
                    except (TypeError, ValueError, IntegrityError):
                        # A malformed source record must not invalidate the rest.
                        log.failed_requests += 1
                pages += 1
                offset += len(records)
                total = payload.get('total')
                if len(records) < settings.DATA_GOV_MARKET_PAGE_SIZE or (total is not None and offset >= int(total)):
                    break
            log.status = 'partial' if log.failed_requests else 'success'
        except MarketDataError as exc:
            log.status = 'failed'
            log.failed_requests += 1
            log.error_message = str(exc)
        log.finished_at = timezone.now()
        log.save()
        return log
