# Create your views here.
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from .models import Speciality, Ensurance, Clinic, Doctor, DoctorDate, User, citiesList, ClientDate, Review, DoctorPatient
from .serializers import UserSerializer, DoctorPatientSerializer, DoctorSerializer, ClientDateSerializer, DoctorDateSerializer, SpecialitySerializer, ClinicSerializer, EnsuranceSerializer, ReviewSerializer
from django.db.models import Count, Q, Avg
from django.http import JsonResponse
import datetime
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from geopy.geocoders import Nominatim
import multiselectfield
import json
from django.contrib.auth.decorators import login_required
from .forms import uDocForm, sDocForm, EditUser, DoctorPatientForm
import calendar
from datetime import datetime, timedelta
from django.contrib.contenttypes.models import ContentType
from django.core.mail import send_mail

def index(request):
    request.session['speciality_val'] = None
    request.session['ensurance_val'] = None
    request.session['clinic_val'] = None
    request.session['city_val'] = None
    request.session['gender_val'] = None
    request.session['takedate_val'] = None
    request.session['datetype_val'] = None
    request.session['form_data'] = None
    request.session['curr_page'] = 'index'
    request.session['user_loc'] = []
    request.session['dateVal'] = []
    speciality = Speciality.objects.all()

    
    return render(request, 'web/index.html', {
        'speciality': speciality
    })

def redirect_page(request):
    return redirect(request.session.get('curr_page', 'index'))


# USER PAGES

def dates(request):
    if request.user.is_doctor:
        doc = Doctor.objects.get(docuser = request.user)
        dates = ClientDate.objects.filter(date_set__doctor = doc)
    else:
        dates = ClientDate.objects.filter(object_id = request.user.id)

    active = []
    unactive = []

    for d in dates:
        if d.isActive:
            active.append(d)
        else:
            unactive.append(d)

    a_page = request.GET.get('a_page')
    u_page = request.GET.get('u_page')
    a_p = Paginator(active, 10)
    u_p = Paginator(unactive, 10)

    active_dates = a_p.page(a_page)
    unactive_dates = u_p.page(u_page)

    return render(request, 'myaccount/dates.html',{
        'u': request.user,
        'active_dates': ClientDateSerializer(active_dates, many=True).data,
        'unactive_dates': ClientDateSerializer(unactive_dates, many=True).data,
        'a_pagination': active_dates,
        'u_pagination': unactive_dates,
    })

def about_us(request):
    return render(request, 'web/about_us.html')

def terms_of_service(request):
    return render(request, 'web/terms_of_service.html')

def privacy_policy(request):
    return render(request, 'web/privacy_policy.html')

def contact_us(request):
    return render(request, 'web/contact_us.html')

def faqs(request):
    return render(request, 'web/faqs.html')

