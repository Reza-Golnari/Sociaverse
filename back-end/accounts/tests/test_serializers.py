from accounts.serializers import UserLoginSerializer, UserRegisterSerializer
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegisterSerializerTest(APITestCase):
    def test_valid_data(self):
        data = {
            'username': 'TestUsername',
            'email': 'email@email.com',
            'password': 'TestPassword',
            'password2': 'TestPassword',
        }

        serializer = UserRegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        vd = serializer.validated_data
        self.assertEqual(serializer.data['username'], vd['username'])
        self.assertEqual(serializer.data['email'], vd['email'])
        self.assertFalse(serializer.errors)

    def test_invalid_data(self):
        data = {
            'username': 8,
            'email': 'es.com',
            'password': '',
            'password2': 'TestPssassword',
        }

        serializer = UserRegisterSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertTrue(serializer.errors)
