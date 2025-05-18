from django.db import models

# Create your models here.
import re
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator

def validate_phone(value):
    if not re.match(r'^\+?[0-9]{10,13}$', value):
        raise ValidationError("Invalid phone number")

class UserData(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, validators=[validate_phone])
    email = models.EmailField(validators=[EmailValidator()],null=True,
    blank=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    consent = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.phone} - {self.email} - {self.address if self.address else 'N/A'} - {self.pincode if self.pincode else 'N/A'}"

    
