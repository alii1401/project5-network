import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from requests import delete

from .models import Follow, NewPost, User
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response


def index(request):
    return render(request, "network/index.html")

@csrf_exempt
# @login_required
def posts(request):
    if request.method == "GET":
        posts = NewPost.objects.all()
        posts = posts.order_by("-timestamp").all()

        if request.user.is_authenticated:

            posts_likes = Likes.objects.all()
            if posts_likes is None:
                likes = Likes(
                username = request.user
                )
                likes.save()

                posts_likes = Likes.objects.all()

            for post in posts:
                post.is_active = False
                post.save()
                # P.save(update_fields=['is_active'])


            for post in posts:
                if post.username == request.user:
                    post.is_active = True
                    post.save()

        # return JsonResponse({"error":"POST request required."},status=400)
        return JsonResponse([post.serialize() for post in posts], safe=False)


    if request.method == 'POST' and request.user.is_authenticated:
        data = json.loads(request.body)
        follow_user = Follow.objects.get(username__username = request.user)
        if follow_user is None:
            f = Follow(username__username = request.user)
            f.save()

            follow_user = Follow.objects.get(username = request.user)

        posts_likes = Likes.objects.all()
        if posts_likes is None:
            likes = Likes(
            username = request.user
            )
            likes.save()

            posts_likes = Likes.objects.all() 

        newpost = NewPost(
            username = request.user,
            title = data.get("title"),
            body = data.get("body"),
            follow = follow_user
        )
        newpost.save()

        return JsonResponse({"message":"NewPost save succesfuly!"},status=201)

@csrf_exempt
def get_put_post(request,post_id):

     # Query for requested post
    try:
        post0 = NewPost.objects.get(pk=post_id)
    except NewPost.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    # Return post contents
    if request.method == "GET" and post_id != '' :
        return JsonResponse(post0.serialize())

    # get user's posts
    elif request.method == "GET" and post_id == '' :
        posts = NewPost.objects.all(username = request.user)
        posts = posts.order_by("-timestamp").all()
        # follows = Follow.objects.all()

        return JsonResponse([post.serialize() for post in posts ], safe=False)


    # edit post
    elif request.method == "PUT":
        data = json.loads(request.body)
        # if data.get("read") is not None:
        #     email.read = data["read"]
        # if data.get("archived") is not None:
        #     email.archived = data["archived"]
        # email.save()
        if data.get("title") is not None:
            post0.title = data["title"]
            post0.body = data["body"]
            post0.save()
        return HttpResponse(status=204)

    # post must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

# @login_required
@csrf_exempt
@api_view(['PUT','GET','POST']) 
def update_follow(request, name, task): 
    # Query for requested post 


    # view realate to following button
    if request.method == "GET" and name == 'following' and task == 'watch':
        # users = User.objects.all()

        posts = NewPost.objects.filter(username = request.user)
        posts = posts.order_by("-timestamp").all()

        return JsonResponse([post.serialize() for post in posts], safe=False )

    # check following or unfollowing
    elif request.method == "GET" and name == 'people' and task == 'follow':
        follow = Follow.objects.get(username = request.user)
        # print(follow.people_follow.username)
        serializer = FollowSerializer(follow, many=False)
        return Response(serializer.data)

    elif request.method == "GET" and name == 'give' and task == 'postLikes':
        if request.user.is_authenticated:
            posts_likes = Likes.objects.get(username = request.user)
            # posts_likes = posts_likes.order_by("-timestamp").all()
        # posts_likes = Likes.objects.all()
        # if posts_likes is None:
        #     likes = Likes(
        #     username = request.user
        #     )
        #     likes.save()

        #     posts_likes = Likes.objects.all()
            serializer = LikesSerializer(posts_likes, many=False)
            return Response(serializer.data)

        else:
            # postsLikes = '' 
            # return HttpResponse(status = 204)
            return JsonResponse({
                "postsLikes":{
                    "id_likes":''
                }
                }, status=400)


        
    else:
        return JsonResponse({
                "error": "GET or PUT request required."
            }, status=400)

@csrf_exempt
def change(request,name,task):
    flag = 0
    posts_likes = Likes.objects.all()
    if posts_likes is None:
        likes = Likes(
        username = request.user
        )
        likes.save()

        posts_likes = Likes.objects.all()

    for post_like in posts_likes:
        if post_like.username == request.user:
            flag = 1

    if flag == 0:
        likes = Likes(
        username = request.user
        )
        likes.save()

        post_like = Likes.objects.get(username__username = request.user)
        id = name
    else:
        post_like = Likes.objects.get(username__username = request.user)
        id = name
    

        # add and remove followers or following from database of users
    # if task != 'like' or task != 'unlike':
        # try:
            # for change followers,following and the people
                # followed_person = Follow.objects.get(username__username = name)
                # print(followed_person)
                # following_person = Follow.objects.get(username__username = request.user)
                # print(following_person)

                # # for 
                # user = User.objects.get(username = name)
                # print(f"u:{user}")

                # userlike = NewPost.objects.get(username__username = name)

                # userlike = NewPost.objects.get(pk = id)
                # print(userlike)

        # except NewPost.DoesNotExist:
        #     return JsonResponse({"error": "Post not found."}, status=404)

    if request.method == 'PUT':
        if task == 'positive' or task == 'negative':
            followed_person = Follow.objects.get(username__username = name)
            print(followed_person)
            following_person = Follow.objects.get(username__username = request.user)
            print(following_person)

                # for 
            user = User.objects.get(username = name)
            print(f"u:{user}")

            if task == 'positive':
                followed_person.followers += 1 

                following_person.following += 1

                followed_person.save()
                following_person.save()

                following_person.people_follow.add(user)  

                print(followed_person)
                print(following_person) 
                return HttpResponse(status = 204)

            elif task == 'negative':
                followed_person.followers -= 1

                following_person.following -= 1

                following_person.people_follow.remove(user)
                followed_person.save()
                following_person.save()

                # f.delete()

                return HttpResponse(status = 204)

        if task == 'like':
            userlike = NewPost.objects.get(pk = id)
            print(userlike)

            userlike.likes += 1
            userlike.save()

            post_like.save()
            post_like.id_likes.add(id)

            return HttpResponse(status = 204)


        elif task == 'unlike':
            userlike = NewPost.objects.get(pk = id)
            print(userlike)

            userlike.likes -= 1
            userlike.save()

            post_like.id_likes.remove(id)
            post_like.save()

            return HttpResponse(status = 204)


        # elif task == 'add':
        #     post_like.save()
        #     post_like.id_likes.add(id)

        # elif task == 'remove':
        #     post_like.id_likes.remove(id)
        #     post_like.save()
        


        else:
            return JsonResponse({
                "error":"Check the arguments..."
            }, status = 400)


    else:
        return JsonResponse({
                "error": "GET or PUT request required."
            }, status=400)
 
@csrf_exempt
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("network:index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("network:index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            u = User.objects.get(username = username)
            follow = Follow(
                username = u
                )
            follow.save()

            likes = Likes(
            username = u
            )
            likes.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("network:index"))
    else:
        return render(request, "network/register.html")
