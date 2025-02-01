from django import forms
from phonenumber_field.formfields import PhoneNumberField
from django.core.exceptions import ValidationError
import requests
import json
from allauth.account.forms import SignupForm
from django import forms
from .models import Doctor, Gender, User, DoctorPatient

class CustomUser(SignupForm):
    # Add your custom fields here
    first_name = forms.CharField(max_length=30, required=True, widget=forms.TextInput(attrs={'placeholder': 'Your first name'}))
    last_name = forms.CharField(max_length=30, required=True, widget=forms.TextInput(attrs={'placeholder': 'Your last name'}))

    def save(self, request):
        user = super(CustomUser, self).save(request)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()
        return user

class EditUser(forms.Form):
    first_name = forms.CharField(max_length=30, min_length=2, widget=forms.TextInput(attrs={'placeholder': 'Your first name', 'readonly': True}))
    last_name = forms.CharField(max_length=30, min_length=2, widget=forms.TextInput(attrs={'placeholder': 'Your Last name', 'readonly': True}))
    born_date = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}))
    gender = forms.ModelChoiceField(queryset=Gender.objects.all())

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email"]

    def save(self, request):
        user = request.user
        if self.cleaned_data['first_name']:
            user.first_name = self.cleaned_data['first_name']
        if self.cleaned_data['last_name']:
            user.last_name = self.cleaned_data['last_name']
        if self.cleaned_data['born_date']:
            user.bornDate = self.cleaned_data['born_date']
        if self.cleaned_data['gender']:
            user.gender = self.cleaned_data['gender']
        user.save()
    
class uDocForm(CustomUser):
    exequatur = forms.CharField(max_length=10, min_length=5, label="Exequatur Number", help_text="Provide your exequatur number.")
    phone_number = PhoneNumberField(region='DO', max_length='12', widget=forms.TextInput(attrs={'placeholder': '(800)-000-0000'}))
    national_id = forms.CharField(max_length=11, min_length=11)

    class Meta:
        model = User  # or your custom Doctor model
        fields = ['username', 'email', 'password1', 'password2']

    def save(self, request):
        user = super(uDocForm, self).save(request)
        user.national_id = self.cleaned_data['national_id']
        user.exequatur = self.cleaned_data['exequatur']
        user.phone = self.cleaned_data['phone_number']
        user.is_doctor = True
        user.save()
        return user

class sDocForm(forms.Form):
    # Additional fields for the form
    exequatur = forms.CharField(max_length=10, min_length=5, label="Exequatur Number", help_text="Provide your exequatur number.")
    phone_number = PhoneNumberField(region='DO', max_length='12', widget=forms.TextInput(attrs={'placeholder': '(800)-000-0000'}))
    national_id = forms.CharField(max_length=11, min_length=11)

    def save(self, user):
        # Update user fields
        user.national_id = self.cleaned_data['national_id']
        user.exequatur = self.cleaned_data['exequatur']
        user.phone = self.cleaned_data['phone_number']
        user.is_doctor = True
        user.save(update_fields=['national_id', 'exequatur', 'phone', 'is_doctor'])

        # Create Doctor object linked to the user
        doctor, created = Doctor.objects.get_or_create(
            docuser=user,
            defaults={'name': f"{user.first_name} {user.last_name}"}
        )
        return doctor  # Return the newly created Doctor object

    # def clean_exequatur(self):
    #     e = self.cleaned_data.get('exequatur')
    #     try:
    #         int(e)
    #     except ValueError:
    #         raise ValidationError('Invalid exequatur')
            
        
    def clean_cedula(self):
        c = self.cleaned_data.get('cedula')

        resp = requests.get(f'https://api.digital.gob.do/v3/cedulas/{c}/validate')
        response = resp.json()
        if not response['valid']:
            raise ValidationError('Invalid cedula')
        
class DoctorPatientForm(forms.ModelForm):
    class Meta:
        model = DoctorPatient
        fields = ['first_name', 'last_name', 'national_id', 'phone']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['national_id'].required = False
        self.fields['phone'].required = False

    def clean_national_id(self):
        c = self.cleaned_data.get('national_id')
        if c:
            resp = requests.get(f'https://api.digital.gob.do/v3/cedulas/{c}/validate')
            response = resp.json()
            if not response['valid']:
                print(response['valid'])
                raise ValidationError('Invalid cedula')
            else:
                print(response['valid'])
    
    def clean(self):
        cleaned_data = super().clean()
        national_id = cleaned_data.get('national_id')
        phone = cleaned_data.get('phone')

        # Ensure empty values for optional fields are handled gracefully
        if not national_id:
            cleaned_data['national_id'] = None  # or "" if that's your preference
        if not phone:
            cleaned_data['phone'] = None  # or "" if you prefer

        return cleaned_data
        