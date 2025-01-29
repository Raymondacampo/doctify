# Generated by Django 5.0 on 2025-01-07 00:13

import django.db.models.deletion
import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0068_alter_clientdate_modality'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctorcontacts',
            name='phone',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None),
        ),
        migrations.CreateModel(
            name='DoctorPatient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('national_id', models.CharField(blank=True, help_text='Dominican National ID (Cédula), e.g. 001-1234567-8', max_length=13, null=True, unique=True)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_patients', to='web.doctor')),
            ],
        ),
    ]
