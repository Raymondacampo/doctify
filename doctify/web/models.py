from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime
from phonenumber_field.modelfields import PhoneNumberField
import requests
import json
from multiselectfield import MultiSelectField as MSField
# Create your models here.


class MultiSelectField(MSField):

    def _get_flatchoices(self):
        flat_choices = super(models.CharField, self).flatchoices

        class MSFFlatchoices(list):
            # Used to trick django.contrib.admin.utils.display_for_field into not treating the list of values as a
            # dictionary key (which errors out)
            def __bool__(self):
                return False

            __nonzero__ = __bool__

        return MSFFlatchoices(flat_choices)

    flatchoices = property(_get_flatchoices)

citiesList = []
res = requests.get('https://api.digital.gob.do/v1/territories/provinces' )
response = json.loads(res.text)
for city in response['data']:
    citiesList.append((city['name'], f"{city['name']}"))

class Ensurance(models.Model):
    name = models.CharField(max_length=200)
    logo = models.URLField(blank=True)

    def __str__(self):
        return f"{self.name}"
    
    def serialize(self):
        return{
            'id':self.id,
            'name':f"{self.name}",
            'img':self.logo
        }

class User(AbstractUser):
    profilePicture = models.URLField(default='https://i.imgflip.com/6yvpkj.jpg')
    email = models.EmailField(unique=True)
    phone = PhoneNumberField(null=False, blank=False, unique=True)   

    


class Speciality(models.Model):
    speciality = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.speciality}"
    
    def serialize(self):
        return{
            'id':self.id,
            'name':self.speciality
        }

class Clinic(models.Model):
    name = models.CharField(max_length=200)
    city = MultiSelectField(choices=citiesList, max_choices=3, max_length=64)
    adress = models.CharField(max_length=500)
    ensurance = models.ManyToManyField(Ensurance, blank=True, related_name="clinics")
    contact = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"
    
    def serialize(self):
        return{
            'id':self.id,
            'name':self.name
        }
    


class Doctor(models.Model):
    docuser = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='doctor')
    name = models.CharField(max_length=64, default='popo')
    speciality = models.ManyToManyField(Speciality, blank=True, related_name="doctors")
    clinic = models.ManyToManyField(Clinic, blank=True,  related_name="doctors")
    availability = models.CharField(max_length=500, blank=True)
    contact = models.CharField(max_length=500)
    ensurance = models.ManyToManyField(Ensurance, blank=True, related_name='doctors')
    city = MultiSelectField(choices=citiesList, max_choices=3, max_length=64, default='Santo Domingo')
    image = models.URLField(default='https://i.imgflip.com/6yvpkj.jpg', blank=True)
    description = models.CharField(max_length=400, blank=True)

    def __str__(self):
        return f"{self.name}"
    

    def serialize(self):
        return{
            'id':self.id,
            'name':self.name,
            'speciality':[f' {s.speciality} ' for s in self.speciality.all()],
            'image':self.image,
            'clinic':[c.name for c in self.clinic.all()],
            'ensurance':[e.name for e in self.ensurance.all()],
            'city': [c for c in self.city],
            'logo':[e.logo for e in self.ensurance.all()],
            'description': self.description,
            'link': f'/{self.id}/profile'
        }
    
daysToPick = (
    (0, 'Sunday'),
    (1, 'Monday'),
    (2, 'Tuesday'),
    (3, 'Wednesday'),
    (4, 'Thursday'),
    (5, 'Friday'),
    (6, 'Saturday')
)

def toMil(val):
    return val * 3600000

hoursToPick = []
for i in range(24):
    hoursToPick.append((f'{i}:00', f'{i}:00'))
    hoursToPick.append((f'{i}:30', f'{i}:30'))



minToPick = [
    (0, 0),
    (int(toMil(0.5)), 30)
    ]
    
    
class Dates(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True, related_name='dates')
    clinica = models.ForeignKey(Clinic, on_delete=models.CASCADE, null=True, default=0,related_name='dates')
    days = MultiSelectField(choices=daysToPick, max_length=300)
    horas = MultiSelectField(choices=hoursToPick, max_length=300)

    def __str__(self):
        return f'{self.doctor} Schedule in {self.clinica}'
    
    def serialize(self):
        return {
            'doctor': self.doctor.name,
            'clinic': self.clinica.name,
            'days': [int(d) for d in self.days],
            'hours': [h for h in self.horas],
            'strhours': [str(h) for h in self.horas]
        }

class ClientDates(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True, default=1, related_name='clientDates')
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, null=True, default=1, related_name='clientDates')
    date = models.DateField()
    time = models.CharField(max_length=5, default='00:00')
    client = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='clientDates')
    isActive = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.client} date with {self.doctor} on {self.date} {self.time}'

    def serialize(self):
        return {
            'doctor': self.doctor,
            'clinic':self.clinic.name,
            'client': self.client,
            'date': self.date,
            'time': self.time 
        }
    