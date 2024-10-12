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
    phone = PhoneNumberField(blank=True)
    image = models.URLField(default='https://i.imgflip.com/6yvpkj.jpg', blank=True)
    ensurance = models.ManyToManyField(Ensurance, related_name='ensurances')
    recent_doctors = models.ManyToManyField('Doctor')
    is_doctor = models.BooleanField(default=False)
    def serialize(self):
        return{
            'profile_picture': self.profilePicture,
            'email': self.email,     
            'image': self.image,
            'ensurance': [e for e in self.ensurance.all()]          
        }

            
        



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
    map = models.CharField(max_length=500, default='hola')
    phone = PhoneNumberField(null=True, blank=True) 
    def __str__(self):
        return f"{self.name}"
    
    def serialize(self):
        return{
            'id':self.id,
            'name':self.name
        }
    


class Doctor(models.Model):
    docuser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor')
    name = models.CharField(max_length=64, default='popo')
    gender = models.CharField(choices=(('male', 'male'), ('female', 'female')), default='male', max_length=6)
    specialities = models.ManyToManyField(Speciality, related_name="doctors", blank=True)
    clinics = models.ManyToManyField(Clinic, blank=True, related_name="doctors")
    ensurances = models.ManyToManyField(Ensurance, related_name='doctors', blank=True)
    cities = MultiSelectField(choices=citiesList, max_choices=3, max_length=64, default='Santo Domingo')
    description = models.CharField(max_length=1000, blank=True)
    renderizable = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name}"
    
        
    def serialize(self):
        def get_gender():
            if self.gender == 'male':
                return f'Dr. {self.name}'
            else:
                return f'Dra. {self.name}'
        return{
            'id':self.id,
            'name': get_gender(),
            'gender': self.gender,
            'specialities':[s.speciality for s in self.specialities.all()],
            'clinics':[c.name for c in self.clinics.all()],
            'ensurances':[e.name for e in self.ensurances.all()],
            'cities': [c for c in self.cities],
            'image':self.docuser.profilePicture,
            'description': self.description,
            'ensurancesLogo':[e.logo for e in self.ensurances.all()],
            'profileLink': f'/{self.id}/profile',
            'descriptionLength': len(self.description),
            'clinicMap': [c.map for c in self.clinics.all()]
        }
    
class DoctorContacts(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='contacts')
    phone1 = PhoneNumberField(unique=True, null=True)
    instagram = models.URLField(null=True)
    facebook = models.URLField(null=True)
    

daysToPick = (
    (0, 'Sunday'),
    (1, 'Monday'),
    (2, 'Tuesday'),
    (3, 'Wednesday'),
    (4, 'Thursday'),
    (5, 'Friday'),
    (6, 'Saturday'),
    ('web', 'days')
)

def toMil(val):
    return val * 3600000

hoursToPick = []
for i in range(24):
    hoursToPick.append((f'{i}:00', f'{i}:00'))
    hoursToPick.append((f'{i}:30', f'{i}:30'))

modalidades = [
    ('Presencial', 'Presencial'),
    ('Virtual', 'Virtual'),
    ('Ambas', 'Ambas'),
    ('web', 'days')
]

minToPick = [
    (0, 0),
    (int(toMil(0.5)), 30)
    ]
    
    
class DoctorDate(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='dates')
    clinica = models.ForeignKey(Clinic, on_delete=models.CASCADE, default=0,related_name='dates')
    especialidad = models.ForeignKey(Speciality, on_delete=models.CASCADE, default=0,related_name='dates')
    precio = models.IntegerField()
    days = MultiSelectField(choices=daysToPick, max_length=300)
    horas = MultiSelectField(choices=hoursToPick, max_length=300)
    modalidad = models.CharField(choices=modalidades, max_length=300)
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

class ClientDate(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, default=1, related_name='clientDates')
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, default=1, related_name='clientDates')
    date = models.DateField()
    time = models.CharField(max_length=5, default='00:00')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clientDates')
    isActive = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.client} date with {self.doctor} on {self.date} {self.time}'

    def serialize(self):
        def thetime(time):
            hours, minutes = time.split(':')
            hours = int(hours)
            timevalue = ''
            if hours == 12:
                timevalue = f'{hours}:{minutes} PM'
            elif hours == 0:
                timevalue = f'12:{minutes} AM'
            elif hours > 12:
                hours = hours - 12
                timevalue = f'{hours}:{minutes} PM'
            else:
                timevalue = f'{hours}:{minutes} AM'
            return timevalue
        return {
            'id':self.id,
            'doctor': self.doctor.serialize(),
            'clinic':self.clinic.name,
            'client': self.client.username,
            'date': self.date,
            'time': thetime(self.time),
            'isactive': self.isActive
        }
    