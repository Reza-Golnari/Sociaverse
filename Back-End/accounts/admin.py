from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import MyUsers


class NewUserAdmin(UserAdmin):
    # Define the fieldsets for the user change form in the admin site
    fieldsets = (
        (None, {"fields": ("username", "bio", "picture", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    # Define the fieldsets for the user creation form in the admin site
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "password1", "password2"),
            },
        ),
    )


# Register the MyUsers model with the customized NewUserAdmin
admin.site.register(MyUsers, NewUserAdmin)
