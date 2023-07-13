from accounts.models import OneTimeCode
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase, APIRequestFactory
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from accounts.views import UserVerifyView
from accounts.models import OneTimeCode

User = get_user_model()

class UserRegisterViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('accounts:user_register')

    def test_user_registration_success(self):
        # Test successful user registration

        # Define a valid registration payload
        payload = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'password2': 'testpassword'
        }

        # Mock the send_email function
        def mock_send_email(email, code, username):
            pass

        # Mock the random.randint function
        def mock_random_code(a, b):
            return 12345

        # Patch the send_email and random.randint functions
        with patch('utils.send_email', side_effect=mock_send_email):
            with patch('random.randint', side_effect=mock_random_code):
                response = self.client.post(self.register_url, data=payload)

        # Assert the response status code and message
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'we sent you a 5 digits code'})

        # Assert the OneTimeCode instance is created
        self.assertEqual(OneTimeCode.objects.count(), 1)
        one_time_code = OneTimeCode.objects.first()
        self.assertEqual(one_time_code.email, 'test@example.com')
        self.assertEqual(one_time_code.code, 12345)

        # Assert the user registration information is stored in the session
        session_data = self.client.session.get('user_registration_info')
        self.assertEqual(session_data['username'], 'testuser')
        self.assertEqual(session_data['email'], 'test@example.com')
        self.assertEqual(session_data['password'], 'testpassword')

    def test_user_registration_invalid_data(self):
        # Test user registration with invalid data

        # Define an invalid registration payload
        invalid_payload = {
            'username': 'testuser',
            'email': 'invalid_email',
            'password': ''
        }

        response = self.client.post(self.register_url, data=invalid_payload)

        # Assert the response status code and error message
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)  # Check if email validation error is present
        self.assertIn('password', response.data)  # Check if password validation error is present

        # Assert no OneTimeCode instance is created
        self.assertEqual(OneTimeCode.objects.count(), 0)

        # Assert no user registration information is stored in the session
        self.assertIsNone(self.client.session.get('user_registration_info'))



class UserVerifyViewTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = UserVerifyView.as_view()

    def test_user_verification_success(self):
        # Create a OneTimeCode instance
        email = 'test@example.com'
        code = 12345
        OneTimeCode.objects.create(
            email=email,
            code=code,
        )

        # Prepare the request data
        data = {
            'code': code
        }

        # Set up the session data
        session_data = {
            'user_registration_info': {
                'email': email,
                'username': 'testuser',
                'password': 'testpassword'
            }
        }

        # Create the request
        url = reverse('accounts:verify')  # Assuming the URL name for the view is 'verify'
        request = self.factory.post(url, data)
        request.session = session_data

        # Make the request to the view
        response = self.view(request)

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['detail'], 'You have successfully registered')

        # # Verify that the user is created
        user = User.objects.get(email=email)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.check_password('testpassword'), True)

        # Verify that the OneTimeCode instance is deleted
        self.assertFalse(OneTimeCode.objects.filter(email=email).exists())

    def test_user_verification_invalid_code(self):
        # Create a OneTimeCode instance
        email = 'test@example.com'
        code = 12345
        created = timezone.now()
        OneTimeCode.objects.create(
            email=email,
            code=code,
            created=created
        )

        # Prepare the request data with an invalid code
        data = {
            'code': 56783
        }

        # Set up the session data
        session_data = {
            'user_registration_info': {
                'email': email,
                'username': 'testuser',
                'password': 'testpassword'
            }
        }

        # Create the request
        url = reverse('accounts:verify')  # Assuming the URL name for the view is 'verify'
        request = self.factory.post(url, data)
        request.session = session_data

        # Make the request to the view
        response = self.view(request)

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid code')

        # Verify that the OneTimeCode instance still exists
        self.assertTrue(OneTimeCode.objects.filter(email=email).exists())

