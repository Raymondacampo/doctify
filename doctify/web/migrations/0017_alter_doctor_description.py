# Generated by Django 5.0 on 2024-08-06 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0016_alter_user_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctor',
            name='description',
            field=models.CharField(blank=True, max_length=1000),
        ),
    ]