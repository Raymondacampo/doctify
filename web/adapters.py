import functools
import warnings

from django.core.exceptions import (
    ImproperlyConfigured,
    MultipleObjectsReturned,
)
from django.db.models import Q
from django.urls import reverse
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from allauth.account.adapter import DefaultAccountAdapter
from django.shortcuts import resolve_url
from allauth.account.adapter import get_adapter as get_account_adapter
from allauth.account.utils import user_email, user_field, user_username
from allauth.core.internal.adapter import BaseAdapter
from allauth.utils import (
    deserialize_instance,
    import_attribute,
    serialize_instance,
    valid_email_or_none,
)

# from . import app_settings  
def populate_user(self, request, sociallogin, data):
        """
        Hook that can be used to further populate the user instance.

        For convenience, we populate several common fields.

        Note that the user instance being populated represents a
        suggested User instance that represents the social user that is
        in the process of being logged in.

        The User instance need not be completely valid and conflict
        free. For example, verifying whether or not the username
        already exists, is not a responsibility.
        """
        username = data.get("username")
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")
        name = data.get("name")
        user = sociallogin.user
        user_username(user, username or "")
        user_email(user, valid_email_or_none(email) or "")
        name_parts = (name or "").partition(" ")
        user_field(user, "first_name", first_name or name_parts[0])
        user_field(user, "last_name", last_name or name_parts[2])
        return user
