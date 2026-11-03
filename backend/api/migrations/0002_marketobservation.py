from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = []
    operations = [migrations.CreateModel(
        name='MarketObservation',
        fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('state', models.CharField(max_length=80)), ('district', models.CharField(max_length=80)),
            ('market_name', models.CharField(max_length=160)), ('commodity', models.CharField(max_length=120)),
            ('variety', models.CharField(blank=True, max_length=120)), ('arrival_date', models.DateField()),
            ('min_price', models.DecimalField(decimal_places=2, max_digits=12)), ('max_price', models.DecimalField(decimal_places=2, max_digits=12)),
            ('modal_price', models.DecimalField(decimal_places=2, max_digits=12)),
            ('arrival_quantity', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
            ('price_unit', models.CharField(default='INR/Qtl', max_length=32)), ('source_name', models.CharField(max_length=120)),
            ('source_url', models.URLField(blank=True)), ('source_record_id', models.CharField(blank=True, max_length=160)),
            ('estimated_distance_km', models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True)),
            ('market_charge_estimate', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
            ('synced_at', models.DateTimeField(auto_now=True)),
        ], options={'ordering': ['-arrival_date', 'market_name']},
    ), migrations.AddConstraint(model_name='marketobservation', constraint=models.UniqueConstraint(fields=('source_name', 'source_record_id'), name='unique_market_source_record')), migrations.AddIndex(model_name='marketobservation', index=models.Index(fields=['state', 'district', 'commodity', 'arrival_date'], name='api_marketo_state_a8db82_idx'))]
