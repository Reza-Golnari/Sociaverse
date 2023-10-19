from rest_framework import serializers
from accounts.models import MyUsers


class UserRegisterSerializer(serializers.Serializer):
    """
    Serializer for user registration.
    """

    username = serializers.CharField()
    # Field to input the username

    email = serializers.EmailField()
    # Field to input the email

    password = serializers.CharField(label='password', write_only=True)
    # Field to input the password (write-only)

    password2 = serializers.CharField(
        label='Confirm your password', write_only=True)
    # Field to confirm the password (write-only)

    def validate_email(self, email):
        """
        Validate the uniqueness of the email.
        """
        user = MyUsers.objects.filter(email=email).exists()
        if user:
            raise serializers.ValidationError("This email is already in use")
        return email

    def validate_username(self, username):
        """
        Validate the uniqueness of the username.
        """
        user = MyUsers.objects.filter(username=username).exists()
        if user:
            raise serializers.ValidationError("This username is already in use")
        return username

    def validate_password(self, password):
        """
        Validate the length of the password.
        """
        if len(password) < 8:
            raise serializers.ValidationError("Your password is too short")
        return password

    def validate(self, attrs):
        """
        Validate that the passwords match.
        """
        password = attrs.get("password")
        password2 = attrs.get("password2")
        if password and password2 and password2 != password:
            raise serializers.ValidationError("Passwords are not the same")
        return attrs


class VerifySerializer(serializers.Serializer):
    """
    Serializer for verification code.
    """

    code = serializers.IntegerField(min_value=10000, max_value=99999)
    # Field to input the verification code


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """

    username = serializers.CharField()
    # Field to input the username

    password = serializers.CharField()
    # Field to input the password
