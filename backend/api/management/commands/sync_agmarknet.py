from django.core.management.base import BaseCommand, CommandError

from api.services.agmarknet import AgmarknetMarketService


class Command(BaseCommand):
    help = 'Synchronize source-attributed Karnataka market observations from data.gov.in / AGMARKNET.'

    def add_arguments(self, parser):
        parser.add_argument('--district')
        parser.add_argument('--commodity')
        parser.add_argument('--variety')
        parser.add_argument('--all-states', action='store_true', help='Import all states when Karnataka has no report.')
        parser.add_argument('--max-pages', type=int)

    def handle(self, *args, **options):
        filters = {key: options[key] for key in ('district', 'commodity', 'variety') if options.get(key)}
        log = AgmarknetMarketService().synchronize(filters=filters, max_pages=options.get('max_pages'), all_states=options['all_states'])
        summary = f'Fetched {log.records_fetched}; inserted {log.records_inserted}; updated {log.records_updated}; failures {log.failed_requests}.'
        if log.status == 'failed':
            raise CommandError(f'{summary} {log.error_message}')
        self.stdout.write(self.style.SUCCESS(summary))
