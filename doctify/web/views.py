# Create your views here.
import os
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Speciality, Ensurance, Clinic, Doctor, User, citiesList, ClientDate
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
from .forms import uDocForm, sDocForm


def index(request):
    request.session['speciality_val'] = None
    request.session['ensurance_val'] = None
    request.session['clinic_val'] = None
    request.session['city_val'] = None
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

    return render(request, 'myaccount/recent.html',{
        'dates': [d for d in dates], 
    })


def profile_configurate(request):
    doc = Doctor.objects.get(docuser = request.user)
    return render(request, 'myaccount/profile_config.html', {'doctor':doc.serialize()})

def doctor_profile(request):
    return render(request, 'myaccount/doctor_profile.html')

def personal_info(request):
    return render(request, 'myaccount/personal_info.html')


def user_info(request):
    u = request.user
    return JsonResponse(u.username, safe=False)

@login_required(login_url='/accounts/login/')
def myuser(request):
    if request.user.is_authenticated:
        request.session['curr_page'] = 'myuser'
        fav_doctors = []
        u = request.user
        # dates = ClientDate.objects.filter(client=u)
        # if dates:
        #     for d in dates:
        #         if d.doctor not in fav_doctors:
        #             fav_doctors.append(d.doctor)
        return render(request, 'web/user.html', {
            'dates': 'dates',
            'u': u.serialize(),
            'favdoctors': fav_doctors
            })
            
    else:
        return redirect('signin')

@login_required(login_url='/accounts/login/')
def add_ensurance(request, ens_id):
    user = request.user
    try:
        ens = Ensurance.objects.get(pk=ens_id)
        user.ensurance.add(ens)
        return redirect(myuser)

    except:
        return redirect(myuser)
    
@login_required(login_url='/accounts/login/')
def remove_ensurance(request, ens_id):
    user = request.user
    try:
        ens = Ensurance.objects.get(pk=ens_id)
        user.ensurance.remove(ens)
        return redirect(myuser)

    except:
        return redirect(myuser)

@login_required(login_url='/accounts/login/')
def mydates(request):
    u = request.user
    if u.is_doctor:
        doc = Doctor.objects.get(docuser = u)
        dates = ClientDate.objects.filter(doctor = doc)
    else:
        dates = ClientDate.objects.filter(client = u)
    activelist = []
    unactivelist = []
    for d in dates:
        d = d.serialize()
        if d['isactive']:
            activelist.append(d)
        else:
            unactivelist.append(d)

    return JsonResponse([activelist, unactivelist, u.is_doctor], safe=False)

@login_required(login_url='/accounts/login/')
def favdoctors(request):
    # docs = ClientDate.objects.filter(user = request.user)
    return JsonResponse('docs', safe=False)

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


def logout_view(request):
    logout(request)
    return redirect('index')

def clear(model_val, att):
    if model_val == 'email':
        if User.objects.filter(email=att).exists():
            return True
    elif model_val == 'phone':
        if User.objects.filter(phone=att).exists():
            return True
    elif model_val == 'username':
        if User.objects.filter(username=att).exists():
            return True


# use pages

