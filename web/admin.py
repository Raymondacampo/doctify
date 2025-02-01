from django.contrib import admin
from .models import Speciality, Clinic, Ensurance, Doctor, User, DoctorDate, ClientDate, Review, DoctorPatient

# Register your models here.

admin.site.register(Speciality)
admin.site.register(Clinic)
admin.site.register(Ensurance)
admin.site.register(Doctor)
admin.site.register(DoctorDate)
admin.site.register(ClientDate)
admin.site.register(User)
admin.site.register(Review)
admin.site.register(DoctorPatient)