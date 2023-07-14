
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from proof.models import Poste
from home.serializers import PosteSerializer, UserSerializer

User = get_user_model()


class PosteSerializerTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpass')
        self.post = Poste.objects.create(
            title='Test Post', user=self.user, body='This is a test post.')

    def test_poste_serializer(self):
        serializer = PosteSerializer(instance=self.post)
        expected_data = {
            'id': self.post.id,
            'title': 'Test Post',
            'user': 'testuser',
            'body': 'This is a test post.',
            'slug': self.post.slug,
            'image': None,
            'created': self.post.created.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            'updated': self.post.updated.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        }
        self.assertEqual(serializer.data, expected_data)


class UserSerializerTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpass', email='test@email.com')

    def test_user_serializer(self):
        serializer = UserSerializer(instance=self.user)
        expected_data = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email
        }
        self.assertEqual(serializer.data, expected_data)
