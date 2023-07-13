from proof.models import Poste
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from home.serializers import PosteSerializer, UserSerializer
from proof.models import Relation
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated

User = get_user_model()


class ExploreView(APIView):
    """
    API view for retrieving posts and users.

    This view retrieves all posts and users from the database. It also provides
    filtering functionality based on a search term.

    - To retrieve all posts and users, make a GET request to the endpoint.
    - To filter posts and users based on a search term, include the 'search'
      query parameter in the request.

    Example: /api/home?search=example

    Note: The search term is case-sensitive.

    Responses:
    - 200: Successful response with a list of posts and users.
    """

    @extend_schema(
        description="Retrieve posts and users",

        parameters=[
            {
                'name': 'search',
                'required': False,
                'type': 'string',
                'in': 'query',
                'description': 'Search term for filtering posts and users',
            }
        ],
    )
    def get(self, request):
        """
        Get posts and users.

        Retrieves all posts and users from the database. Optionally filters
        posts and users based on a search term.

        Query Parameters:
        - search (optional): Search term for filtering posts and users.

        Returns:
        - 200: Successful response with a list of posts and users.
        """
        # Retrieve all posts and users from the database
        posts = Poste.objects.all()
        users = User.objects.all()

        # Filter posts and users based on the 'search' query parameter, if provided
        if request.GET.get("search"):
            posts = posts.filter(body__contains=request.GET.get("search"))
            users = users.filter(username__contains=request.GET.get("search"))

        # Serialize the posts and users data
        post_serializer = PosteSerializer(posts, many=True)
        user_serializer = UserSerializer(users, many=True)

        # Return the serialized data in the response
        return Response({
            'posts': post_serializer.data,
            'users': user_serializer.data,
        })


class HomeView(APIView):
    """
    API view for exploring posts and users.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handle GET request for exploring posts and users.
        """

        # Get the relations where the current user is the "from_user"
        temp = Relation.objects.filter(from_user=request.user).values("to_user")

        # Retrieve posts created by users in the "to_user" field of relations
        posts = Poste.objects.filter(user__in=temp)

        # Retrieve users in the "to_user" field of relations
        users = Relation.objects.filter(from_user=request.user).values("to_user")

        # Apply search filter if "search" parameter is provided in the query string
        if request.GET.get("search"):
            posts = posts.filter(body__contains=request.GET.get("search"))
            users = users.filter(username__contains=request.GET.get("search"))

        # Serialize posts and users
        post_serializer = PosteSerializer(posts, many=True)
        user_serializer = UserSerializer(users, many=True)

        # Return response with serialized data
        return Response({
            'posts': post_serializer.data,
            'users': user_serializer.data,
        })
