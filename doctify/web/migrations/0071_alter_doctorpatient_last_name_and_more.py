# Generated by Django 5.0 on 2025-01-08 20:39

import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0070_doctorpatient_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctorpatient',
            name='last_name',
            field=models.CharField(blank=True, max_length=150, verbose_name='last name'),
        ),
        migrations.AlterField(
            model_name='doctorpatient',
            name='phone',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None),
        ),
    ]