def send_message(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        # Prepare email content
        subject = f"New Message from {name} via Doctify"
        body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
        recipient_list = ['support@doctify.com']  # Replace with your support email
        from_email = 'noreply@doctify.com'       # Replace with a valid email address

        try:
            # Send email
            send_mail(subject, body, from_email, recipient_list, fail_silently=False)
            messages.success(request, "Your message has been sent successfully!")
        except Exception as e:
            messages.error(request, "An error occurred while sending your message. Please try again later.")
            print(f"Error sending email: {e}")

        return redirect('contact_us')  # Redirect back to the contact page
    else:
        return redirect('contact_us')  # Prevent non-POST requests

def recent(request):
    u = request.user
    all_docs = []
    if u.is_doctor:
        doc = Doctor.objects.get(docuser = u)
        dates = ClientDate.objects.filter(date_set__in = DoctorDate.objects.filter(doctor=doc))
        my_patients = doc.created_patients.all()
        for d in dates:
            if d.client not in all_docs:
                all_docs.append(d.client)
        for p in my_patients:
            if p not in all_docs:
                all_docs.append(p)
    else:
        dates = u.recent_doctors.all()
    
        for d in dates:
            if d not in all_docs:
                all_docs.append(d)
    page = request.GET.get('page')
    p = Paginator(all_docs, 10)

    currentPage = p.page(page)
    return render(request, 'myaccount/recent.html',{
        'recent_doctors': currentPage

    })

@login_required(login_url='/accounts/login/')
def profile_configurate(request):
    try:
        doc = DoctorSerializer(Doctor.objects.get(docuser = request.user))
        print(doc)
        return render(request, 'myaccount/profile_config.html', {'doctor':doc})
    except:
        return render(request, 'myaccount/profile_config.html', {'doctor':False})

def doctor_profile(request):
    doc = Doctor.objects.get(docuser = request.user)

    return render(request, 'myaccount/doctor_profile_config.html', {
        'specialities': doc.specialities.all(),
        'ensurances': doc.ensurances.all(),
        'clinics': doc.clinics.all(),
        'description': doc.description,
        'doc':doc
        })

def get_patients(request):
    data_list = []
    doctor = Doctor.objects.get(docuser = request.user)
    doc_patients = DoctorPatientSerializer(DoctorPatient.objects.filter(creator = doctor), many=True)
    doc_clients = UserSerializer(User.objects.filter(recent_doctors = doctor), many=True)
    for d in doc_clients.data:
        data_list.append({'id': d['id'], 'name': f'{d["first_name"]} {d["last_name"]}', 'type': 'client'})
    for d in doc_patients.data:
        data_list.append({'id': d['id'], 'name': f'{d["first_name"]} {d["last_name"]}', 'type': 'doc_patient'})

    return JsonResponse(data_list, safe=False)

def create_doctor_patient_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        form = DoctorPatientForm(data['formData'])  

        if form.is_valid():
            instance = form.save(commit=False)

            try:
                doctor = Doctor.objects.get(docuser=request.user)
                instance.creator = doctor
            except Doctor.DoesNotExist:
                pass  

            instance.save()

            return JsonResponse({
                "message": "DoctorPatient record created.",
                'valid':True
            }, safe=False)
        else:
            print(form.errors)
            return JsonResponse({"errors": form.errors, 'valid':False}, safe=False)

    return JsonResponse({"error": "Method not allowed"}, status=405)

def edit_doctor_patient(request, pk):
    doc_patient = get_object_or_404(DoctorPatient, pk=pk)

    if request.method == 'POST':
        form = DoctorPatientForm(request.POST, instance=doc_patient)
        if form.is_valid():
            form.save()  # commit changes to DB
            messages.success(request, "DoctorPatient record updated successfully!")
            return redirect('some_success_url')  # replace with your desired success redirect
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        # GET request: display the form with existing data
        form = DoctorPatientForm(instance=doc_patient)

    return render(request, 'edit_doctor_patient.html', {'form': form, 'doc_patient': doc_patient})

def delete_doctor_patient(request, pk):
    doc_patient = get_object_or_404(DoctorPatient, pk=pk)

    if request.method == 'POST':
        doc_patient.delete()
        messages.success(request, "DoctorPatient record deleted.")
        return redirect('some_list_view')  # or wherever you want to go next

    return render(request, 'delete_doctor_patient.html', {'doc_patient': doc_patient})


# lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
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
        'born_date': request.user.bornDate,
        'gender': request.user.gender
    }
    form = EditUser(initial=initial_data)
    return render(request, 'myaccount/personal_info_edit.html', {
        'form':form
    })

