from django.db.models.signals import post_save
from django.dispatch import receiver

from session.models import Session, SessionInfo


@receiver(post_save, sender=Session)
def create_SessionInfo_for_Session(
        sender, instance: Session, created, **kwargs
):
    if created:
        SessionInfo.objects.create(
            session=instance, template=None,
            db_name=instance.get_unauth_dbname()
        )
