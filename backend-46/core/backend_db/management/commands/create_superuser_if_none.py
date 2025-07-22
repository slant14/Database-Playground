from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Create superuser if not exists'

    def handle(self, *args, **options):
        User = get_user_model()
        name="admin"
        email = "admin@email.com"
        password = "admin"
        if not User.objects.filter(name=name).exists():
            User.objects.create_superuser("admin", email=email, password=password)
            self.stdout.write(self.style.SUCCESS('Superuser created'))
        else:
            self.stdout.write(self.style.WARNING('Superuser already exists'))