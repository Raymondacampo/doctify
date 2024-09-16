# Create your views here.
import os
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Speciality, Ensurance, Clinic, Doctor, Dates, ClientDates, User, citiesList
from django import forms
from django.db import IntegrityError
from django.http import JsonResponse
import datetime
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from phonenumber_field.formfields import PhoneNumberField
from django.core.paginator import Paginator
from geopy.geocoders import Nominatim
import requests
import json
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.decorators import login_required


class createUser(forms.Form):
    doc_fname = forms.CharField(max_length=64, widget=forms.TextInput(attrs={'placeholder':'Your First Name', 'class':'bx_s'}))
    doc_lname = forms.CharField(max_length=64, widget=forms.TextInput(attrs={'placeholder':'Your Last Name', 'class':'bx_s'}))
    email = forms.EmailField(widget=forms.TextInput(attrs={'placeholder':'juanperez@email.com', 'class':'bx_s', 'onkeyup':'reset_input_msg("email_div", "email_message")'}))    
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Your Password', 'class':'bx_s', 'onkeyup':'reset_input_msg("password_div", "password_message")'}), min_length=2)
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Confirm Password', 'class':'bx_s', 'onkeyup':'reset_input_msg("confirmation_div", "password_message")'}), min_length=2)
    phone = PhoneNumberField(region='DO', widget=forms.TextInput(attrs={'placeholder':'(809) 000-0000', 'class':'bx_s', 'font-size':'24px', 'onkeyup':'reset_input_msg("phone_div", "phone_message")'}))
    username = forms.CharField(max_length=64, widget=forms.TextInput(attrs={'placeholder':'Your Username', 'class':'bx_s', 'onkeyup':'reset_input_msg("username_div", "username_message")'}))
    # npi = forms.CharField(max_length=10, min_length=10, widget=forms.TextInput(attrs={'placeholder':'NPI', 'class':'bx_s'}))

# pages

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
    dates = ClientDates.objects.filter(client = request.user)
    return render(request, 'myaccount/dates.html',{
        'dates': dates
    })

def recent_doctors(request):
        return render(request, 'myaccount/recent_doctors.html')


def configurate(request):
        return render(request, 'myaccount/configuration.html')


