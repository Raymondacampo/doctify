from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("myuser", views.myuser, name='myuser'),
    path("add_ens/<int:ens_id>", views.add_ensurance, name='add_ens'),
    path("remove_ens/<int:ens_id>", views.remove_ensurance, name='remove_ens'),
    path("favdoctors", views.favdoctors, name='favdoctors'),
    path("logout", views.logout_view, name='logout'),
    path('redirect', views.redirect_page, name='redirect'),
    path("search", views.search, name="search"),
    path("searchInfo", views.searchInfo, name="searchInfo"),
    path('locateUser', views.locateUser, name='locateUser'),
    path("<int:doctor_id>/profile", views.profile, name="profile"),
    path("makeDate", views.makeDate, name='makeDate'),
    path("makedate/<int:doc_id>", views.makeDates, name='makedate'),
    path('doctors', views.doctor, name='doctors'),
    path('dayson', views.daysOn, name='dayson'),
    path("daySchedule", views.daySchedule, name="daySchedule"),
    path('ensurance/<int:ens_id>', views.ensurance, name='ensurancebyid'),
    path('clinic/<str:clin_name>', views.clinic, name='clinic'),
    path('speciality', views.specialities, name='speciality'),
    path('ensurance', views.ensurances, name='ensurance'),
    path('clinic', views.clinics, name='Clinica'),
    path('city', views.cities, name='cities'),
    path('getvalue/<str:type>', views.getValue, name='getvalue'),

    # My account renders
    path('myaccount/dates', views.dates, name='dates'),
    path('myaccount/recent', views.recent, name='recent'),
    path('myaccount/configurate', views.profile_configurate, name='configurate'),
    path('myaccount/personal_info', views.personal_info, name='personal'),
    path('myaccount/doctor_profile', views.doctor_profile, name='doc_prof'),

    # My account functions
    path("myaccount/mydates", views.mydates, name='mydates'),
    path('myaccount/canceldate/<int:date_id>', views.canceldate, name='canceldate'),
    path('myaccount/user_info', views.user_info, name='user_info'),

    path('accounts/doctor_signup', views.doctor_signup, name='doctor_signup'),
]