"""Seed a clearly-separated Karnataka demonstration dataset for product tours."""
from datetime import timedelta
from hashlib import sha1

from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import MarketObservation

DISTRICTS = ['Mysuru', 'Bengaluru Urban', 'Bengaluru Rural', 'Mandya', 'Hassan', 'Tumakuru', 'Chamarajanagar', 'Kodagu', 'Chikkamagaluru', 'Shivamogga', 'Davanagere', 'Belagavi', 'Dharwad', 'Vijayapura', 'Kalaburagi', 'Raichur', 'Ballari', 'Koppal', 'Bagalkot', 'Uttara Kannada', 'Dakshina Kannada', 'Udupi', 'Chitradurga', 'Kolar', 'Chikkaballapur', 'Ramanagara', 'Yadgir', 'Bidar', 'Gadag', 'Haveri', 'Vijayanagara']
CROPS = [('Tomato', 'Hybrid'), ('Onion', 'Red'), ('Maize', 'Yellow'), ('Paddy', 'Common'), ('Ragi', 'Local'), ('Potato', 'Jyoti'), ('Chilli', 'Dry')]
BASE_PRICES = [1650, 2100, 2250, 2450, 3600, 1900, 7200]


class Command(BaseCommand):
    help = 'Create clearly labelled Karnataka demonstration observations. It never changes official records.'

    def handle(self, *args, **options):
        created = updated = 0
        today = timezone.localdate()
        for district_index, district in enumerate(DISTRICTS):
            for crop_index, (commodity, variety) in enumerate(CROPS):
                for day_offset in range(7):
                    date = today - timedelta(days=day_offset)
                    modal = BASE_PRICES[crop_index] + ((district_index * 19 + day_offset * 23) % 220) - 110
                    source_id = sha1(f'{district}|{commodity}|{date}'.encode()).hexdigest()
                    _, was_created = MarketObservation.objects.update_or_create(
                        source_name='Agri-MART demonstration data — not for selling', source_record_id=source_id,
                        defaults={'state': 'Karnataka', 'district': district, 'market_name': f'{district} Demonstration Market', 'commodity': commodity, 'variety': variety, 'arrival_date': date, 'min_price': modal - 140, 'modal_price': modal, 'max_price': modal + 170, 'arrival_quantity': None, 'price_unit': 'INR/Qtl', 'source_url': '', 'data_kind': 'demo'},
                    )
                    created += was_created
                    updated += not was_created
        self.stdout.write(self.style.WARNING(f'Demo observations: {created} created, {updated} updated. These records are not official market data.'))
