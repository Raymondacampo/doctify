from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("myuser", views.myuser, name='myuser'),
    path("signin", views.signin, name='signin'),
    path("signup", views.signup, name='signup'),
    path("doc_signup", views.doc_signup, name='doc_signup'),
    path('logout', views.logout_view, name="logout"),
    path('sign-out', views.sign_out, name='sign_out'),
    path('auth-receiver', views.auth_receiver, name='auth_receiver'),
    path("search", views.search, name="search"),
    path("searchInfo", views.searchInfo, name="searchInfo"),
    path('locateUser', views.locateUser, name='locateUser'),
    path("<int:doctor_id>/profile", views.profile, name="profile"),
    path("makeDate", views.makeDate, name='makeDate'),
    path("makedate/<int:doc_id>", views.makeDates, name='makedate'),
    path('doctor', views.doctor, name='doctor'),
    path('dayson', views.daysOn, name='dayson'),
    path("daySchedule", views.daySchedule, name="daySchedule"),
    path('ensurance/<int:ens_id>', views.ensurance, name='ensurance'),
    path('clinic/<str:clin_name>', views.clinic, name='clinic'),
    path('specialities', views.specialities, name='specialities'),
    path('ensurances', views.ensurances, name='ensurances'),
    path('clinics', views.clinics, name='clinics'),
    path('cities', views.cities, name='cities')
]