from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about", views.about_us, name="about_us"),
    path("terms", views.terms_of_service, name="terms_of_service"),
    path("privacy", views.privacy_policy, name="privacy_policy"),
    path("contact", views.contact_us, name="contact_us"),
    path('send-message/', views.send_message, name='send_message'),
    path('faqs', views.faqs, name='faqs'),
    path("logout", views.logout_view, name='logout'),
    path('redirect', views.redirect_page, name='redirect'),
    path("search", views.search, name="search"),
    path("smart/<str:key>", views.smart_searchbar, name="smart"),
    path('locateUser', views.locateUser, name='locateUser'),
    path("<int:doctor_id>/profile", views.profile, name="profile"),
    path('doctors', views.doctor_results, name='doctors'),
    path("<int:doc_id>/calendar", views.calendarView, name="calendar"),
    path("<int:doc_id>/create_review", views.create_review, name="create_review"),
    path("<int:doc_id>/get_review", views.get_review, name="get_review"),
    path('claim/<int:doctor_id>', views.claim_profile, name='claim'),

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
    path("myaccount/delete_account", views.delete_account, name='delete_account'),
    path('myaccount/managespec', views.my_spec, name='myspec'),
    path('myaccount/description', views.edit_description, name='description'),
    path('myaccount/create_schedule', views.create_schedule, name='create_schedule'),
    path('myaccount/manage_my_schedule/<int:date_id>', views.manage_my_schedule, name='manage_my_schedule'),

    path('myaccount/get_patients', views.get_patients, name='get_patient'),
    path('myaccount/create_patient', views.create_doctor_patient_api, name='create_patient'),
    path('myaccount/select_patient_for_date', views.select_patient_for_date, name='select_patient'),
    path('myaccount/calendar', views.create_date_for_patient, name='assign_patient'),

    path('accounts/doctor_signup', views.doctor_signup, name='doctor_signup'),
    path('accounts/google/provider-signup/', views.provider_google_signup, name='provider_google_signup'),
]