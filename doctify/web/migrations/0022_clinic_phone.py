# Generated by Django 5.0 on 2024-08-21 21:13

import phonenumber_field.modelfields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0021_clinic_map'),
    ]

    operations = [
        migrations.AddField(
            model_name='clinic',
            name='phone',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None),
        ),
    ]