def search(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        if data.get('spec')[0] == 'speciality':
            request.session['speciality_val'] = data.get('spec')[1]
        elif data.get('spec')[0] == 'city':
           request.session['city_val'] = data.get('spec')[1] 
        elif data.get('spec')[0] == 'ensurance':
           request.session['ensurance_val'] = data.get('spec')[1] 
        elif data.get('spec')[0] == 'clinic' :
           request.session['clinic_val'] = data.get('spec')[1] 

        return redirect('search')
    else:
        request.session['curr_page'] = "search"
        return render(request, "web/search.html")
    
def searchInfo(request):
    if request.method == 'POST':
        request.session['speciality_val'] = request.GET.get('speciality')
        return JsonResponse(request.session['speciality_val'], safe=False)
    else:
        return JsonResponse(request.session['speciality_val'], safe=False)



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


# functions   

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



def returnSearch(match, model):
    lista = []
    for p in model:
        p = p.serialize()
        if match == "''" or match == None:
            lista.append(p)
        elif match in p['name'].lower():
            lista.append(p)
    return(lista)

def doctor(request):
    speciality = request.GET.get('speciality')
    city = request.GET.get('city')
    ensurance = request.GET.get('ensurance')
    clinic = request.GET.get('clinic')
    
    page = int(request.GET.get('page'))
    gender = request.GET.get('gender')
    
    if not speciality:
        speciality = request.session['speciality_val']

    if speciality == 'All' or not speciality:
        speciality = None
    else:
        print(speciality)
        speciality = Speciality.objects.get(speciality = speciality)

    if not ensurance:
        ensurance = request.session['ensurance_val']
    if ensurance == 'All' or not ensurance :
        ensurance = None
    else:
        ensurance = Ensurance.objects.get(name = ensurance)

    if not clinic:
        clinic = request.session['clinic_val']
    if clinic == 'All' or not clinic:
        clinic = None 
    else:
        clinic = Clinic.objects.get(name = clinic)

    if not city:
        city = request.session['city_val']
    if city == 'All' or not city:
        city = None

    if gender == 'both':
        gender = None    

    docList =[]

    if speciality and ensurance and clinic and gender and city:
        doctores = Doctor.objects.filter(specialities = speciality, ensurances = ensurance, clinics = clinic, gender = gender, cities__icontains=city)
    elif speciality and ensurance:
        doctores = Doctor.objects.filter(specialities = speciality, ensurances = ensurance)    
    elif speciality and clinic:
        doctores = Doctor.objects.filter(specialities = speciality, clinics = clinic)
    elif speciality and gender:
        doctores = Doctor.objects.filter(specialities = speciality, gender = gender)
    elif speciality and city:
        doctores = Doctor.objects.filter(specialities = speciality, cities__icontains=city)
    elif ensurance and clinic:
        doctores = Doctor.objects.filter(ensurances = ensurance, clinics = clinic)
    elif ensurance and gender:
        doctores = Doctor.objects.filter(ensurances = ensurance, gender = gender)
    elif ensurance and city:
        doctores = Doctor.objects.filter(specialities = speciality, cities__icontains=city)
    elif gender and clinic:
        doctores = Doctor.objects.filter(gender = gender, clinics = clinic)
    elif gender and city:
        doctores = Doctor.objects.filter(specialities = speciality, cities__icontains=city)
    elif clinic and city:
        doctores = Doctor.objects.filter(specialities = speciality, cities__icontains=city)
    elif speciality:
        doctores = Doctor.objects.filter(specialities = speciality)
    elif ensurance:
        doctores = Doctor.objects.filter(ensurance = ensurance)
    elif clinic:
        doctores = Doctor.objects.filter(clinics = clinic)
    elif gender:
        doctores = Doctor.objects.filter(gender = gender)
    elif city:
        doctores = Doctor.objects.filter(cities__icontains=city)
    else:
        doctores = Doctor.objects.all()

    p = Paginator(doctores, 10)
    currentPage = p.page(page)
    next = currentPage.has_next()
    prev = currentPage.has_previous()

    for doc in currentPage:
        doc = doc.serialize()
        docList.append(doc)

    return JsonResponse([docList, f'{currentPage}', prev, next], safe=False)

def ensurance(request, ens_id):
    ens_object = Ensurance.objects.get(pk=ens_id)
    return render(request, 'web/ensurance.html', {
        'ensurance': ens_object.serialize()
    })

def clinic(request, clin_name):
    return render(request, 'web/clinic.html', {
        'clinic': Clinic.objects.get(name=clin_name)
    })

def daysOn(request):
    user_id = request.session['docId']
    doctor = Doctor.objects.get(pk = user_id)
    # horario = DoctorDate.objects.filter(doctor = doctor)
    doc_schedule = []
    # for h in horario:
    #     h = h.serialize()
    #     doc_schedule.append(h)

    if doc_schedule:  
        return JsonResponse(doc_schedule, safe=False)
    else:
        return JsonResponse(None, safe=False)
    
# def docDates(request, doc_id):
    doc = Doctor.objects.get(pk=doc_id)
    dates = ClientDate.objects.filter(doctor=doc)
    dates_list = []
    for d in dates:
        d = d.serialize()
        dates_list.append(d)

    return JsonResponse(dates_list, safe=False)

def daySchedule(request):
    date = request.GET.get('date')

    doctor = Doctor.objects.get(pk=int(request.session['docId']))
    # takenDocDates = ClientDate.objects.filter(doctor=doctor, date=date)
    # dateObj = DoctorDate.objects.get(doctor = doctor)

    schedule = []
    takenHours = []

    # if takenDocDates:
    #     for date in takenDocDates:
    #         takenHours.append(f'{date.serialize()["time"]}')

    #     if takenHours:        
    #         for i in dateObj.serialize()['hours']:
    #             if i not in takenHours:
    #                 schedule.append(i)
    # else:
    #     for i in dateObj.serialize()['hours']:
    #         schedule.append(i)
    # [dateObj.serialize()['clinic'], schedule]

    return JsonResponse('f', safe=False)

weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

def makeDate(request):
    date = request.GET.get('date')
    time = request.GET.get('time')
    clinic = request.GET.get('clinic')
    clinic = Clinic.objects.get(name = clinic)
    doc = Doctor.objects.get(pk=request.session['docId'])
    # takenDates = ClientDate.objects.filter(doctor=doc, date=date, time=time)

    # if request.user.is_authenticated:
    #     u = request.user
    #     if takenDates:
    #         return JsonResponse([False, f'This date is occupied'], safe=False)
    #     else:
    #         try:
    #             newdate = ClientDate.objects.create(doctor=doc, clinic=clinic, date=date,time=time, client=u)
    #             msgDate = f'Date with {doc} created!'
    #             strDate = f'{newdate.serialize()["date"]}'
    #             strTime = f'{newdate.serialize()["time"]}'
    #             u.recent_doctors.add(doc)
    #             return JsonResponse([True, msgDate, strDate, strTime], safe=False)
    #         except:
    #             return JsonResponse([False, 'wak waaaak'], safe=False)
    # else:
    return redirect('signin')

def canceldate(request, date_id):
    # date = ClientDate.objects.get(pk=int(date_id)) 
    # date.delete()
    return redirect(dates)

def makeDates(request):
    doc = Doctor.objects.get(pk=request.session['docId'])
    # docdates = DoctorDate.objects.filter(doctor=doc)
    if request.method =='POST':
        date = request.POST['date']
        clin = request.POST['clinic']
        clinic = Clinic.objects.get(name=clin)
            
        date = int(date)/1000 + 14400
        newdate = datetime.datetime.fromtimestamp(date)
        hours, min = newdate.strftime("%X")[:5].split(':')
        hours = int(hours) * 3600000
        min = int(min) * 60000

        # if request.user.is_authenticated:
        #     try:
        #         u = request.user

        #         # crear lista con los dias de la semana
        #         datesDays, takenDates, p = cDateArgs(docdates, doc, newdate, hours, min)

        #         # if the desired date day is not correct || 
        #         if p > len(datesDays) or date in takenDates:
        #             return HttpResponse(f'NO ')
        #         else:  
        #             ClientDate.objects.create(doctor=doc, clinic=clinic, date=newdate, client=u)
        #             return HttpResponse(f'YES')
        #     except:
        #         return render(request, "web/profile.html", {
        #             'doctor': doc,
        #             'ens': doc.ensurance.all().values(),
        #             'message': 'Unable to create the appointment'
        #             })
        # else:
        #     request.session['dateVal'] = [doc.id, clinic.id, date]   
        #     return render(request, 'web/signin.html', {
        #         'message': 'Unable to create the appointment!'
        #     })
    else:
        clinic = Clinic.objects.get(pk=int(request.session['dateVal'][1]))

        date = int(request.session['dateVal'][2])
        newdate = datetime.datetime.fromtimestamp(date)
        hours, min = newdate.strftime("%X")[:5].split(':')
        hours = int(hours) * 3600000
        min = int(min) * 60000

        # datesDays, takenDates, p = cDateArgs(docdates, doc, newdate, hours, min)

        request.session['dateVal'] = []

        # if p > len(datesDays) or date in takenDates:
        #     return HttpResponse(f'NO {newdate.strftime("%a")}{datesDays}{int(hours) + int(min) + 14400000}')
        # else:  
        # ClientDate.objects.create(doctor=doc, clinic=clinic, date=newdate, client=request.user)
        return HttpResponse(f'YES {newdate}')

def cDateArgs(docdates, doctor, nd, hours, min):
    datesDays=[]
    takenDates = []
    p = 0
    for d in docdates:
        t_datesLists = []
        for i in d.serialize()['days']:
            t_datesLists.append(weekdays[i - 1])
        datesDays.append(t_datesLists)


    # for d in ClientDate.objects.filter(doctor=doctor):
    #     takenDates.append((int(d.serialize()['date'])/1000) + 14400)


    for d in range(len(datesDays) + 1):
        try:
            if nd.strftime("%a") in datesDays[d] and ((hours + min + 14400000) in docdates[d].serialize()['hours']):
                p = p
                break
            else:
                p+= 1 
        except IndexError:
            p = len(datesDays) + 2
    
    return datesDays, takenDates, p

def specialities(request):
    specialities = Speciality.objects.all()
    spe_list = ['All']
    for s in specialities:
        s = s.serialize()
        spe_list.append(s['name'])
    return JsonResponse(spe_list, safe=False)

def ensurances(request):
    ensurances = Ensurance.objects.all()

    if request.GET.get('type'):
        ens_list = []
        my_ens_list = []
        for e in ensurances:
            if e not in request.user.ensurance.all(): 
                e = e.serialize()
                ens_list.append(e)
            else:
                e = e.serialize()
                my_ens_list.append(e)
        return JsonResponse([ens_list, my_ens_list], safe=False)
    else:
        
        ens_list = ['All']
        for e in ensurances:
            e = e.serialize()
            ens_list.append(e['name'])
        
        return JsonResponse(ens_list, safe=False)

def clinics(request):
    
    clinics = Clinic.objects.all()
    cli_list = ['All']
    for s in clinics:
        s = s.serialize()
        cli_list.append(s['name'])
    return JsonResponse(cli_list, safe=False)

def cities(request):
    citiesSet = ['All']
    for city in citiesList:
        citiesSet.append(city[0])
    return JsonResponse(citiesSet, safe=False)

def getValue(request, type):
    response = request.session[f'{type}_val']
    print(type)
    if response == None:
        response = 'All'

    return JsonResponse(response, safe=False)
    