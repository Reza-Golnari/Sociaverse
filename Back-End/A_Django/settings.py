from pathlib import Path
from datetime import timedelta
import django.core.mail.backends.smtp

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-=(8skllmhv(l!kndlk!(@0ruwjokl#t+u^ms@u9%vtrh67=0-@'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # local apps
    'home.apps.HomeConfig',
    'accounts.apps.AccountsConfig',
    'proof.apps.ProofConfig',

    # third-party apps
    'ckeditor',
    'rest_framework',
    'drf_spectacular',
    'corsheaders'
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]
CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = 'A_Django.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'A_Django.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
# STATICFILES_DIRS = [BASE_DIR / 'static']

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# Email conf
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'Social Website'

EMAIL_HOST_USER = 'social.project012@gmail.com'  # your email
EMAIL_HOST_PASSWORD = 'nbzdiodcmjyuoinq'  # your password

# media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Setting custom user model
AUTH_USER_MODEL = "accounts.MyUsers"


# REST_FRAMEWORK settings
REST_FRAMEWORK = {
    # Use JWTAuthentication as the default authentication method for API endpoints
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework_simplejwt.authentication.JWTAuthentication'],

    # Use drf_spectacular AutoSchema for generating OpenAPI schema automatically
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',

}

# SIMPLE_JWT settings
SIMPLE_JWT = {
    # Set the expiration time for access tokens to 7 days
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),

    # Set the expiration time for refresh tokens to 30 days
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
}

# SPECTACULAR_SETTINGS for OpenAPI documentation
SPECTACULAR_SETTINGS = {
    # The title of your API
    'TITLE': 'Your Project API',

    # The description of your API
    'DESCRIPTION': 'Your project description',

    # The version of your API
    'VERSION': '1.0.0',

    # Whether to include the schema in the served documentation or not
    'SERVE_INCLUDE_SCHEMA': False,
}