@login_required(login_url='/accounts/login/')
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
        client_dates = []
        aDates = ClientDateSerializer(ClientDate.objects.filter(date_set__in = [int(d.id) for d in date_sets], isActive = active).order_by('date', 'time'), many=True)
        dates_list = []
        for d in aDates.data:
            if d['modality'] == 'in_person':
                dates_list.append({'date_id': d['id'], 'name': f"{d['client']['first_name']} {d['client']['last_name']}",'date': d['date'],'time': d['time'], 'place': d['date_set']['clinica']['name'], 'type': d['content_type']})
            else:
                dates_list.append({'date_id': d['id'], 'name':f"{d['client']['first_name']} {d['client']['last_name']}", 'date': d['date'],  'time': d['time'], 'place': d['modality'], 'type': d['content_type']})
        for d in dates_list:
            print(d)
    else:
        dates = ClientDateSerializer(ClientDate.objects.filter(object_id=request.user.id, isActive = active), many=True)
        dates_list = []
        for d in dates.data:
            print(d['date_set'])
            if d['modality'] == 'in_person':
                dates_list.append({'date_id': d['id'], 'img': f"{d['date_set']['doctor']['image']}", 'name': d['date_set']['doctor']['name'], 'date': d['date'], 'time': d['time'], 'place': d['date_set']['clinica']['name']})
                
            else:
                dates_list.append({'date_id': d['id'], 'img': f"{d['date_set']['doctor']['image']}", 'name': d['date_set']['doctor']['name'], 'date': d['date'], 'time': d['time'], 'place': d['modality']})

    if not active:
        page = json.loads(request.GET.get('page'))
        p = Paginator(dates_list, 5)

        currentPage = p.page(page)
        next = currentPage.has_next()
        return JsonResponse([[c for c in currentPage], next], safe=False)
    else:
        return JsonResponse([dates_list, not u.is_doctor], safe=False)


# Validate Doctor's credentials
def doctor_signup(request):
    doc_id = request.GET.get('doc_id')
    if request.method == 'POST':

        if request.user.is_authenticated:
            form = sDocForm(request.POST)

            if form.is_valid():
                form.save(request.user)
                
            else:
                return render(request, 'account/doctor_signup.html', {
                'form': sDocForm(request.POST)
            })

            if request.session['claim_profile_id']:
                return redirect('claim', doctor_id=request.session['claim_profile_id'])
            else:
                return redirect('index')
        
        else:
            form = uDocForm(request.POST)

            if form.is_valid():
                user = form.save(request)
                raw_password = form.cleaned_data.get('password1')  # or your password field name
                user = authenticate(username=user.username, password=raw_password)

                if user is not None:
                    login(request, user)
            else:
                return render(request, 'account/doctor_signup.html', {
                'form': uDocForm(request.POST)
            })

            if request.session['claim_profile_id']:
                return redirect('claim', doctor_id=request.session['claim_profile_id'])
            else:
                return redirect('index')
    else:
        if doc_id:
            request.session['claim_profile_id'] = doc_id

        if request.user.is_authenticated:
            request.session['curr_page'] = 'doctor_signup'

            if request.user.is_doctor:
                return redirect('index')
            
            form = sDocForm()

        else:
            form = uDocForm()
            request.session['curr_page'] = 'doctor_signup'
            request.session.save()

        return render(request, 'account/doctor_signup.html', {
            'form': form,
            'doc_id': doc_id
        })
    
# SPECS MANAGEMENT
@login_required(login_url='/accounts/login/')
def my_spec(request):
    doc = Doctor.objects.get(docuser = request.user)
    spec = request.GET['spec']

    if request.method == 'POST':
        bod = request.body
        spec_value = json.loads(bod)
        if spec == 'ensurance':
            spec_val = Ensurance.objects.get(name=spec_value['spec'])
        elif spec == 'speciality':
            spec_val = Speciality.objects.get(name=spec_value['spec'])
        elif spec == 'clinic':
            spec_val = Clinic.objects.get(name=spec_value['spec'])
        elif spec == 'locate':
            for field_name, value in spec_value.items():
                setattr(doc, field_name, value)
            doc.save()
            return JsonResponse(True, safe=False) 
            
        if spec_value['delete']:
            if spec == 'ensurance':
                doc.ensurances.remove(spec_val)
            if spec =='speciality':
                doc.specialities.remove(spec_val)
            if spec =='clinic':
                doc.clinics.remove(spec_val)
        else:
            if spec =='ensurance':
                doc.ensurances.add(spec_val)
            if spec =='speciality':
                doc.specialities.add(spec_val)
            if spec =='clinic':
                doc.clinics.add(spec_val)
                
    return redirect('doc_prof')

# UPDATES THE DOCTOR PROGILE DESCRPITION BY POSTING THE NEW ONE
@login_required(login_url='/accounts/login/')
def edit_description(request):
    doc = Doctor.objects.get(docuser = request.user)
    if request.method =='POST':
        body = request.body
        description = json.loads(body)
        doc.description = description['body']
        doc.save()
    else:
        return JsonResponse(doc.description, safe=False)
    

