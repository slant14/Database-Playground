import uuid

from django.db import models

from templates.models import Template


class Session(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)

    def get_unauth_dbname(self) -> str:
        id = self.id
        if isinstance(self.id, uuid.UUID):
            id = self.id.hex
        return f"db_unauth_{id}"


class SessionInfo(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    template = models.ForeignKey(
        Template, on_delete=models.SET_NULL, null=True)
    db_name = models.CharField(max_length=20)
