from django.db.models.signals import post_save, post_delete, m2m_changed, pre_save
from django.dispatch import receiver
from .models import Doctor, Clinic, DoctorDate, ClientDate
from .utils import compute_is_renderizable  # Or wherever you define the function
from datetime import datetime


@receiver(m2m_changed, sender=Doctor.clinics.through)
def update_doctor_cities(sender, instance, action, **kwargs):
    print(f"Signal triggered for action: {action}")  # Debugging print
    if action in ['post_add', 'post_remove', 'post_clear']:
        clinics = instance.clinics.all()
        cities = set(clinic.city for clinic in clinics)
        instance.cities = list(cities)  # Ensure this is a list
        instance.save()

@receiver(post_save, sender=DoctorDate)
def set_has_schedule_to_true(sender, instance, created, **kwargs):
    if created:
        print('hola')
        doc = instance.doctor
        if not doc.takes_dates:
            doc.takes_dates = True
            doc.save()

@receiver(post_delete, sender=DoctorDate)
def remove_has_schedule(sender, instance, **kwargs):
    doc = instance.doctor
    # Check if the user has any other schedules left
    if not doc.dates.exists():
        doc.has_schedule = False
        doc.save()

@receiver(post_save, sender=Doctor)
def update_schedules_active_status(sender, instance, created, **kwargs):
    # We only need to do this if the user is saved (either new or updated)
    doc = instance
    print(doc)
    # in_person-based schedules
    if doc.in_person:
        # Make all in-person schedules active
        DoctorDate.objects.filter(doctor=doc, modalidad='in_person').update(isActive=True)
    else:
        # Deactivate them
        DoctorDate.objects.filter(doctor=doc, modalidad='in_person').update(isActive=False)

    # virtually-based DoctorDates
    if doc.virtually:
        # Make all virtually DoctorDates active
        DoctorDate.objects.filter(doctor=doc,  modalidad='virtually').update(isActive=True)
    else:
        # Deactivate them
        DoctorDate.objects.filter(doctor=doc, modalidad='virtually').update(isActive=False)


@receiver(post_save, sender=Doctor)
def update_doctor_renderizable_status(sender, instance, created, **kwargs):
    doctor = instance
    new_renderizable_value = compute_is_renderizable(doctor)
    print(new_renderizable_value)
    # Update only if the value changed (to avoid unnecessary saves)
    if doctor.renderizable != new_renderizable_value:
        doctor.renderizable = new_renderizable_value
        doctor.save(update_fields=["renderizable"])

@receiver(pre_save, sender=ClientDate)
def check_clientdate_active_status(sender, instance, **kwargs):
    print(instance.date, type(instance.date))
    combined_datetime = datetime.combine(instance.date, instance.time)

    # If using Django's timezone-aware approach:
    # combined_datetime = timezone.make_aware(combined_datetime, timezone.get_default_timezone())

    if combined_datetime < datetime.now():
        # or timezone.now() if using timezones
        instance.isActive = False
    else:
        instance.isActive = True  # or keep the existing value if you prefer not to overwrite
