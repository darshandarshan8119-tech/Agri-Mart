"""A lightweight daily scheduler for deployments without Celery.

Run this command as a dedicated worker process. In managed deployments, it is
also safe to schedule `sync_agmarknet` directly with cron/Task Scheduler.
"""
import time
from datetime import datetime, timedelta

from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):
    help = 'Run the official market-data synchronization once daily at a UTC time.'

    def add_arguments(self, parser):
        parser.add_argument('--at', default='02:00', help='UTC time in HH:MM, default 02:00.')

    def handle(self, *args, **options):
        try:
            hour, minute = map(int, options['at'].split(':'))
            if not (0 <= hour <= 23 and 0 <= minute <= 59):
                raise ValueError
        except ValueError as exc:
            raise ValueError('--at must use 24-hour HH:MM format.') from exc
        self.stdout.write(f'Market sync scheduler started; daily UTC run at {hour:02d}:{minute:02d}.')
        while True:
            now = timezone.now()
            next_run = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            if next_run <= now:
                next_run += timedelta(days=1)
            time.sleep((next_run - now).total_seconds())
            self.stdout.write(f'Starting scheduled market sync at {datetime.utcnow().isoformat()}Z')
            call_command('sync_agmarknet')
