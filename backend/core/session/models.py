import uuid
from django.db import models

class Session(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)

    def get_unauth_dbname(self) -> str:
        id = self.id
        if isinstance(self.id, uuid.UUID):
            id = self.id.hex
        return f"db_unauth_{id}"

