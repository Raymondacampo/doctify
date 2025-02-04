from django.db import models
from django.db.models import Avg, Count, Q

from django.contrib.auth.models import AbstractUser
import datetime
from phonenumber_field.modelfields import PhoneNumberField
import requests
import json
from multiselectfield import MultiSelectField as MSField
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class MultiSelectField(MSField):

    def _get_flatchoices(self):
        flat_choices = super(models.CharField, self).flatchoices

        class MSFFlatchoices(list):
            def __bool__(self):
                return False

            __nonzero__ = __bool__

        return MSFFlatchoices(flat_choices)

    flatchoices = property(_get_flatchoices)

citiesList = []
res = requests.get('https://api.digital.gob.do/v1/territories/provinces' )
response = json.loads(res.text)
for city in response['data']:
    if city['name'] !='Distrito Nacional':
        citiesList.append((city['name'], f"{city['name']}"))

class Ensurance(models.Model):
    name = models.CharField(max_length=200)
    logo = models.ImageField(blank=True)
    search_count = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.name}"
    
class Gender(models.Model):
    gender = models.CharField(max_length=6)
    salutation = models.CharField(max_length=4)

    def __str__(self):
        return(f'{self.gender}')
gender = {
    'female': 'female',
    'male':  'male'
}

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = PhoneNumberField(blank=True)
    bornDate = models.DateField(blank=True, null=True)
    gender = models.ForeignKey(Gender, on_delete=models.SET_NULL, related_name='doctor', null=True, blank=True)
    ensurance = models.ManyToManyField(Ensurance, related_name='ensurances', blank=True)
    recent_doctors = models.ManyToManyField('Doctor', blank=True)
    is_doctor = models.BooleanField(default=False)
    national_id = models.CharField(max_length=13, unique=True, null=True, blank=True, help_text='Dominican National ID (Cédula), e.g. 001-1234567-8')
    exequatur = models.CharField(max_length=10, unique=True, null=True, blank=True, help_text='Dominican Exequatur number assigned by authorities')

class Speciality(models.Model):
    name = models.CharField(max_length=100)
    search_count = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.name}"

class Clinic(models.Model):
    name = models.CharField(max_length=200)
    city = models.CharField(choices=citiesList, max_length=64)
    adress = models.CharField(max_length=500)
    ensurance = models.ManyToManyField(Ensurance, blank=True, related_name="clinics")
    contact = models.CharField(max_length=100)
    map = models.CharField(max_length=500, default='hola')
    phone = PhoneNumberField(null=True, blank=True) 
    search_count = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.name}"
    


class Doctor(models.Model):
    docuser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor', blank=True, null=True)
    name = models.CharField(max_length=64, default='popo')
    specialities = models.ManyToManyField(Speciality, related_name="doctors", blank=True)
    clinics = models.ManyToManyField(Clinic, blank=True, related_name="doctors")
    ensurances = models.ManyToManyField(Ensurance, related_name='doctors', blank=True)
    cities = MultiSelectField(choices=citiesList, max_choices=3, max_length=64, blank=True)
    description = models.CharField(max_length=1000, blank=True)
    renderizable = models.BooleanField(default=False)
    takes_dates = models.BooleanField(default=False)
    in_person = models.BooleanField(default=False)
    virtually = models.BooleanField(default=False)
    image = models.ImageField(default='static/images/profile_picture.jpg',upload_to='static/images', blank=True)
    phone_number = PhoneNumberField(null=True, blank=True)
    search_count = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.name}"
    
    def average_rating(self):
        # Calculate the average rating using related reviews
        return self.reviews.aggregate(Avg('rate')).get('rate__avg') or 0
    
    def get_rating_distribution(self):
        ratings = self.reviews.aggregate(
            one_star=Count('id', filter=Q(rate=1)),
            two_star=Count('id', filter=Q(rate=2)),
            three_star=Count('id', filter=Q(rate=3)),
            four_star=Count('id', filter=Q(rate=4)),
            five_star=Count('id', filter=Q(rate=5))
        )
        total = sum(ratings.values())
        percentages = {key: (value / total * 100 if total > 0 else 0) for key, value in ratings.items()}
        return {"counts": ratings, "percentages": percentages}

class DoctorPatient(models.Model):
    creator = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='created_patients')
    first_name = models.CharField(('first name'),max_length=150,blank=True)
    last_name = models.CharField(('last name'),max_length=150,blank=True)
    national_id = models.CharField(max_length=13, unique=True, null=True, blank=True, help_text='Dominican National ID (Cédula), e.g. 001-1234567-8')
    phone = PhoneNumberField(blank=True, null=True)
    def __str__(self):
        return f"Patient {self.first_name} {self.last_name} created by {self.creator}"


class DoctorContacts(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='contacts')
    phone1 = PhoneNumberField(unique=True, null=True)
    instagram = models.URLField(null=True)
    facebook = models.URLField(null=True)
    phone = PhoneNumberField(blank=True)
    
class Review(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rate = models.PositiveSmallIntegerField()
    headline = models.CharField(max_length=100, blank=True)
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.doctor.name} - {self.rate} Stars"

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(rate__gte=1) & models.Q(rate__lte=5),
                name='rate_between_1_and_5'
            )
        ]

daysToPick = (
    (0, 'Monday'),
    (1, 'Tuesday'),
    (2, 'Wednesday'),
    (3, 'Thursday'),
    (4, 'Friday'),
    (5, 'Saturday'),
    (6, 'Sunday'),
    ('web', 'days')
)

def toMil(val):
    return val * 3600000

hoursToPick = []
for i in range(24):
    hoursToPick.append((f'0{i}:00:00', f'0{i}:00:00'))
    hoursToPick.append((f'0{i}:15:00', f'0{i}:15:00'))
    hoursToPick.append((f'0{i}:30:00', f'0{i}:30:00'))
    hoursToPick.append((f'0{i}:45:00', f'0{i}:45:00'))

modalidades = [
    ('in_person', 'in_person'),
    ('virtually', 'virtually'),
]

minToPick = [
    (0, 0),
    (int(toMil(0.5)), 30)
    ]
    
    
class DoctorDate(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='dates')
    clinica = models.ForeignKey(Clinic, on_delete=models.CASCADE, null=True ,related_name='dates')
    precio = models.IntegerField(default=100)
    days = MultiSelectField(choices=daysToPick, max_length=300)
    horas = MultiSelectField(choices=hoursToPick, max_length=300)
    modalidad = models.CharField(choices=modalidades, max_length=300)
    isActive = models.BooleanField(default=True)
    def __str__(self):
        return f'{self.doctor} Schedule in {self.clinica} on {self.days}'
    


class ClientDate(models.Model):
    date_set = models.ForeignKey(DoctorDate, on_delete=models.CASCADE, default=1, related_name='clients_dates')
    date = models.DateField()
    time = models.TimeField()
    modality = models.CharField(choices=modalidades, max_length=300)
    isActive = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Fields required for GenericForeignKey
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    client = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f'{self.client} date with {self.date_set.doctor} on {self.date} {self.time}'
    