@login_required(login_url='/accounts/login/') 
def create_schedule(request):
    def parse_days_dict(days_dict):
        result = []
        if days_dict.get('monday'):
            result.append(0)
        if days_dict.get('tuesday'):
            result.append(1)
        if days_dict.get('wednesday'):
            result.append(2)
        if days_dict.get('thursday'):
            result.append(3)
        if days_dict.get('friday'):
            result.append(4)
        if days_dict.get('saturday'):
            result.append(5)
        if days_dict.get('sunday'):
            result.append(6)
        return result


    def parse_hours_dict(start_str, end_str, minute_str):
        # Parse start and end times as datetime objects (date=1900-01-01 by default in strptime)
        start_dt = datetime.strptime(start_str, "%H:%M")
        end_dt = datetime.strptime(end_str, "%H:%M")

        # Convert minute interval to int
        try:
            minute_interval = int(minute_str)
        except ValueError:
            minute_interval = 15  # default to 15 if parsing fails or adjust as needed

        # Build list of time strings
        results = []
        current_dt = start_dt

        while current_dt <= end_dt:
            # Format the current time as HH:MM:SS
            results.append(current_dt.strftime("%H:%M:%S"))
            # Increment by minute_interval
            current_dt += timedelta(minutes=minute_interval)

        return results

    
    def modality_clean(in_person, virtually):
        if in_person:
            doc = Doctor.objects.get(docuser = request.user)
            doc.in_person = True
            doc.save()
            return 'in_person'
        elif virtually:
            return 'virtually'
    

    if request.method =='POST':
        doc = Doctor.objects.get(docuser = request.user)
        body = request.body
        data = json.loads(body)
        days_selected = parse_days_dict(data['formData']['days'])
        hours_selected = parse_hours_dict(data['formData']['startTime'], data['formData']['endTime'], data['formData']['minutes'])
        modality = modality_clean(data['formData']['in_person'], virtually=data['formData']['virtually'])
        try:
            clinica = Clinic.objects.get(name = data['formData']['clinic'])
            doc_date = DoctorDate.objects.create(
                doctor = doc,
                clinica = clinica,
                days=days_selected,
                horas=hours_selected,
                modalidad=modality,
                precio=data['formData']['price']
            )
        except:
            clinica = None
            doc_date = DoctorDate.objects.create(
                doctor = doc,
                days=days_selected,
                horas=hours_selected,
                modalidad=modality,
                precio=data['formData']['price']
            )
    return redirect('doc_prof')

@login_required(login_url='/accounts/login/')
def manage_my_schedule(request, date_id):
    date = DoctorDate.objects.get(pk=date_id)
    date_serialized = DoctorDateSerializer(date)
    if request.method == 'POST':
        delete = request.GET.get('delete')
        edit = request.GET.get('edit')

        if delete:
            date.delete()
            return JsonResponse(True, safe=False)
        elif edit:
            print(edit, 'hola')
            return JsonResponse(True, safe=False)
    else:
        return JsonResponse(date_serialized.data, safe=False)


# LOG OUT
def logout_view(request):
    logout(request)
    return redirect('index')

# DELETE ACCOUNT
def delete_account(request):
    request.user.delete()
    return redirect('index')


