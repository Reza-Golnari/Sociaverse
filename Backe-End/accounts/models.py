from django.db import models
from django.contrib.auth.models import AbstractUser


class MyUsers(AbstractUser):
    """
    Custom user model with additional fields.
    Inherits from the Django AbstractUser model.
    """

    bio = models.TextField(max_length=300, null=True, blank=True)
    # A field to store the user's biography (max 300 characters)

    picture = models.ImageField(
        upload_to="profile/%Y/%m/%d", null=True, blank=True)
    # A field to store the user's profile picture (uploaded to a specific directory based on date)


class OneTimeCode(models.Model):
    """
    Model to store one-time codes associated with an email.
    """

    email = models.EmailField()
    # The email associated with the one-time code

    code = models.PositiveSmallIntegerField()
    # The one-time code (small positive integer)

    created = models.DateTimeField(auto_now=True)
    # The timestamp when the one-time code was created

    class Meta:
        get_latest_by = 'created'
        # Specifies that the latest record should be retrieved based on the 'created' field

    def __str__(self):
        """
        Returns a string representation of the OneTimeCode object.
        The string includes the email, code, and created timestamp.
        """
        return f"{self.email}-{self.code}-{self.created}"
