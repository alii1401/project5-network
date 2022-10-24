from ast import Delete
from email.policy import default
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

    def serialize(self):
        return {
            'username':self.username,
            'email':self.email,
            'passwoed':self.password
        }

class Follow(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user_follow')
    following = models.PositiveIntegerField(default = 0)
    followers = models.PositiveIntegerField(default = 0)
    people_follow = models.ManyToManyField(User,related_name= 'people_follow', blank=True,default = None)
    
    def serialize(self):
        return{
            "id":self.id,
            "username":self.username,
            "following":self.following,
            "followers":self.followers,
            "people_follow":self.people_follow
        }

    def __str__(self):
        return f"username:{self.username}, following:{self.following},followers:{self.followers}  "

class NewPost(models.Model):
    # id = models.PrimaryKey()
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length = 64)
    body = models.TextField()
    likes = models.PositiveIntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    follow = models.ForeignKey(Follow,on_delete = models.CASCADE,blank=True,null=True)
    is_active = models.BooleanField(default=False,blank=True,null=True)


    # class 

    def serialize(self):
        # f = [follow.serialize() for follow in self.follow.people_follow.all()]
        return{
            "id":self.id,
            "username":self.username.username,
            "title":self.title,
            "body":self.body,
            "timestamp":self.timestamp.strftime("%d %b %Y, %I:%M %p"),
            "followers":self.follow.followers,
            "following":self.follow.following,
            "is_active":self.is_active,
            "likes":self.likes,
            # "people_follow":f
        }

    def __str__(self):
        return f"id:{self.id}, username:{self.username}, title:{self.title}"


class Likes(models.Model):
    username = models.ForeignKey(User,on_delete=models.CASCADE,blank=True)
    id_likes = models.ManyToManyField(NewPost,related_name='id_likes',blank=True)
    # is_like  = models.

    def serialize(self):
        return{
            "id":self.id,
            "username":self.username.username,
            
        }

    def __str__(self):
        return f"username:{self.username}, id:{self.id}" 