# STORES THE SEARCH FILTERS VALUES
def search(request):
    spec = None
    if request.method == 'POST':

        data = json.loads(request.body)
        if data.get('spec')[1] != 'All':
            spec = data.get('spec')[1]
        request.session[f'{data.get("spec")[0]}_val'] = spec
        return JsonResponse(data.get("spec")[0], safe=False)

    else:
        request.session['gender_val'] = None
        request.session['takedate_val'] = None
        request.session['datetype_val'] = None
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
    doctor = Doctor.objects.get(pk=doctor_id)
    doc = DoctorSerializer(doctor)
    dates = DoctorDateSerializer(doctor.dates.all(), many=True)
    ratings = Review.objects.filter(doctor=doctor)
    counts = ratings.aggregate(
        one_star=Count('id', filter=Q(rate=1)),
        two_star=Count('id', filter=Q(rate=2)),
        three_star=Count('id', filter=Q(rate=3)),
        four_star=Count('id', filter=Q(rate=4)),
        five_star=Count('id', filter=Q(rate=5))
    )
    total = sum(counts.values())
    percentages = {key: (value / total * 100 if total > 0 else 0) for key, value in counts.items()}

    # Combine counts and percentages into a single list
    rating_data = [
        {"rate": 1, "count": counts["one_star"], "percentage": (percentages["one_star"])},
        {"rate": 2, "count": counts["two_star"], "percentage": percentages["two_star"]},
        {"rate": 3, "count": counts["three_star"], "percentage": percentages["three_star"]},
        {"rate": 4, "count": counts["four_star"], "percentage": percentages["four_star"]},
        {"rate": 5, "count": counts["five_star"], "percentage": percentages["five_star"]},
    ]

    request.session['curr_page'] = f'{doctor_id}/profile'
    return render(request, "web/profile.html", {
        'doctor': doctor,
        'doc':doc,
        'dates':dates.data,
        'rating_data': reversed(rating_data)
        })

def smart_searchbar(request, key):
    results = []
    specialties = Speciality.objects.filter(name__icontains=key)
    for item in specialties:
        results.append({'model': 'Speciality', 'id': item.id, 'name': item.name})

    # Search in Clinics
    clinics = Clinic.objects.filter(name__icontains=key)
    for item in clinics:
        results.append({'model': 'Clinic', 'id': item.id, 'name': item.name})

    # Search in Insurances
    insurances = Ensurance.objects.filter(name__icontains=key)
    for item in insurances:
        results.append({'model': 'Ensurance', 'id': item.id, 'name': item.name})

    # # Search in Cities
    # cities = citiesList.filter(name__icontains=key)
    # for item in cities:
    #     item.search_count += 1
    # 
    #     results.append({'model': 'Cities', 'id': item.id, 'name': item.name})

    # Search in Doctors
    doctors = Doctor.objects.filter(name__icontains=key)
    for item in doctors:
        results.append({'model': 'Doctor', 'id': item.id, 'name':f'Dr. {item.name}'})
    # Sort results by search_count in descending order
    results.sort(key=lambda x: x.get('search_count', 0), reverse=True)

    return JsonResponse(results, safe=False)

# GET ALL DOCTORS WITH FILTERS VALUES
def doctor_results(request):
    page = int(request.GET.get('page'))
    speciality = request.session['speciality_val']
    ensurance = request.session['ensurance_val']    
    clinic = request.session['clinic_val']
    city = request.session['city_val']
    gender = request.session['gender_val']   

    in_person = None
    virtually = None
    taking_dates = request.session['takedate_val']
    if not taking_dates:
        taking_dates = None
    else:
        date_type = request.session['datetype_val']
        if date_type == 'in_person':
            in_person = True
        elif date_type == 'virtually':
            virtually = True        


    print(in_person, virtually)
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
        'docuser__gender__gender': gender, 
        'cities__icontains': city,
        'takes_dates': taking_dates,
        'in_person': in_person,
        'virtually': virtually,
        'renderizable': True
    }

    cleaned_filters = {key: value for key, value in filters.items() if value is not None}
    doctores = Doctor.objects.filter(**cleaned_filters).annotate(avg_rating=Avg('reviews__rate')).order_by('-avg_rating')
    doctores = DoctorSerializer(doctores, many=True)

    p = Paginator(doctores.data, 10)
    currentPage = p.page(page)
    next = currentPage.has_next()   
    prev = currentPage.has_previous()

    for doc in currentPage:
        docList.append(doc)

    render_pagination = f'{currentPage}'

    return JsonResponse([docList, render_pagination[1:-1], prev, next], safe=False)

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

