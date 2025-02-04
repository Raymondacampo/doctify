"""
WSGI config for doctify project. It exposes the WSGI callable as a module-level variable named ``application`` For more information on this file, see https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os
import environ

# Load environment variables
env = environ.Env()
environ.Env.read_env(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "doctify.settingsprod")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
