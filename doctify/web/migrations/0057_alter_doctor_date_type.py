# Generated by Django 5.0 on 2024-12-07 00:44

import web.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0056_remove_doctor_in_person_remove_doctor_virtually_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctor',
            name='date_type',
            field=web.models.MultiSelectField(blank=True, choices=[('Virtually', 'Virtually'), ('In_person', 'In_person')], max_length=64),
        ),
    ]