def create_date_for_patient(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        type = data['type']
        print(type)
        if type != 'client':
            patient_type = ContentType.objects.get_for_model(DoctorPatient)
            doctor_patient = DoctorPatient.objects.get(pk=int(data['patient_id']))
        else:
            patient_type = ContentType.objects.get_for_model(User)
            doctor_patient = User.objects.get(pk=int(data['patient_id']))
        try:
            existing_date = ClientDate.objects.get(date_set = DoctorDate.objects.get(pk = int(request.session['form_data']['date_set'])), date = datetime.strptime(request.session['form_data']['date'], '%Y-%m-%d').date(), time = datetime.strptime(request.session['form_data']['time'], "%H:%M:%S").time(), modality = request.session['form_data']['modality'], isActive = True)
            return JsonResponse([False, 'Date already taken!'], safe=False)
        except:
            ClientDate.objects.create(date_set = DoctorDate.objects.get(pk = int(request.session['form_data']['date_set'])), date = datetime.strptime(request.session['form_data']['date'], '%Y-%m-%d').date(), time = datetime.strptime(request.session['form_data']['time'], "%H:%M:%S").time(), content_type=patient_type, object_id=doctor_patient.id, modality = request.session['form_data']['modality'], isActive = True)
            return JsonResponse([True, f'Date Created succesfully!'], safe=False)
            
        # return JsonResponse(new_date, safe=False)

# GET CALENDAR RENDER, DOCTOR DATES AND TAKEN DATES AND CREATE DATE
@login_required(login_url='/accounts/login/')
def calendarView(request, doc_id):
    if request.method == 'POST':
        if not request.session['form_data']:
            data = json.loads(request.body)
            date_set = DoctorDate.objects.get(pk= int(data['date_set']))
            user_content_type = ContentType.objects.get_for_model(User)

            existing_date, new_date = ClientDate.objects.get_or_create(date_set = date_set, date = datetime.strptime(data['date'], '%Y-%m-%d').date(), time = datetime.strptime(data['time'], "%H:%M:%S").time(),content_type=user_content_type, object_id=request.user.id,modality = data['modality'], isActive = True)
                
            if new_date:
                u = request.user
                u.recent_doctors.add(date_set.doctor.id)
                return JsonResponse([True, f'Date Created succesfully!'], safe=False)
            else:
                return JsonResponse([False, 'Unable to create date!'], safe=False)
        else:
            print(request.session['form_data'])
            return JsonResponse(request.session['form_data'], safe=False)

    else:
        y = int(request.GET.get('year'))
        m = int(request.GET.get('month')) + 1

        virtually = request.GET.get('virtually')
        if virtually == 'false':
            virtually = False
        else:
            virtually = True

        cal = calendar.monthcalendar(y,m)
        t = datetime.now()


        doctor = Doctor.objects.get(pk=doc_id)
        doc_dates = DoctorDateSerializer(DoctorDate.objects.filter(doctor=doctor), many=True)

        if request.GET.get('date_id') and request.GET.get('day'):
            id_list = request.GET.get('date_id').split(',')
            id_list = [int(item) for item in id_list]
            selected_day = request.GET.get('day') 
            if virtually:
                dates = [{"id": date['id'], "hours": date['horas']} for date in doc_dates.data if date['id'] in id_list]
            else:
                dates = [{"id": date['id'],"name": date['clinica']['name'], "hours": date['horas']} for date in doc_dates.data if date['id'] in id_list]
            availability = []

            if len(str(selected_day)) < 2:
                renday = f'0{selected_day}'
            else:
                renday = selected_day
            for date in dates:
                temp = []
                if len(date['hours']) >= 1:
                    print(date)
                    for h in date['hours'] :
                        if not ClientDate.objects.filter(date_set = date['id'], date = f'{y}-{m}-{renday}', time = h).exists():
                            print('hola')
                            if not temp and not virtually:
                                temp = {"clinic_name":date['name'], "hours_set": [[date['id'], [time_format(h)]]], "day":selected_day}
                            elif not temp and virtually:
                                temp = {'clinic_name': 'Virtually', "hours_set": [[date['id'], [time_format(h)]]], "day":selected_day}
                            else:
                                temp['hours_set'][0][1].append(time_format(h))

                    print(temp)
                    availability.append(temp)
                elif not ClientDate.objects.filter(date_set = date['id'], date = f'{y}-{m}-{renday}', time = date['hours']).exists():
                    new_val = ''
                    if availability:
                        for date_set in availability:
                            if not virtually:
                                if date_set['clinic_name'] == date['name'] or date_set['clinic_name'] == new_val:
                                    date_set['hours_set'].append([date['id'], time_format(date['hours'])])
                                    break
                                new_val = ({"clinic_name":date['name'], "hours_set": [date['id'], [time_format(date['hours'])]], "day":selected_day})
                            else:
                               new_val = ({'clinic_name': 'Virtually', "hours_set": [date['id'], [time_format(date['hours'])]], "day":selected_day}) 
                    else:
                        if not virtually:
                            availability.append({"clinic_name":date['name'], "hours_set": [date['id'], [time_format(date['hours'])]], "day":selected_day})
                        else:
                            availability.append({'clinic_name': 'Virtually', "hours_set": [date['id'], [time_format(date['hours'])]], "day":selected_day})
                    if new_val:
                        availability.append(new_val)
                else:
                    availability = False
            print(availability)
            return JsonResponse(availability, safe=False)
        else:
            doc_dates_list = []
            calendar_dates = []


            for date in doc_dates.data:
                if virtually and date['modalidad'] == 'virtually' and doctor.virtually or not virtually and date['modalidad'] == 'in_person' and doctor.in_person:
                    doc_dates_list.append({"id": date['id'], "days": date['days'], "hours": date['horas']})

            for day_set in cal:
                for day in day_set:
                    date_day = []
                    if day != 0:
                        for date_list in doc_dates_list:
                            for d in date_list['days']:
                                if day == day_set[int(d)] :
                                    hours_available = []
                                    if type(date_list['hours']) != str:
                                        for h in date_list['hours']:
                                            if h == '0':
                                                h = '00:00'
                                            if day > t.day:
                                                if len(str(day)) < 2:
                                                    renday = f'0{day}'
                                                else:
                                                    renday = day
                                                if not ClientDate.objects.filter(date_set = date_list['id'], date = f'{y}-{m}-{renday}', time = h).exists():
                                                    hours_available.append(h)
                                            elif day == t.day and datetime.strptime(h, "%H:%M:%S").time() > t.time():
                                                if len(str(day)) < 2:
                                                    renday = f'0{day}'
                                                else:
                                                        renday = day
                                                if not ClientDate.objects.filter(date_set = date_list['id'], date = f'{y}-{m}-{renday}', time = h).exists():
                                                    hours_available.append(h)
                                            else:
                                                if y > t.year or m > t.month:
                                                    if len(str(day)) < 2:
                                                        renday = f'0{day}'
                                                    else:
                                                        renday = day
                                                    if not ClientDate.objects.filter(date_set = date_list['id'], date = f'{y}-{m}-{renday}', time = h).exists():
                                                        hours_available.append(h)
                                    else:
                                        for h in date_list['hours']:
                                            if day > t.day:
                                                if len(str(day)) < 2:
                                                    renday = f'0{day}'
                                                else:
                                                    renday = day
                                                if not ClientDate.objects.filter(date_set = date_list['id'], date = f'{y}-{m}-{renday}', time = date_list['hours']).exists():
                                                    hours_available.append(h)

                                            elif day == t.day and datetime.strptime(h, "%H:%M:%S").time() > t.time() and selected_day:
                                                if len(str(day)) < 2:
                                                    renday = f'0{day}'
                                                else:
                                                    renday = day
                                                if not ClientDate.objects.filter(date_set = date_list['id'], date = f'{y}-{m}-{renday}', time = h).exists():
                                                    hours_available.append(h)
                                            else:
                                                if y > t.year or m > t.month:
                                                    if len(str(day)) < 2:
                                                        renday = f'0{day}'
                                                    else:
                                                        renday = day
                                                    if not ClientDate.objects.filter(date_set = date_list['id'], date = f'{y}-{m}-{renday}', time = date_list['hours']).exists():
                                                        hours_available.append(h)

                                                                                

                                    if hours_available:
                                        if date_day:
                                            if type(date_day[0]) != list:
                                                date_day= [[date_list['id'], date_day[0]], date_day[1]]
                                            else:
                                                date_day[0].append(date_list['id'])
                                        else:
                                            date_day = [date_list['id'], day]
                        if date_day:
                            calendar_dates.append(date_day)
                        else:
                            calendar_dates.append([False, day])
                    else:
                        calendar_dates.append([False, day])

            if doctor.takes_dates:
                return JsonResponse(
                    {
                        'year': y, 
                        'month': calendar.month_name[m], 
                        'day_names': list(calendar.day_abbr),
                        'calendar_days': calendar_dates,
                        'is_doc': request.user == doctor.docuser
                    }, safe=False
                )
            else:
                return JsonResponse(False, safe=False)
    
#SET THE TIME IN AM AND PM 
def time_format(time):
    hours = []
    h, m, s = time.split(':')
    if int(h) < 12 and int(h) != 0:
        hours = [time, f'{h}:{m} AM']
    elif int(h) == 12:
        hours = [time, f'{h}:{m} PM']
    elif int(h) == 0:
        hours = [time, f'12:{m} AM']
    else:
        hours = [time, f'{int(h) - 12}:{m} PM']

    return hours

def select_patient_for_date(request):
    if request.method == 'POST':
        body = request.body
        request.session['form_data'] = json.loads(body)
        return HttpResponse('success')
    else:
        return render(request, 'myaccount/date_for_patient.html')

# CREATE REVIEW
@login_required(login_url='/accounts/login/')
def create_review(request, doc_id):
    bod = request.body
    review_val = json.loads(bod)
    doctor = Doctor.objects.get(pk=int(doc_id))
    try:
        if Review.objects.filter(doctor=doctor, author=request.user).exists():
            raise ValidationError 
        Review.objects.create(doctor=doctor, author=request.user, rate=review_val['rate'] + 1, headline=review_val['headline'], review=review_val['review'])
        return JsonResponse({"success": True, "message": 'Review created succesfully!'}, status=200)
    except:
        return JsonResponse({"success": False, "message": "Already made a review."}, status=200)

# GET REVIEW
def get_review(request, doc_id):
    page = int(request.GET.get('page'))
    doctor = Doctor.objects.get(pk=int(doc_id))
    reviews = Review.objects.filter(doctor=doctor)
    reviews = [r for r in reviews if r.headline or r.review]
    reviews = ReviewSerializer(reviews, many=True)
    p = Paginator(reviews.data, 10)
    currentPage = p.page(page)
    return JsonResponse({'reviews':[r for r in currentPage], 'hasMore':currentPage.has_next()}, safe=False)

# CLAIM PROFILE
def claim_profile(request, doctor_id):
    doctor = Doctor.objects.get(pk=int(doctor_id))
    if request.method == 'POST':
        if request.user.first_name in doctor.name and request.user.last_name in doctor.name:
            return JsonResponse({'valid': True, 'message': f'Welcome to Doctify Dr. {doctor.name}.'}, safe=False)
        else:
            return JsonResponse({'valid': False, 'message': f'Your name dont match the doctor name.'}, safe=False)
    else:
        return render(request, 'web/claim_profile.html', {
            'doctor': doctor
        })
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
        elif spec == 'schedule':
            query_set = doc.dates.all()

        
        if spec != 'ensurance' and spec !='schedule':
            print('no seguro ni calendario', spec)
            specs_list = [s['name'] for s in query_set.data]
        elif spec != 'schedule':
            print('no calendario', spec)
            specs_list = [[s['name'], f"/static/images{s['logo']}"] for s in query_set.data]
        elif spec == 'schedule':
            print('calendario', spec)
            specs_list = [d for d in query_set]

        if not my_spec:
            if spec != 'ensurance':
                specs_list = [s['name'] for s in specs.data if s['name'] not in specs_list]
            else:
                specs_list = [[s['name'], f"/static/images{s['logo']}"] for s in specs.data if [s['name'], f"/static/images{s['logo']}"] not in specs_list]

            if not specs_list:
                if spec != 'ensurance':
                    specs_list.append('No results')
                else:
                    specs_list.append(['No results', False])
        else:
            if not specs_list:
                specs_list = False
        return JsonResponse(specs_list, safe=False)

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
    return JsonResponse([specs_list, request.session[f'{spec}_val']], safe=False)        



def provider_google_signup(request):
    curr_page = 'doctor_signup'
    return redirect(f'/accounts/google/login/?next=/accounts/{curr_page}')