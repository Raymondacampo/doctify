# Generated by Django 5.0 on 2024-10-08 20:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0026_alter_user_ensurance'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='doctor',
            name='age',
        ),
        migrations.AlterField(
            model_name='doctor',
            name='ensurances',
            field=models.ManyToManyField(blank=True, related_name='doctors', to='web.ensurance'),
        ),
        migrations.AlterField(
            model_name='doctor',
            name='experience',
            field=models.IntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='doctor',
            name='specialities',
            field=models.ManyToManyField(blank=True, related_name='doctors', to='web.speciality'),
        ),
    ]
