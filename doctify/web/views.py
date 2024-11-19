# Create your views here.
import os
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Speciality, Ensurance, Clinic, Doctor, DoctorDate, User, citiesList, ClientDate
from .serializers import DoctorSerializer, ClientDateSerializer, DoctorDateSerializer, SpecialitySerializer, ClinicSerializer, EnsuranceSerializer
from django.db import IntegrityError
from django.http import JsonResponse
import datetime
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from phonenumber_field.validators import validate_international_phonenumber
from django.core.paginator import Paginator
from geopy.geocoders import Nominatim
import requests
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .forms import uDocForm, sDocForm, EditUser
import calendar
from datetime import datetime


def index(request):
    request.session['speciality_val'] = None
    request.session['ensurance_val'] = None
    request.session['clinic_val'] = None
    request.session['city_val'] = None
    request.session['gender'] = None
    request.session['curr_page'] = 'index'
    request.session['user_loc'] = []
    request.session['dateVal'] = []
    speciality = Speciality.objects.all()

    
    return render(request, 'web/index.html', {
        'speciality': speciality
    })

def redirect_page(request):
    if not request.session['curr_page']:
        request.session['curr_page'] = 'index' 

    return redirect(request.session['curr_page'])


# USER PAGES

def dates(request):
    # dates = ClientDate.objects.filter(client = request.user)
    return render(request, 'myaccount/dates.html',{
        'u': request.user
    })

def recent(request):
    u = request.user
    if u.is_doctor:
        print('yes')
        doc = Doctor.objects.get(docuser = u)
        dates = ClientDate.objects.filter(doctor = doc)
    else:
        print('no')
        dates = u.recent_doctors.all()
    print(dates)
    return render(request, 'myaccount/recent.html',{
        'dates': [d for d in dates], 
    })


def profile_configurate(request):
    doc = Doctor.objects.get(docuser = request.user)
    return render(request, 'myaccount/profile_config.html', {'doctor':doc.serialize()})

def doctor_profile(request):
    doc = Doctor.objects.get(docuser = request.user)
    
    return render(request, 'myaccount/doctor_profile.html', {
        'specialities': doc.specialities.all(),
        'ensurances': doc.ensurances.all(),
        'clinics': doc.clinics.all(),
        'description': doc.description,
        'doc':doc
        })

def personal_info(request):
    return render(request, 'myaccount/personal_info.html')

def personal_info_edit(request):
    if request.method =='POST':
        form = EditUser(request.POST)

        if form.is_valid():
            form.save(request)
            return redirect('personal')
        else:
            return render(request, 'myaccount/personal_info_edit.html', {
            'form':form
            })
    initial_data = {
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'born_date': request.user.bornDate
    }
    form = EditUser(initial=initial_data)
    return render(request, 'myaccount/personal_info_edit.html', {
        'form':form
    })

def login_data(request):
    return render(request, 'myaccount/login_data.html')


def user_info(request):
    u = request.user
    return JsonResponse([u.username, u.is_doctor], safe=False)


@login_required(login_url='/accounts/login/')
def mydates(request):
    u = request.user
    active = json.loads(request.GET.get('active'))

    if u.is_doctor:
        doc = Doctor.objects.get(docuser = u)
        date_sets = DoctorDate.objects.filter(doctor = doc)
        aDates = ClientDateSerializer(ClientDate.objects.filter(date_set__in = [int(d.id) for d in date_sets], isActive = active), many=True)
        dates_list = [[None, None, f"{d['client']['first_name']} {d['client']['last_name']}", d['date'],  d['time'],  d['date_set']['clinica']['name']]  for d in aDates.data]
    else:
        dates = ClientDateSerializer(ClientDate.objects.filter(client = u, isActive = active), many=True)
        dates_list = [[d['id'], f"{d['date_set']['doctor']['image']}", d['date_set']['doctor']['name'], d['date'], d['time'], d['date_set']['clinica']['name']]  for d in dates.data]

    if not active:
        page = json.loads(request.GET.get('page'))
        p = Paginator(dates_list, 10)

        currentPage = p.page(page)
        next = currentPage.has_next()
        print(page)
        return JsonResponse([[c for c in currentPage], next], safe=False)
    else:
        print(dates_list)
        return JsonResponse([dates_list, not u.is_doctor], safe=False)

