from rest_framework import serializers
from proof.models import Poste
from accounts.models import MyUsers


class PosteSerializer(serializers.ModelSerializer):
    """
    Serializer for the Poste model.
    """

    user = serializers.SlugRelatedField(slug_field='username', read_only=True)

    class Meta:
        model = Poste
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the MyUsers model.
    """

    class Meta:
        model = MyUsers
        fields = ('id', 'username', 'email')
