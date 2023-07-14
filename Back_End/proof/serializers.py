from rest_framework import serializers
from proof.models import Poste, Comment, Directs
from accounts.models import MyUsers


class PosteSerializer(serializers.ModelSerializer):
    """
    Serializer for the Poste model.
    """

    user = serializers.SlugRelatedField(slug_field='username', read_only=True)

    class Meta:
        model = Poste
        fields = '__all__'


class PosteCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new Poste.
    """

    class Meta:
        model = Poste
        fields = ['title', 'body', 'image']
        extra_kwargs = {
            'image': {'required': False}
        }


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the MyUsers model.
    """

    class Meta:
        model = MyUsers
        fields = ('id', 'username', 'email', 'bio', 'picture')


class CommentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new Comment.
    """

    class Meta:
        model = Comment
        fields = ('body', )


class CommentShowSerializer(serializers.ModelSerializer):
    """
    Serializer for showing a Comment with its replies.
    """

    user = serializers.SlugRelatedField(slug_field='username', read_only=True)
    post = serializers.SlugRelatedField(slug_field='title', read_only=True)

    replys = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_replys(self, obj):
        """
        Retrieve the replies for a Comment.
        """
        result = obj.rcomments.all()
        return CommentShowSerializer(result, many=True).data


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating a MyUsers instance.
    """

    class Meta:
        model = MyUsers
        fields = ('bio', 'picture',)


class DirectsSerializer(serializers.ModelSerializer):
    """
    Serializer for the Directs model.
    """

    from_user = serializers.SlugRelatedField(slug_field='username', read_only=True)
    to_user = serializers.SlugRelatedField(slug_field='username', read_only=True)

    class Meta:
        model = Directs
        fields = ('from_user', 'to_user', 'title', 'body', 'created', 'updated')


class DirectsCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new Directs instance.
    """

    class Meta:
        model = Directs
        fields = ('title', 'body')
