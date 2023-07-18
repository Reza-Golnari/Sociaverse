from django.urls import reverse
from proof.models import Poste, Relation, Directs
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from proof.models import Poste, Comment, Vote
from django.core.files.images import ImageFile
from proof.views import UserProfileView
from rest_framework import status
from rest_framework.test import APIRequestFactory


User = get_user_model()

class TestUserProfileView(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.factory = APIRequestFactory()

        # Create a test user
        self.test_user = User.objects.create_user(
            username='testuser', email='test@email.com')
        self.test_user.set_password('testpassword')
        self.test_user.save()

        # Create some test posts
        self.post1 = Poste.objects.create(
            user=self.test_user, body='Test post 1', title='test1')
        self.post2 = Poste.objects.create(
            user=self.test_user, body='Test post 2', title='test2')

    def test_get_user_profile(self):
        """
        Test retrieving the user profile for an existing user.
        """
        url = reverse('proof:proof', kwargs={
                      'username': self.test_user.username})
        request = self.factory.get(url)
        response = UserProfileView.as_view()(request, username=self.test_user.username)

        # Assert that the response has a status code of 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert that the username in the response matches the test user's username
        self.assertEqual(response.data['user']['username'], self.test_user.username)
        
        # Assert that both test posts are returned in the response
        self.assertEqual(len(response.data['posts']), 2)
        
        # Assert that is_followed is False for the test user
        self.assertFalse(response.data['is_followed'])

    def test_get_user_profile_not_found(self):
        """
        Test retrieving the user profile for a nonexistent user.
        """
        url = reverse('proof:proof', kwargs={'username': 'nonexistentuser'})
        request = self.factory.get(url)
        response = UserProfileView.as_view()(request, username='nonexistentuser')

        # Assert that the response has a status code of 404 (Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestPostDetailView(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a test user
        self.test_user = User.objects.create(username='testuser')
        self.test_user.set_password('testpassword')
        self.test_user.save()

        # Create a test post
        self.test_post = Poste.objects.create(
            title='Test Post', body='Test body', slug='test-body', user=self.test_user)

        # Create a test comment
        self.test_comment = Comment.objects.create(
            post=self.test_post, user=self.test_user, body='Test comment')

        # Create a test vote
        self.test_vote = Vote.objects.create(
            post=self.test_post, user=self.test_user)

    def test_get_post_details(self):
        url = reverse('proof:post_details', kwargs={
                      'post_id': self.test_post.id, 'post_slug': self.test_post.slug})
        self.client.force_authenticate(user=self.test_user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['post']['id'], self.test_post.id)
        # Ensure the test comment is returned
        self.assertEqual(len(response.data['comments']), 1)
        # Ensure liked is True for the test vote
        self.assertTrue(response.data['liked'])
        # Ensure the count of likes is 1
        self.assertEqual(response.data['likes_count'], 1)

    def test_get_post_details_not_found(self):
        url = reverse('proof:post_details', kwargs={
                      'post_id': 999, 'post_slug': 'nonexistent-slug'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestCommentCreateView(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.post = Poste.objects.create(
            title='Test Post', user=self.user, body='Test Body', slug='test-post')

    def test_create_comment(self):
        """
        Test creating a comment with valid data.
        """
        url = reverse('proof:comment_create', args=(
            self.post.id, self.post.slug))
        self.client.force_authenticate(user=self.user)

        data = {'body': 'Test Comment'}
        response = self.client.post(url, data)

        # Assert that the response has a status code of 201 (Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Assert that the response body matches the created comment body
        self.assertEqual(response.data['body'], 'Test Comment')

        # Assert that the comment is created in the database
        comment = Comment.objects.first()
        self.assertEqual(comment.user.id, self.user.id)
        self.assertEqual(comment.post.id, self.post.id)

    def test_create_comment_unauthenticated(self):
        """
        Test creating a comment without authentication.
        """
        url = reverse('proof:comment_create', args=(
            self.post.id, self.post.slug))

        data = {'body': 'Test Comment'}
        response = self.client.post(url, data)

        # Assert that the response has a status code of 401 (Unauthorized)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentDeleteViewTestCase(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.post = Poste.objects.create(
            user=self.user, body='Test post 1', title='test1')
        self.comment = Comment.objects.create(
            user=self.user, post=self.post, body='Test comment')

    def test_delete_comment(self):
        """
        Test deleting a comment by the owner of the comment.
        """
        self.client.force_authenticate(user=self.user)

        # Get the URL for the comment deletion endpoint
        url = reverse('proof:comment_delete', args=[self.comment.id])

        # Send a DELETE request to delete the comment
        response = self.client.delete(url)

        # Assert that the response has a status code of 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert that the comment is deleted from the database
        self.assertFalse(Comment.objects.filter(id=self.comment.id).exists())

    def test_delete_comment_unauthorized(self):
        """
        Test deleting a comment by a user who is not the owner of the comment.
        """
        # Create a new user who is not the owner of the comment
        unauthorized_user = User.objects.create_user(
            username='unauthorizeduser', password='testpassword')
        self.client.force_authenticate(user=unauthorized_user)

        # Get the URL for the comment deletion endpoint
        url = reverse('proof:comment_delete', args=[self.comment.id])

        # Send a DELETE request to delete the comment
        response = self.client.delete(url)

        # Assert that the response has a status code of 403 (Forbidden)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Assert that the comment still exists in the database
        self.assertTrue(Comment.objects.filter(id=self.comment.id).exists())


class TestPostDeleteView(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testing321'
        )

        self.user2 = User.objects.create_user(
            username='testuser2',
            email='testuser2@example.com',
            password='testing4321'
        )

        self.post = Poste.objects.create(
            user=self.user,
            title='Test Post',
            body='Hello, this is a test post.',
        )
        self.url = reverse('proof:post_delete', args=[self.post.pk])

    def test_post_deletion_with_owner(self):
        """
        Test deleting a post by the owner of the post.
        """
        self.client.force_authenticate(user=self.user)

        # Send a DELETE request to delete the post
        response = self.client.delete(self.url)

        # Assert that the response has a status code of 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert that the post has been deleted from the database
        posts = Poste.objects.filter(title='Test Post')
        self.assertEqual(len(posts), 0)

    def test_post_deletion_without_owner(self):
        """
        Test deleting a post by a user who is not the owner of the post.
        """
        self.client.force_authenticate(user=self.user2)

        # Send a DELETE request to delete the post as a non-owner user
        response = self.client.delete(self.url)

        # Assert that the response has a status code of 403 (Forbidden)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Assert that the post has not been deleted from the database
        posts = Poste.objects.filter(title='Test Post')
        self.assertEqual(len(posts), 1)


class TestPostUpdateView(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testing321'
        )

        self.user2 = User.objects.create_user(
            username='testuser2',
            email='testuser2@example.com',
            password='testing4321'
        )

        self.post = Poste.objects.create(
            user=self.user,
            title='Test title',
            body='Test body',
        )

        self.url = reverse('proof:post_update', args=[self.post.id])

    def test_post_update_with_owner_POST(self):
        """
        Test updating a post by the owner of the post.
        """
        self.client.force_authenticate(user=self.user)

        data = {
            'user': self.user,
            'title': 'updated Test title',
            'body': 'updated test body',
        }

        # Send a PUT request to update the post
        response = self.client.put(self.url, data=data)

        post = Poste.objects.get(id=self.post.id)

        # Assert that the response has a status code of 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert that the post title and body have been updated in the database
        self.assertEqual(post.title, data['title'])
        self.assertEqual(post.body, data['body'])

    def test_post_update_with_invalid_data_with_owner_POST(self):
        """
        Test updating a post with invalid data by the owner of the post.
        """
        self.client.force_authenticate(user=self.user)

        data = {
            'user': self.user,
            'title': ImageFile(open('media/sample.jpg', 'rb')),
            'body': '',
        }

        # Send a PUT request to update the post with invalid data
        response = self.client.put(self.url, data=data)

        post = Poste.objects.get(id=self.post.id)

        # Assert that the response has a status code of 400 (Bad Request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Assert that the post title and body have not been updated in the database
        self.assertNotEqual(post.title, data['title'])
        self.assertNotEqual(post.body, data['body'])

    def test_post_update_without_owner_POST(self):
        """
        Test updating a post by a user who is not the owner of the post.
        """
        self.client.force_authenticate(user=self.user2)

        data = {
            'user': self.user,
            'title': 'updated Test title',
            'body': 'updated test body',
        }

        # Send a PUT request to update the post as a non-owner user
        response = self.client.put(self.url, data=data)

        post = Poste.objects.get(id=self.post.id)

        # Assert that the response has a status code of 403 (Forbidden)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Assert that the post title and body have not been updated in the database
        self.assertNotEqual(post.title, data['title'])
        self.assertNotEqual(post.body, data['body'])

    def test_post_update_without_login(self):
        """
        Test updating a post without authentication.
        """
        data = {
            'user': self.user,
            'title': 'updated Test title',
            'body': 'updated test body',
        }

        # Send a PUT request to update the post without authentication
        response = self.client.put(self.url, data=data)

        post = Poste.objects.get(id=self.post.id)

        # Assert that the response has a status code of 401 (Unauthorized)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Assert that the post title and body have not been updated in the database
        self.assertNotEqual(post.title, data['title'])
        self.assertNotEqual(post.body, data['body'])


class PostCreateViewTestCase(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')

    def test_create_post(self):
        """
        Test creating a post with valid data.
        """
        self.client.force_authenticate(user=self.user)

        # Define the data for the new post
        data = {
            'title': 'Test Title',
            'body': 'Test post body',
            # Add any other required fields for the PostCreateSerializer here
        }

        # Get the URL for the post creation endpoint
        url = reverse('proof:post_create')

        # Send a POST request to create a new post
        response = self.client.post(url, data)

        # Assert that the response has a status code of 201 (Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Assert that the post is created in the database
        self.assertTrue(Poste.objects.filter(
            body=data['body'], user=self.user).exists())

    def test_create_post_unauthorized(self):
        """
        Test creating a post without authentication.
        """
        # Define the data for the new post
        data = {
            'title': 'Test Title',
            'body': 'Test post body',
        }

        # Get the URL for the post creation endpoint
        url = reverse('proof:post_create')

        # Send a POST request to create a new post without authentication
        response = self.client.post(url, data)

        # Assert that the response has a status code of 401 (Unauthorized)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TestFollow(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username='testuser1',
            password='testpass123',
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='testpas123',
        )
        self.relation = Relation.objects.create(
            from_user=self.user1, to_user=self.user2)

    def test_followed_before(self):
        """
        Test that a user cannot follow another user they have already followed.
        """
        self.client.force_authenticate(user=self.user1)

        url = reverse('proof:follow', kwargs={"user_id": self.user2.id})

        # Send a POST request to follow the user
        response = self.client.post(url)

        # Check that the response has a status code of 403 (Forbidden)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_following_nonexistent_user(self):
        """
        Test following a nonexistent user.
        """
        self.client.force_authenticate(user=self.user1)

        url = reverse('proof:follow', kwargs={"user_id": 10})

        # Send a POST request to follow a nonexistent user
        response = self.client.post(url)

        # Check that the response has a status code of 404 (Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_not_followed_before(self):
        """
        Test following a user who has not been followed before.
        """
        self.client.force_authenticate(user=self.user2)

        url = reverse('proof:follow', kwargs={"user_id": self.user1.id})

        # Send a POST request to follow the user
        response = self.client.post(url)

        # Check that the response has a status code of 201 (Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check that the relation between the users now exists
        self.assertTrue(Relation.objects.filter(
            from_user=self.user1, to_user=self.user2).exists())


class TestUnFollow(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', password='12345'
        )
        self.other_user = User.objects.create_user(
            username='testuser2', password='12345'
        )
        self.following = Relation.objects.create(
            from_user=self.user,
            to_user=self.other_user
        )
        self.client.force_authenticate(user=self.user)

    def test_unfollow_user(self):
        """
        Test unfollowing a user.
        """
        url = reverse('proof:unfollow', kwargs={'user_id': self.other_user.id})

        # Send a POST request to unfollow the user
        response = self.client.post(url)

        # Check that the response has a status code of 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the relation between the users no longer exists
        self.assertFalse(
            Relation.objects.filter(
                from_user=self.user, to_user=self.other_user).exists())

    def test_cannot_unfollow_not_followed_user(self):
        """
        Test that a user cannot unfollow another user they haven't followed.
        """
        other_user2 = User.objects.create_user(
            username="other_user2", password='12345')
        url = reverse('proof:unfollow', kwargs={'user_id': other_user2.id})

        # Send a POST request to unfollow a user who hasn't been followed
        response = self.client.post(url)

        # Check that the response has a status code of 403 (Forbidden)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unfollow_invalid_user(self):
        """
        Test unfollowing an invalid user.
        """
        url = reverse('proof:unfollow', kwargs={'user_id': 99999})

        # Send a POST request to unfollow an invalid user
        response = self.client.post(url)

        # Check that the response has a status code of 404 (Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CommentReplyViewTestCase(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')

        # Create a test post
        self.post = Poste.objects.create(
            title='Test Post', body='Test body', user=self.user)

        # Create a test comment
        self.comment = Comment.objects.create(
            body='Test comment', user=self.user, post=self.post)

        # Generate the URL for creating a comment reply
        self.url = reverse('proof:commeent_reply', kwargs={
                           'comment_id': self.comment.id, 'post_id': self.post.id})

        # Authenticate the client with the test user
        self.client.force_authenticate(user=self.user)

    def test_create_reply(self):
        """
        Test creating a comment reply with valid data.
        """
        data = {'body': 'Test reply'}

        # Send a POST request to create a comment reply
        response = self.client.post(self.url, data)

        # Check that the response has a status code of 201 (Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check that the body of the created reply matches the provided data
        self.assertEqual(response.data['body'], 'Test reply')

    def test_create_reply_invalid_data(self):
        """
        Test creating a comment reply with invalid data.
        """
        data = {}

        # Send a POST request to create a comment reply with invalid data
        response = self.client.post(self.url, data)

        # Check that the response has a status code of 400 (Bad Request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Check that the response data contains an error message for the 'body' field
        self.assertEqual(response.data, {'body': ['This field is required.']})

    def test_create_reply_nonexistent_post(self):
        """
        Test creating a comment reply with a nonexistent post.
        """
        invalid_url = f'/api/posts/999/comments/{self.comment.id}/reply/'
        data = {'body': 'Test reply'}

        # Send a POST request to create a comment reply with a nonexistent post
        response = self.client.post(invalid_url, data)

        # Check that the response has a status code of 404 (Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_reply_nonexistent_comment(self):
        """
        Test creating a comment reply with a nonexistent comment.
        """
        invalid_url = f'/api/posts/{self.post.id}/comments/999/reply/'
        data = {'body': 'Test reply'}

        # Send a POST request to create a comment reply with a nonexistent comment
        response = self.client.post(invalid_url, data)

        # Check that the response has a status code of 404 (Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestPostLikeView(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.client = APIClient()

        # Create test users
        self.user1 = User.objects.create_user(
            username='testuser1',
            password='testpass123',
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='testpass210',
        )

        # Create a test post
        self.post = Poste.objects.create(
            title='Post 1',
            user=self.user1,
            body='Post 1 Body',
            slug='post-1',
        )

        # Create a vote (like) for the post by user1
        Vote.objects.create(user=self.user1, post=self.post)

    def test_liked_before(self):
        """
        Test the post like view when the post has already been liked by the user.
        """
        self.client.force_authenticate(user=self.user1)

        # Send a POST request to like the post again
        response = self.client.post(
            reverse('proof:post_like', args=[self.post.id]))

        # Check if the response is successful (HTTP 200 OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the vote (like) by user1 for the post is removed
        self.assertFalse(Vote.objects.filter(
            user=self.user1, post=self.post).exists())

    def test_not_liked_before(self):
        """
        Test the post like view when the post has not been liked by the user before.
        """
        self.client.force_authenticate(user=self.user2)

        # Send a POST request to like the post
        response = self.client.post(
            reverse('proof:post_like', args=[self.post.id]))

        # Check if the response indicates successful creation (HTTP 201 CREATED)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check if the vote (like) by user2 for the post exists
        self.assertTrue(Vote.objects.filter(
            user=self.user2, post=self.post).exists())


# class TestUserRelations(TestCase):


class TestEditProfileView(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.client = APIClient()

        # Create test users
        self.user1 = User.objects.create_user(
            username='testuser1',
            password='testpass123',
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='testpass210',
        )

    def test_edit_profile_valid_data_POST(self):
        """
        Test the edit profile view with valid data using POST method.
        """
        self.client.force_authenticate(user=self.user2)

        # Prepare valid data for profile update
        data = {
            "bio": 'Hello its Me',
            "picture": ImageFile(open('media/sample.jpg', 'rb')),
        }

        # Send a PUT request to update the profile
        response = self.client.put(
            reverse('proof:edit_profile', args=[self.user2.username]), data=data)

        # Check if the response is successful (HTTP 200 OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the profile is updated with the new data
        new_user = User.objects.get(username='testuser2')
        self.assertEqual(data['bio'], new_user.bio)

    def test__edit_profile_invalid_data_POST(self):
        """
        Test the edit profile view with invalid data using POST method.
        """
        self.client.force_authenticate(user=self.user2)

        # Prepare invalid data for profile update
        data = {
            "bio": ImageFile(open('media/sample.jpg', 'rb')),
            "picture": 'adc'
        }

        # Send a PUT request with invalid data
        response = self.client.put(
            reverse('proof:edit_profile', args=[self.user2.username]), follow=True, data=data)

        # Check if the response indicates bad request (HTTP 400 BAD REQUEST)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestDirectListView(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.client = APIClient()

        # Create test users
        self.user1 = User.objects.create_user(
            username='testuser1',
            password='testpass123',
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='testpass210',
        )

        # Create test direct messages
        self.message1 = Directs.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            title='first',
            body='it is the first test message',
        )
        self.message2 = Directs.objects.create(
            from_user=self.user2,
            to_user=self.user1,
            title='second',
            body='it is the second test message',
        )

    def test_direct_list_view(self):
        """
        Test the direct list view.
        """
        self.client.force_authenticate(user=self.user1)

        # Get the list of direct messages
        response = self.client.get(reverse('proof:direct_list'))

        # Check if the received messages and sent messages are correct
        self.assertEqual(len(response.data['directs']['received_messages']), 1)
        self.assertEqual(len(response.data['directs']['sent_messages']), 1)

        # Check if the response is successful (HTTP 200 OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestDirectView(APITestCase):
    def setUp(self):
        """
        Set up the necessary objects for the test case.
        """
        self.client = APIClient()

        # Create test users
        self.user1 = User.objects.create_user(
            username='testuser1',
            password='testpass123',
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='testpass210',
        )
        self.user3 = User.objects.create_user(
            username='testuser3',
            password='testpass321',
        )

        # Create a test direct message
        self.message1 = Directs.objects.create(
            from_user=self.user2,
            to_user=self.user1,
            title='first',
            body='it is the first test message',
        )

    def test_direct_list_view_valid_user(self):
        """
        Test the direct list view for a valid user.
        """
        self.client.force_authenticate(user=self.user1)

        # Get the direct message by its ID
        response = self.client.get(
            reverse('proof:directs', kwargs={'direct_id': self.message1.id}))

        # Check if the response is successful and the message body is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['direct']['body'], self.message1.body)

    def test_direct_list_view_invalid_user(self):
        """
        Test the direct list view for an invalid user.
        """
        self.client.force_authenticate(user=self.user3)

        # Get the direct message by its ID
        response = self.client.get(
            reverse('proof:directs', args=[self.message1.id]))

        # Check if the response is forbidden (403)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestSendDirectView(APITestCase):
    def setUp(self):
        # Set up necessary data for the tests
        self.sender = User.objects.create_user(
            username='sender', password='senderpass')
        self.recipient = User.objects.create_user(
            username='recipient', password='recipientpass')
        self.url = reverse('proof:create_direct', args=[
                           self.recipient.username])

    def test_send_direct_message(self):
        """Test sending a direct message with valid data."""
        self.client.force_authenticate(user=self.sender)

        data = {'title': 'Test message', 'body': 'Test Message Body'}

        response = self.client.post(self.url, data)

        # Assert the expected results
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data, {'message': 'Direct message sent successfully.'})
        self.assertEqual(Directs.objects.count(), 1)
        direct = Directs.objects.first()
        self.assertEqual(direct.from_user, self.sender)
        self.assertEqual(direct.to_user, self.recipient)
        self.assertEqual(direct.title, 'Test message')

    def test_send_direct_message_invalid_data(self):
        """Test sending a direct message with invalid data."""
        self.client.force_authenticate(user=self.sender)

        data = {}

        response = self.client.post(self.url, data)

        # Assert the expected results
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
                         'title': ['This field is required.'], 'body': ['This field is required.']})

    def test_send_direct_message_nonexistent_recipient(self):
        """Test sending a direct message to a nonexistent recipient."""
        self.client.force_authenticate(user=self.sender)

        invalid_url = reverse('proof:create_direct', args=["invalid"])
        data = {'title': 'Test message', 'body': 'bofy test'}

        response = self.client.post(invalid_url, data)

        # Assert the expected results
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_send_direct_message_unauthenticated(self):
        """Test sending a direct message without authentication."""
        data = {'title': 'Test message', 'body': 'Test Message Body'}

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
