from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from proof.models import Poste

User = get_user_model()



class HomeViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username='user1')
        self.user2 = User.objects.create(username='user2')
        self.post1 = Poste.objects.create(body='Post 1 by user1', title='Title by user1', user=self.user1)
        self.post2 = Poste.objects.create(body='Post 2by user2', title='Title by user2', user=self.user2)

    def test_get_all_posts_and_users(self):
        # Make a GET request to the endpoint
        url = reverse('home:home')
        response = self.client.get(url)

        # Assert the response status code and data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['posts']), 2)
        self.assertEqual(len(response.data['users']), 2)

    def test_filter_posts_and_users(self):
        # Make a GET request to the endpoint with search query parameter
        url = reverse('home:home') + '?search=user1'
        response = self.client.get(url)

        # Assert the response status code and data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['posts']), 1)
        self.assertEqual(len(response.data['users']), 1)

        # Assert that the filtered data matches the expected results
        self.assertEqual(response.data['posts'][0]['title'], 'Title by user1')
        self.assertEqual(response.data['users'][0]['username'], 'user1')
