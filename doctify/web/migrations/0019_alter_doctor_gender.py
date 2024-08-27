# Generated by Django 5.0 on 2024-08-12 18:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0018_doctor_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctor',
            name='gender',
            field=models.CharField(choices=[('male', 'male'), ('female', 'female')], default='male', max_length=6),
        ),
    ]
