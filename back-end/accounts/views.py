from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.serializers import UserRegisterSerializer, VerifySerializer, UserLoginSerializer
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth import views as auth_view
from django.urls import reverse_lazy
from accounts.models import OneTimeCode
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from utils import send_email
from accounts.permisions import NotAuthenticated
from rest_framework.permissions import IsAuthenticated
import random


User = get_user_model()


class UserRegisterView(APIView):
    """
    API view for user registration.
    """

    permission_classes = (NotAuthenticated,)
    serializer_class = UserRegisterSerializer

    def post(self, request):
        """
        Handle POST requests for user registration.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: The HTTP response containing the result of the registration.

        Raises:
            -

        """
        # Validate the incoming data using the UserRegisterSerializer
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            # Extract the validated data from the serializer
            validated_data = serializer.validated_data

            # Generate a random verification code
            random_code = random.randint(10000, 99999)

            # Send an email with the verification code to the user
            send_email(validated_data["email"], random_code, validated_data["username"])

            # Create a OneTimeCode instance with the email and code
            OneTimeCode.objects.create(email=validated_data["email"], code=random_code)

            # Store the user registration information in the session
            request.session["user_registration_info"] = {
                'username': validated_data["username"],
                "email": validated_data["email"],
                "password": validated_data["password"]
            }

            # Return a success response with a message
            return Response({'message': 'we sent you a 5 digits code'}, status=status.HTTP_200_OK)
        else:
            # Return an error response with the serializer errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserVerifyView(APIView):
    serializer_class = VerifySerializer

    def post(self, request):
        # Access the user registration information from the session
        sessions = request.session["user_registration_info"]

        # Retrieve all one-time codes for the email from the database
        all_code = OneTimeCode.objects.filter(email=sessions['email'])

        # Retrieve the latest one-time code instance for the email
        code_instance = OneTimeCode.objects.filter(email=sessions['email']).latest()

        # Create an instance of the VerifySerializer with the request data
        serializer = VerifySerializer(data=request.data)

        if serializer.is_valid():
            cd = serializer.validated_data

            # Check if the entered code matches the code from the latest code instance
            if cd["code"] == code_instance.code:
                now = datetime.now(code_instance.created.tzinfo)

                # Check if the code has expired (2 minutes since code creation)
                if now > code_instance.created + timedelta(minutes=2):
                    return Response({"detail": "2 minutes have passed since the verification code was sent. Please request a new code"}, status=status.HTTP_400_BAD_REQUEST)

                # Create a new user with the registered email, username, and password
                User.objects.create_user(
                    email=sessions['email'],
                    username=sessions['username'],
                    password=sessions['password']
                )

                # Delete all one-time codes for the email
                all_code.delete()

                return Response({"detail": "You have successfully registered"}, status=status.HTTP_201_CREATED)

            else:
                return Response({"detail": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            user = authenticate(
                request, username=validated_data['username'], password=validated_data['password'])
            if user is not None:
                login(request, user)
                return Response({'message': 'You have been logged in successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'message': 'You have been logged out.'}, status=status.HTTP_200_OK)


class UserPassReset(auth_view.PasswordResetView):
    template_name = "accounts/passwordreset.html"
    success_url = reverse_lazy("accounts:pass_reset_done")
    email_template_name = "accounts/email.html"


class UserPassDone(auth_view.PasswordResetDoneView):
    template_name = "accounts/passworddonereset.html"


class UserPassConf(auth_view.PasswordResetConfirmView):
    template_name = "accounts/passwordconfrimreset.html"
    success_url = reverse_lazy("accounts:user_reset_complete")


class UserPassComplete(auth_view.PasswordResetCompleteView):
    template_name = "accounts/compelete.html"
