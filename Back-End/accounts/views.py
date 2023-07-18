from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.serializers import UserRegisterSerializer, UserLoginSerializer
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth import views as auth_view
from django.urls import reverse_lazy
from django.contrib.auth import get_user_model
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

            User.objects.create_user(
                    email=validated_data['email'],
                    username=validated_data['username'],
                    password=validated_data['password']
                )
            return Response({"detail": "You have successfully registered"}, status=status.HTTP_201_CREATED)

        else:
            # Return an error response with the serializer errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
