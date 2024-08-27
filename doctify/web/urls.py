from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("myuser", views.myuser, name='myuser'),
    path("signin", views.signin, name='signin'),
    path("signup", views.signup, name='signup'),
    path("logout", views.logout_view, name='logout'),
    path('redirect', views.redirect_page, name='redirect'),
    path("doc_signup", views.doc_signup, name='doc_signup'),
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
    path('getvalue/<str:type>', views.getValue, name='getvalue')
]