# Validate Doctor's credentials
def doctor_signup(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            form = sDocForm(request.POST)

            if form.is_valid():
                return redirect('index')
            else:
                return render(request, 'account/doctor_signup.html', {
                'form': sDocForm(request.POST)
            })
        else:
            form = uDocForm(request.POST)

            if form.is_valid():
                form.save(request)
                u = request.POST['username']
                p = request.POST['password1']
                user = authenticate(request, username=u, password=p)
                user.is_doctor = True
                user.save()
                login(request, user)
                return redirect('index')
            else:
                return render(request, 'account/doctor_signup.html', {
                'form': uDocForm(request.POST)
            })
    else:
        if request.user.is_authenticated:
            if request.user.is_doctor:
                return redirect('index')
            form = sDocForm()
        else:
            form = uDocForm()
            request.session['curr_page'] = 'doctor_signup'
        return render(request, 'account/doctor_signup.html', {
            'form': form
        })
    
# SPECS MANAGEMENT
def my_spec(request):
    doc = Doctor.objects.get(docuser = request.user)
    spec = request.GET['spec']

    if request.method == 'POST':
        bod = request.body
        spec_value = json.loads(bod)
        print(spec_value['spec'])
        if spec == 'ensurance':
            spec_val = Ensurance.objects.get(name=spec_value['spec'])
        elif spec == 'speciality':
            spec_val = Speciality.objects.get(name=spec_value['spec'])
        elif spec == 'clinic':
            spec_val = Clinic.objects.get(name=spec_value['spec'])
            
        if spec_value['delete']:
            if spec == 'ensurance':
                doc.ensurances.remove(spec_val)
            if spec =='speciality':
                doc.specialities.remove(spec_val)
            if spec =='clinic':
                doc.clinics.remove(spec_val)
        else:
            print(spec)
            if spec =='ensurance':
                doc.ensurances.add(spec_val)
            if spec =='speciality':
                doc.specialities.add(spec_val)
            if spec =='clinic':
                doc.clinics.add(spec_val)

# UPDATES THE DOCTOR PROGILE DESCRPITION BY POSTING THE NEW ONE
def edit_description(request):
    doc = Doctor.objects.get(docuser = request.user)
    if request.method =='POST':
        body = request.body
        description = json.loads(body)
        doc.description = description['body']
        doc.save()
    else:
        return JsonResponse(doc.description, safe=False)

# LOG OUT
def logout_view(request):
    logout(request)
    return redirect('index')

# STORES THE SEARCH FILTERS VALUES
def search(request):
    spec = None
    if request.method == 'POST':

        data = json.loads(request.body)
        if data.get('spec')[1] != 'All':
            spec = data.get('spec')[1]

        request.session[f'{data.get("spec")[0]}_val'] = spec
        return JsonResponse(True, safe=False)

    else:
        request.session['gender'] = None
        request.session['curr_page'] = "search"
        return render(request, "web/search.html")
    
# FUNCTION THAT STORES USER LOCATION IN REQUEST SESSION
def locateUser(request):
    if request.session['user_loc']:
        return JsonResponse(request.session['user_loc'], safe=False)
    
    else:
        latitude = request.GET.get('lat')
        longitude = request.GET.get('lon')
        coords = f'{latitude} , {longitude}'

        geolocator = Nominatim(user_agent="doctify")
        location = geolocator.reverse(coords)
        address = location.raw['address']
        request.session['user_loc'] = address['state']
        request.session['city_val'] = address['state']

    return JsonResponse(request.session['user_loc'], safe=False)

# GET PROFILE VIEW OF A DOCTOR
def profile(request, doctor_id):
    request.session['docId'] = doctor_id
    doc = Doctor.objects.get(pk=doctor_id)
    request.session['curr_page'] = f'{doctor_id}/profile'
    try:
        # docdates = DoctorDate.objects.get(doctor=doc)
        docdates = 'd'
    except:
        docdates = None
    return render(request, "web/profile.html", {
        'doctor': doc.serialize(),
        'ens': doc.ensurances.all().values(),
        'clinics': doc.clinics.all().values(),
        'docDates': docdates
        })


# GET ALL DOCTORS WITH FILTERS VALUES
def doctor(request):
    page = int(request.GET.get('page'))
    speciality = request.session['speciality_val']
    ensurance = request.session['ensurance_val']    
    clinic = request.session['clinic_val']
    city = request.session['city_val']
    gender = request.session['gender']   

    if speciality:
        speciality = Speciality.objects.get(name = speciality)

    if ensurance:
        ensurance = Ensurance.objects.get(name = ensurance)

    if clinic:
        clinic = Clinic.objects.get(name = clinic)

    docList =[]

    filters = {
        'specialities': speciality,
        'ensurances': ensurance,
        'clinics': clinic, 
        'gender': gender, 
        'cities__icontains': city
    }
    cleaned_filters = {key: value for key, value in filters.items() if value is not None}
    doctores = Doctor.objects.filter(**cleaned_filters)
    doctores = DoctorSerializer(doctores, many=True)

    p = Paginator(doctores.data, 10)
    currentPage = p.page(page)
    next = currentPage.has_next()
    prev = currentPage.has_previous()

    for doc in currentPage:
        docList.append(doc)

    return JsonResponse([docList, f'{currentPage}', prev, next], safe=False)

# RENDERS THE ENSURANCE PAGE
def ensurance(request, ens_id):
    ens_object = Ensurance.objects.get(pk=ens_id)
    return render(request, 'web/ensurance.html', {
        'ensurance': ens_object.serialize()
    })

# RENDERS THE CLINIC PAGE
def clinic(request, clin_name):
    return render(request, 'web/clinic.html', {
        'clinic': Clinic.objects.get(name=clin_name)
    })

# GET CALENDAR RENDER, DOCTOR DATES AND TAKEN DATES AND CREATE DATE
def calendarView(request, doc_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        year, month, day = data['date'].split('-')

        date_val = datetime(int(year), int(month), int(day))
        date_set = DoctorDate.objects.get(pk= int(data['date_set']))
        existing_date, new_date = ClientDate.objects.get_or_create(date_set = date_set, date = date_val.strftime('%Y-%m-%d'), time = data['time'], client = request.user, isActive = True)
        
        if new_date:
            u = request.user
            u.recent_doctors.add(date_set.doctor.id)
            return JsonResponse([True, f'Date Created succesfully!'], safe=False)
        else:
            print(existing_date)
            return JsonResponse([False, 'Unable to create date!'], safe=False)
        

    else:
        y = int(request.GET.get('year'))
        m = int(request.GET.get('month')) + 1
        cal = calendar.monthcalendar(y,m)
        today = datetime.today().strftime('%d')
        t = datetime.today()
        print(type(t.day))
        doctor = Doctor.objects.get(pk=doc_id)
        doc_dates = DoctorDateSerializer(DoctorDate.objects.filter(doctor=doctor), many=True)

        if request.GET.get('date_id') and request.GET.get('day'):
            id_list = request.GET.get('date_id').split(',')
            id_list = [int(item) for item in id_list]
            selected_day = request.GET.get('day') 
            dates = [{"id": date['id'],"name": date['clinica']['name'], "hours": date['horas']} for date in doc_dates.data if date['id'] in id_list]
            availability = []
            if len(str(selected_day)) < 2:
                renday = f'0{selected_day}'
            else:
                renday = selected_day

            for date in dates:
                temp = []
                for h in date['hours']:
                    print(h)
                    if not ClientDate.objects.filter(date_set = date['id'], date = f'{y}-{m}-{renday}', time = h).exists():
                        if not temp:
                            temp = {"dateset_id":date['id'], "clinic_name":date['name'], "hours": [time_format(h)], "day":selected_day}
                        else:
                            temp['hours'].append(time_format(h))
                availability.append(temp)

            return JsonResponse(availability, safe=False)
        else:
            doc_dates_list = []
            calendar_dates = []


            for date in doc_dates.data:
                doc_dates_list.append({"id": date['id'], "days": date['days'], "hours": date['horas'] })
            
            list_limit = 0
            for day_set in cal:
                count = 0
                for day in day_set:
                    date_day = []
                    if day != 0:
                        for date_list in doc_dates_list:
                            for d in date_list['days']:
                                if day == day_set[int(d)] :
                                    hours_available = []
                                    for h in date_list['hours']:
                                        if t.year == y and t.month == m :
                                            if  day > t.day:
                                                if len(str(day)) < 2:
                                                    renday = f'0{day}'
                                                else:
                                                    renday = day
                                                if not ClientDate.objects.filter(date_set = date_list['id'], date = f'{y}-{m}-{renday}', time = h).exists():
                                                    hours_available.append(h)
                                        else:
                                            hours_available.append(h)

                                    if hours_available:
                                        if date_day and date_list['id'] != date_day[0]:
                                            date_day[0] = [date_day[0], date_list['id']]
                                        else:
                                            date_day = [date_list['id'], day]
                        if date_day:
                            if count == 0:
                                calendar_dates.append([date_day])
                            else:
                                calendar_dates[list_limit].append(date_day)
                        else:
                            if count == 0:
                                calendar_dates.append([[False, day]])
                            else:
                                calendar_dates[list_limit].append([False, day])
                    else:
                        if count == 0:
                            calendar_dates.append([[False, day]])
                        else:
                            calendar_dates[list_limit].append([False, day])
                    # print(count)
                    count = count + 1
                    
                list_limit = list_limit + 1 
            return JsonResponse(
                {
                    'year': y, 
                    'month': calendar.month_name[m], 
                    'day_names': list(calendar.day_abbr),
                    'calendar_days': calendar_dates
                }, safe=False
            )
    
#SET THE TIME IN AM AND PM 
def time_format(time):
    hours = []
    h, m = time.split(':')
    if int(h) < 12:
        hours = [time, f'{time} AM']
    elif int(h) == 12:
        hours = [time, f'{time} PM']
    else:
        hours = [time, f'{int(h) - 12}:{m} PM']
    return hours

# CANCEL DATE
def canceldate(request, date_id):
    try:
        date = ClientDate.objects.get(pk=int(date_id)) 
        date.delete()
        return JsonResponse([True, 'Date canceled correctly'], safe=False)
    except:
        return JsonResponse([False, 'Unable to cancel date'], safe=False)


# get all values of specific Spec
def get_spec(request):
    spec = request.GET.get('spec')
    for_search = json.loads(request.GET.get('for_search'))
    my_spec = json.loads(request.GET.get('my_spec'))
    specs_list = []

    if spec == 'speciality':
        specs = SpecialitySerializer(Speciality.objects.all(), many=True)
    elif spec == 'ensurance':
        specs = EnsuranceSerializer(Ensurance.objects.all(), many=True)
    elif spec == 'clinic':
        specs = ClinicSerializer(Clinic.objects.all(), many=True)
    elif spec == 'city':
        specs = citiesList


    if not for_search:
        doc = Doctor.objects.get(docuser = request.user)
        if spec == 'speciality':
            query_set = SpecialitySerializer(doc.specialities.all(), many=True)
        elif spec == 'ensurance':
            query_set = EnsuranceSerializer(doc.ensurances.all(), many=True)
        elif spec == 'clinic':
            query_set = ClinicSerializer(doc.clinics.all(), many=True)

        if spec != 'ensurance':
            specs_list = [s['name'] for s in query_set.data]
        else:
            specs_list = [[s['name'], f"/static/images/{s['logo']}"] for s in query_set.data]

        if not my_spec:
            if spec != 'ensurance':
                specs_list = [s['name'] for s in specs.data if s['name'] not in specs_list]
            else:
                specs_list = [[s['name'], f"/static/images/{s['logo']}"] for s in specs.data if [s['name'], f"/static/images/{s['logo']}"] not in specs_list]

            if not specs_list:
                if spec != 'ensurance':
                    specs_list.append('No results')
                else:
                    specs_list.append(['No results', False])
        else:
            if not specs_list:
                specs_list = False

    else:
        if spec != 'city':
            if spec != 'speciality':
                specs_list.append('All')
            for s in specs.data:
                specs_list.append(s['name'])
        else:
            for s in specs:
                specs_list.append(s[0])

        if not specs_list:
            specs_list.append('No results')

    return JsonResponse(specs_list, safe=False)