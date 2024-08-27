# Generated by Django 5.0 on 2024-06-01 15:19

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0006_doctor_name_alter_clientdates_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientdates',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2024, 6, 1, 11, 19, 58, 886736)),
        ),
        migrations.AlterField(
            model_name='doctor',
            name='availability',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AlterField(
            model_name='doctor',
            name='ensurance',
            field=models.ManyToManyField(blank=True, related_name='doctors', to='web.ensurance'),
        ),
        migrations.AlterField(
            model_name='doctor',
            name='image',
            field=models.URLField(blank=True, default='https://i.imgflip.com/6yvpkj.jpg'),
        ),
    ]
