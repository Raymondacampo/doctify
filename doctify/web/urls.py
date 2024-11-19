from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("logout", views.logout_view, name='logout'),
    path('redirect', views.redirect_page, name='redirect'),
    path("search", views.search, name="search"),
    path('locateUser', views.locateUser, name='locateUser'),
    path("<int:doctor_id>/profile", views.profile, name="profile"),
    path('doctors', views.doctor, name='doctors'),
    path("<int:doc_id>/calendar", views.calendarView, name="calendar"),


    path('ensurance/<int:ens_id>', views.ensurance, name='ensurancebyid'),
    path('clinic/<str:clin_name>', views.clinic, name='clinic'),

    # get all values
    path('get_spec', views.get_spec, name='get_spec'),

    # My account renders
    path('myaccount/dates', views.dates, name='dates'),
    path('myaccount/recent', views.recent, name='recent'),
    path('myaccount/configurate', views.profile_configurate, name='configurate'),
    path('myaccount/personal_info', views.personal_info, name='personal'),
    path('myaccount/personal_info/edit', views.personal_info_edit, name='personal_edit'),
    path('myaccount/login_data', views.login_data, name='login_data'),
    path('myaccount/doctor_profile', views.doctor_profile, name='doc_prof'),

    # My account functions
    path("myaccount/mydates", views.mydates, name='mydates'),
    path('myaccount/canceldate/<int:date_id>', views.canceldate, name='canceldate'),
    path('myaccount/user_info', views.user_info, name='user_info'),
    path('accounts/doctor_signup', views.doctor_signup, name='doctor_signup'),

    # add or remove spec
    path('myaccount/managespec', views.my_spec, name='myspec'),

    # ensurances
    path('myaccount/description', views.edit_description, name='description'),

]