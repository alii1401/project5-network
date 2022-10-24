from dataclasses import fields
from .models import *
from rest_framework import serializers
# from django.core import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class FollowSerializer(serializers.ModelSerializer):
    people_follow = UserSerializer(many=True)
    # data = serializers.serialize("json",Follow.objects.all())

    class Meta:
        model = Follow
        fields = '__all__'

class NewPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewPost
        fields = '__all__'

class LikesSerializer(serializers.ModelSerializer):
    id_likes = NewPostSerializer(many=True)

    class Meta:
        model = Likes
        fields = '__all__'