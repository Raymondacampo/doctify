# Generated by Django 5.0 on 2024-12-03 20:33

import django.db.models.deletion
import web.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0047_rename_speciality_speciality_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctordate',
            name='days',
            field=web.models.MultiSelectField(choices=[(0, 'Monday'), (1, 'Tuesday'), (2, 'Wednesday'), (3, 'Thursday'), (4, 'Friday'), (5, 'Saturday'), (6, 'Sunday'), ('web', 'days')], max_length=300),
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rate', models.PositiveSmallIntegerField()),
                ('review', models.TextField()),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='web.doctor')),
            ],
        ),
        migrations.AddConstraint(
            model_name='review',
            constraint=models.CheckConstraint(check=models.Q(('rate__gte', 1), ('rate__lte', 5)), name='rate_between_1_and_5'),
        ),
    ]
