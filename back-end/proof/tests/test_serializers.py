from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from proof.models import Poste, Comment, Directs
from proof.serializers import *
from django.core.files.images import ImageFile


User = get_user_model()


class PosteSerializerTest(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser', password='testpass')

        # Create a test post
        self.post = Poste.objects.create(
            title='Test Post', user=self.user, body='This is a test post.')

    def test_poste_serializer(self):
        """
        Test the PosteSerializer.
        """
        # Create an instance of the PosteSerializer with the test post
        serializer = PosteSerializer(instance=self.post)

        # Define the expected data that should be serialized
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

        # Compare the serialized data with the expected data
        self.assertEqual(serializer.data, expected_data)


class PostCreateSerializerTest(APITestCase):
    def test_valid_data(self):
        """
        Test the PosteCreateSerializer with valid data.
        """
        # Create a dictionary containing valid data for the serializer
        data = {
            'title': 'TestTitle',
            'body': 'TestBody',
            'image': ImageFile(open('media/sample.jpg', 'rb')),
        }

        # Create an instance of the PosteCreateSerializer with the data
        serializer = PosteCreateSerializer(data=data)

        # Check if the serializer is valid
        self.assertTrue(serializer.is_valid())

        # Access the validated data from the serializer
        vd = serializer.validated_data

        # Compare the serialized data with the validated data
        self.assertEqual(serializer.data['title'], vd['title'])
        self.assertEqual(serializer.data['body'], vd['body'])

        # Check that there are no errors in the serializer
        self.assertFalse(serializer.errors)

    def test_invalid_data(self):
        """
        Test the PosteCreateSerializer with invalid data.
        """
        # Create a dictionary containing invalid data for the serializer
        data = {
            'title': '',
            'body': 3,
            'image': ImageFile(open('media/sample.jpg', 'rb')),
        }

        # Create an instance of the PosteCreateSerializer with the data
        serializer = PosteCreateSerializer(data=data)

        # Check that the serializer is not valid
        self.assertFalse(serializer.is_valid())

        # Check that there are errors in the serializer
        self.assertTrue(serializer.errors)


class UserSerializerTest(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        # Create a test user with the specified attributes
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='email@gmail.com',
            bio="It's Me",
            picture=ImageFile(open('media/sample.jpg', 'rb')),
        )

    def test_user_serializer(self):
        """
        Test the UserSerializer.
        """
        # Create an instance of the UserSerializer with the test user
        serializer = UserSerializer(instance=self.user)

        # Define the expected data that should be serialized
        expected_data = {
            'id': self.user.id,
            'username': 'testuser',
            'email': 'email@gmail.com',
            'bio': "It's Me",
            'picture': ImageFile(open('media/sample.jpg', 'rb')),
        }

        # Compare the serialized data with the expected data for username and email
        self.assertEqual(
            serializer.data['username'], expected_data['username'])
        self.assertEqual(serializer.data['email'], expected_data['email'])


class CommentCreateSerializerTest(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
        )

        # Create a test post
        self.post = Poste.objects.create(
            title='Test Post', user=self.user, body='This is a test post.'
        )

        # Create a test comment
        self.comment = Comment.objects.create(
            user=self.user,
            body='This is a Test Comment.',
            post=self.post
        )

        # Create a test reply comment
        self.reply_comment = Comment.objects.create(
            user=self.user,
            body='This is a Test Comment.',
            post=self.post,
            is_reply=True,
            reply=self.comment
        )


def test_comment_serializer(self):
    """
    Test the CommentShowSerializer.
    """
    # Create an instance of the CommentShowSerializer with the test comment
    serializer = CommentShowSerializer(self.comment)

    # Compare the serialized reply comment's body with the expected reply comment's body
    self.assertEqual(serializer.data['replys']
                     [0]['body'], self.reply_comment.body)

    # Compare the serialized reply comment's user with the expected reply comment's username
    self.assertEqual(serializer.data['replys'][0]
                     ['user'], self.reply_comment.user.username)

    # Compare the serialized reply comment's post with the expected reply comment's title
    self.assertEqual(serializer.data['replys']
                     [0]['post'], self.reply_comment.post.title)

    # Compare the serialized comment's 'is_reply' field with the expected value
    self.assertEqual(serializer.data['is_reply'], False)

    # Compare the serialized comment's body with the expected comment's body
    self.assertEqual(serializer.data['body'], self.comment.body)


class CommentCreateSerializerTest(APITestCase):
    def test_valid_data(self):
        """
        Test the CommentCreateSerializer with valid data.
        """
        # Create a dictionary containing valid data for the serializer
        data = {
            'body': 'TestBody',
        }

        # Create an instance of the CommentCreateSerializer with the data
        serializer = CommentCreateSerializer(data=data)

        # Check if the serializer is valid
        self.assertTrue(serializer.is_valid())

        # Access the validated data from the serializer
        vd = serializer.validated_data

        # Compare the serialized data with the validated data for the body field
        self.assertEqual(serializer.data['body'], vd['body'])

        # Check that there are no errors in the serializer
        self.assertFalse(serializer.errors)

    def test_invalid_data(self):
        """
        Test the CommentCreateSerializer with invalid data.
        """
        # Create a dictionary containing invalid data for the serializer
        data = {
            'body': '',
        }

        # Create an instance of the CommentCreateSerializer with the data
        serializer = CommentCreateSerializer(data=data)

        # Check that the serializer is not valid
        self.assertFalse(serializer.is_valid())

        # Check that there are errors in the serializer
        self.assertTrue(serializer.errors)


class UserUpdateSerializerTest(APITestCase):
    def test_valid_data(self):
        """
        Test the UserUpdateSerializer with valid data.
        """
        # Create a dictionary containing valid data for the serializer
        data = {
            'bio': 'TestBody',
            'picture': ImageFile(open('media/sample.jpg', 'rb')),
        }

        # Create an instance of the UserUpdateSerializer with the data
        serializer = UserUpdateSerializer(data=data)

        # Check if the serializer is valid
        self.assertTrue(serializer.is_valid())

        # Access the validated data from the serializer
        vd = serializer.validated_data

        # Compare the serialized data with the validated data for the bio field
        self.assertEqual(serializer.data['bio'], vd['bio'])

        # Check that there are no errors in the serializer
        self.assertFalse(serializer.errors)

    def test_invalid_data(self):
        """
        Test the UserUpdateSerializer with invalid data.
        """
        # Create a dictionary containing invalid data for the serializer
        data = {
            'bio': False,
        }

        # Create an instance of the UserUpdateSerializer with the data
        serializer = UserUpdateSerializer(data=data)

        # Check that the serializer is not valid
        self.assertFalse(serializer.is_valid())

        # Check that there are errors in the serializer
        self.assertTrue(serializer.errors)


class DirectsSerializerTest(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        # Create test users
        self.user = User.objects.create_user(
            username='testuser', password='testpass')
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpass')

        # Create a test direct message
        self.message = Directs.objects.create(
            from_user=self.user,
            to_user=self.user2,
            title='test title',
            body='test body',
        )

    def test_directs_serializer(self):
        """
        Test the DirectsSerializer.
        """
        # Create an instance of the DirectsSerializer with the test message
        serializer = DirectsSerializer(instance=self.message)

        # Compare the serialized to_user with the expected to_user's username
        self.assertEqual(
            serializer.data['to_user'], self.message.to_user.username)

        # Compare the serialized from_user with the expected from_user's username
        self.assertEqual(
            serializer.data['from_user'], self.message.from_user.username)

        # Compare the serialized title with the expected title
        self.assertEqual(serializer.data['title'], self.message.title)

        # Compare the serialized body with the expected body
        self.assertEqual(serializer.data['body'], self.message.body)
