# Generated by Django 5.0 on 2025-01-28 17:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0074_doctor_phone_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='clinic',
            name='search_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='doctor',
            name='search_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='ensurance',
            name='search_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='speciality',
            name='search_count',
            field=models.IntegerField(default=0),
        ),
    ]
