from rest_framework import serializers
from django.db.models import Avg, Count
from django.utils.timezone import localtime
from .models import Doctor, Speciality, Clinic, Ensurance, ClientDate, User, DoctorDate, Review, DoctorPatient
import datetime

class EnsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ensurance
        fields = ['id', 'name', 'logo']

class UserSerializer(serializers.ModelSerializer):
    ensurance = EnsuranceSerializer()

    class Meta:
        model = User
        fields = ['id','username', 'first_name', 'last_name', 'email', 'ensurance']
    
class SpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Speciality
        fields = ['id', 'name']

class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ['id', 'name', 'city']

class ReviewSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    created_at = serializers.SerializerMethodField()
    class Meta:
        model = Review
        fields = ['id', 'author', 'rate', 'headline', 'review', 'created_at' ]

    def get_created_at(self, obj):
        local_dt = localtime(obj.created_at)
        return local_dt.strftime("%b. %d, %Y, %I:%M %p").lower().replace('am', 'a.m.').replace('pm', 'p.m.').lstrip('0')

    

class DoctorSerializer(serializers.ModelSerializer):
    specialities = SpecialitySerializer(many=True)
    clinics = ClinicSerializer(many=True)
    ensurances = EnsuranceSerializer(many=True)
    review_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(avg_rating=Avg('rate'))['avg_rating']
        return round(avg, 1) if avg else 0
    
    def get_review_count(self, obj):
        # Count the number of reviews related to the doctor
        return obj.reviews.count()

    class Meta:
        model = Doctor
        fields = ['id', 'name','image','specialities', 'clinics', 'ensurances', 'description', 'average_rating', 'review_count', 'takes_dates', 'in_person', 'virtually']


class DoctorDateSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer()
    clinica = ClinicSerializer()
    hour_ampm = serializers.SerializerMethodField()
    class Meta:
        model = DoctorDate
        fields = ['id', 'doctor', 'clinica','days', 'horas', 'modalidad', 'hour_ampm']

    def get_hour_ampm(self, obj):

        results = []
        for time_str in obj.horas:
            # If your choices are "08:00:00", "09:30:00", etc., parse them:
            dt = datetime.datetime.strptime(time_str, "%H:%M:%S")
            # Format them as 12-hour clock e.g. "08:00 am"
            ampm_str = dt.strftime("%I:%M %p").lower()
            results.append(ampm_str)
        return results

class DoctorPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorPatient
        fields = ['id', 'first_name', 'last_name']

class ClientGenericRelatedField(serializers.Field):
    """
    A custom field to serialize the `client` GenericForeignKey.
    """
    def to_representation(self, value):
        # `value` will be the actual model instance, either a `User` or `DoctorPatient`.
        if isinstance(value, User):
            return UserSerializer(value).data
        elif isinstance(value, DoctorPatient):
            return DoctorPatientSerializer(value).data
        return None  # Or raise an error if you expect only these two models.

    def to_internal_value(self, data):
        """
        If you want to allow writes/updates, you'd parse `data` here to figure out:
          - Is it referencing a User or DoctorPatient?
          - Set content_type & object_id accordingly.
        For now, let's assume read-only.
        """
        raise NotImplementedError("Write logic for GenericForeignKey not implemented.")

class ClientDateSerializer(serializers.ModelSerializer):
    date_set = DoctorDateSerializer()
    client = ClientGenericRelatedField(read_only=True)    
    time_ampm = serializers.SerializerMethodField()
    class Meta:
        model = ClientDate
        fields = ['id', 'date_set', 'client', 'date', 'time','time_ampm', 'isActive', 'modality','content_type']

    def get_time_ampm(self, obj):
        time_val = obj.time  # This could be a string or a datetime.time object
        
        # 1. If it's already a datetime.time, just format it.
        if isinstance(time_val, datetime.time):
            return time_val.strftime("%I:%M %p").lower()
        
        # 2. Otherwise, if it's a string (e.g. "13:30:00"), parse and then format.
        if isinstance(time_val, str):
            # Parse the string as HH:MM:SS
            parsed_dt = datetime.strptime(time_val, "%H:%M:%S")
            return parsed_dt.strftime("%I:%M %p").lower()
        
        # 3. If neither (null, blank?), handle gracefully.
        return ""






