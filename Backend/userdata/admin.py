from django.contrib import admin
from .models import UserData

@admin.register(UserData)
class UserDataAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "email", "address", "pincode", "consent")  
