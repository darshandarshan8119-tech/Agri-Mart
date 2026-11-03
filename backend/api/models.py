from django.db import models

class MarketObservation(models.Model):
    """A normalized, source-attributed daily market report; never a live quote."""
    state = models.CharField(max_length=80)
    district = models.CharField(max_length=80)
    market_name = models.CharField(max_length=160)
    commodity = models.CharField(max_length=120)
    variety = models.CharField(max_length=120, blank=True)
    arrival_date = models.DateField()
    min_price = models.DecimalField(max_digits=12, decimal_places=2)
    max_price = models.DecimalField(max_digits=12, decimal_places=2)
    modal_price = models.DecimalField(max_digits=12, decimal_places=2)
    arrival_quantity = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    price_unit = models.CharField(max_length=32, default='INR/Qtl')
    source_name = models.CharField(max_length=120)
    source_url = models.URLField(blank=True)
    source_record_id = models.CharField(max_length=160, blank=True)
    estimated_distance_km = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    market_charge_estimate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    data_kind = models.CharField(max_length=12, choices=[('official', 'Official'), ('demo', 'Demo')], default='official')
    synced_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-arrival_date', 'market_name']
        constraints = [models.UniqueConstraint(fields=['source_name', 'source_record_id'], name='unique_market_source_record')]
        indexes = [models.Index(fields=['state', 'district', 'commodity', 'arrival_date'])]

    def __str__(self):
        return f'{self.market_name} – {self.commodity} ({self.arrival_date})'


class MarketSyncLog(models.Model):
    """Audit trail for a single official-market-data synchronization run."""
    STATUS_CHOICES = [('running', 'Running'), ('success', 'Success'), ('partial', 'Partial'), ('failed', 'Failed')]
    source_name = models.CharField(max_length=120, default='data.gov.in / AGMARKNET')
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='running')
    records_fetched = models.PositiveIntegerField(default=0)
    records_inserted = models.PositiveIntegerField(default=0)
    records_updated = models.PositiveIntegerField(default=0)
    failed_requests = models.PositiveIntegerField(default=0)
    error_message = models.TextField(blank=True)
    filters_used = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f'{self.source_name}: {self.status} at {self.started_at:%Y-%m-%d %H:%M}'