@login_required(login_url='/accounts/login/')
def myuser(request):
    if request.user.is_authenticated:
        request.session['curr_page'] = 'myuser'
        fav_doctors = []
        u = request.user
        dates = ClientDates.objects.filter(client=u)
        if dates:
            for d in dates:
                if d.doctor not in fav_doctors:
                    fav_doctors.append(d.doctor)
        return render(request, 'web/user.html', {
            'dates': dates,
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
    dates = ClientDates.objects.filter(client = request.user)
    activelist = []
    unactivelist = []
    for d in dates:
        d = d.serialize()
        if d['isactive']:
            activelist.append(d)
        else:
            unactivelist.append(d)

    return JsonResponse([activelist, unactivelist], safe=False)

@login_required(login_url='/accounts/login/')
def favdoctors(request):
    docs = ClientDates.objects.filter(user = request.user)
    return JsonResponse('docs', safe=False)



# ACCOUNT CREATIONS
def signin(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_name = data.get('user')
        password = data.get('password')
        user = authenticate(username=user_name, password=password)
        if user:
            login(request, user)
            return JsonResponse(True, safe=False)
        else:
            return JsonResponse([False, 'Usuario o contrasena incorrectos!'], safe=False)            
        
    return render(request, 'web/signin.html')

def doc_signup(request):
    form = createUser(request.POST)
    if request.method == 'POST':
        if form.is_valid():
            fname = form.cleaned_data['doc_fname']
            lname = form.cleaned_data['doc_lname']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            confirmation = form.cleaned_data['password2']
            phone = form.cleaned_data['phone']
            username = form.cleaned_data['username']

            if password != confirmation:
                return render(request, 'web/docsignup.html', {
                    'pmessage':'Passwords wont match',
                    'form':form
                })
        else:
            return render(request, 'web/docsignup.html', {
                'pherror':form.errors.items,
                'form':form
            })

        try:
            docUser = User.objects.create(username = username, first_name = fname, last_name = lname, email = email, phone =phone, password = password)
            doctor = Doctor.objects.create(docuser = docUser, name= f'{fname} {lname}', contact = phone.national_number)
            login(request, docUser)

            return redirect('myuser')
        
        except IntegrityError:
            if clear('email', email):
                return render(request, 'web/docsignup.html', {
                    'emessage':'Email already taken',
                    'form':form
                })
            if clear('phone', phone):
                return render(request, 'web/docsignup.html', {
                    'phmessage':'Phone number already taken',
                    'form':form
                })
            if clear('username', username):
                return render(request, 'web/docsignup.html', {
                    'umessage':'Username taken!',
                    'form':form
                })

    return render(request, 'web/docsignup.html', {
        'form': createUser()    })

def signup(request):
    form = createUser(request.POST)
    if request.method == 'POST':
        if form.is_valid():
            user_name = form.cleaned_data['user_name']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            confirmation = form.cleaned_data['password2']

            if password != confirmation:
                 return render(request, 'web/signup.html', {
                    'message':'Passwords wont match',
                    'form':createUser()
                })
            
        try:
            u = User.objects.create_user(user_name, email, password)
            u.save()
            
        except IntegrityError:
            return render(request, 'web/signup.html', {
                    'message':'Username taken!',
                    'form':createUser()
                })
        if request.session['dateVal']:
            login(request, u)
            return redirect('makedate', args=[request.session['dateVal'][0]])
        else:
            login(request, u)
            return redirect('index')
    
    else:
        return render(request, 'web/signup.html', {
            'form': createUser()
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
        docdates = Dates.objects.get(doctor=doc)
    except:
        docdates = None
    return render(request, "web/profile.html", {
        'doctor': doc.serialize(),
        'ens': doc.ensurance.all().values(),
        'clinics': doc.clinic.all().values(),
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
        doctores = Doctor.objects.filter(speciality = speciality, ensurance = ensurance, clinic = clinic, gender = gender, city__icontains=city)
    elif speciality and ensurance:
        doctores = Doctor.objects.filter(speciality = speciality, ensurance = ensurance)    
    elif speciality and clinic:
        doctores = Doctor.objects.filter(speciality = speciality, clinic = clinic)
    elif speciality and gender:
        doctores = Doctor.objects.filter(speciality = speciality, gender = gender)
    elif speciality and city:
        doctores = Doctor.objects.filter(speciality = speciality, city__icontains=city)
    elif ensurance and clinic:
        doctores = Doctor.objects.filter(ensurance = ensurance, clinic = clinic)
    elif ensurance and gender:
        doctores = Doctor.objects.filter(ensurance = ensurance, gender = gender)
    elif ensurance and city:
        doctores = Doctor.objects.filter(speciality = speciality, city__icontains=city)
    elif gender and clinic:
        doctores = Doctor.objects.filter(gender = gender, clinic = clinic)
    elif gender and city:
        doctores = Doctor.objects.filter(speciality = speciality, city__icontains=city)
    elif clinic and city:
        doctores = Doctor.objects.filter(speciality = speciality, city__icontains=city)
    elif speciality:
        doctores = Doctor.objects.filter(speciality = speciality)
    elif ensurance:
        doctores = Doctor.objects.filter(ensurance = ensurance)
    elif clinic:
        doctores = Doctor.objects.filter(clinic = clinic)
    elif gender:
        doctores = Doctor.objects.filter(gender = gender)
    elif city:
        doctores = Doctor.objects.filter(city__icontains=city)
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
    horario = Dates.objects.filter(doctor = doctor)
    doc_schedule = []
    for h in horario:
        h = h.serialize()
        doc_schedule.append(h)

    if doc_schedule:  
        return JsonResponse(doc_schedule, safe=False)
    else:
        return JsonResponse(None, safe=False)
    
# def docDates(request, doc_id):
    doc = Doctor.objects.get(pk=doc_id)
    dates = ClientDates.objects.filter(doctor=doc)
    dates_list = []
    for d in dates:
        d = d.serialize()
        dates_list.append(d)

    return JsonResponse(dates_list, safe=False)

def daySchedule(request):
    date = request.GET.get('date')

    doctor = Doctor.objects.get(pk=int(request.session['docId']))
    takenDocDates = ClientDates.objects.filter(doctor=doctor, date=date)
    dateObj = Dates.objects.get(doctor = doctor)

    schedule = []
    takenHours = []

    if takenDocDates:
        for date in takenDocDates:
            takenHours.append(f'{date.serialize()["time"]}')

        if takenHours:        
            for i in dateObj.serialize()['hours']:
                if i not in takenHours:
                    schedule.append(i)
    else:
        for i in dateObj.serialize()['hours']:
            schedule.append(i)

    return JsonResponse([dateObj.serialize()['clinic'], schedule], safe=False)

weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

def makeDate(request):
    date = request.GET.get('date')
    time = request.GET.get('time')
    clinic = request.GET.get('clinic')
    clinic = Clinic.objects.get(name = clinic)
    doc = Doctor.objects.get(pk=request.session['docId'])
    takenDates = ClientDates.objects.filter(doctor=doc, date=date, time=time)

    if request.user.is_authenticated:
        u = request.user
        if takenDates:
            return JsonResponse([False, f'This date is occupied'], safe=False)
        else:
            try:
                newdate = ClientDates.objects.create(doctor=doc, clinic=clinic, date=date,time=time, client=u)
                msgDate = f'Date with {doc} created!'
                strDate = f'{newdate.serialize()["date"]}'
                strTime = f'{newdate.serialize()["time"]}'

                return JsonResponse([True, msgDate, strDate, strTime], safe=False)
            except:
                return JsonResponse([False, 'wak waaaak'], safe=False)
    else:
        return redirect('signin')

def canceldate(request, date_id):
    date = ClientDates.objects.get(pk=int(date_id)) 
    date.delete()
    return redirect(dates)

def makeDates(request):
    doc = Doctor.objects.get(pk=request.session['docId'])
    docdates = Dates.objects.filter(doctor=doc)
    if request.method =='POST':
        date = request.POST['date']
        clin = request.POST['clinic']
        clinic = Clinic.objects.get(name=clin)
            
        date = int(date)/1000 + 14400
        newdate = datetime.datetime.fromtimestamp(date)
        hours, min = newdate.strftime("%X")[:5].split(':')
        hours = int(hours) * 3600000
        min = int(min) * 60000

        if request.user.is_authenticated:
            try:
                u = request.user

                # crear lista con los dias de la semana
                datesDays, takenDates, p = cDateArgs(docdates, doc, newdate, hours, min)

                # if the desired date day is not correct || 
                if p > len(datesDays) or date in takenDates:
                    return HttpResponse(f'NO ')
                else:  
                    ClientDates.objects.create(doctor=doc, clinic=clinic, date=newdate, client=u)
                    return HttpResponse(f'YES')
            except:
                return render(request, "web/profile.html", {
                    'doctor': doc,
                    'ens': doc.ensurance.all().values(),
                    'message': 'Unable to create the appointment'
                    })
        else:
            request.session['dateVal'] = [doc.id, clinic.id, date]   
            return render(request, 'web/signin.html', {
                'message': 'Unable to create the appointment!'
            })
    else:
        clinic = Clinic.objects.get(pk=int(request.session['dateVal'][1]))

        date = int(request.session['dateVal'][2])
        newdate = datetime.datetime.fromtimestamp(date)
        hours, min = newdate.strftime("%X")[:5].split(':')
        hours = int(hours) * 3600000
        min = int(min) * 60000

        datesDays, takenDates, p = cDateArgs(docdates, doc, newdate, hours, min)

        request.session['dateVal'] = []

        if p > len(datesDays) or date in takenDates:
            return HttpResponse(f'NO {newdate.strftime("%a")}{datesDays}{int(hours) + int(min) + 14400000}')
        else:  
            ClientDates.objects.create(doctor=doc, clinic=clinic, date=newdate, client=request.user)
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


    for d in ClientDates.objects.filter(doctor=doctor):
        takenDates.append((int(d.serialize()['date'])/1000) + 14400)


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
    