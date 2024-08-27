# Generated by Django 5.0 on 2024-05-16 17:27

import datetime
import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0003_user_phone_alter_clientdates_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientdates',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2024, 5, 16, 13, 27, 11, 321270)),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone',
            field=phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None, unique=True),
        ),
    ]