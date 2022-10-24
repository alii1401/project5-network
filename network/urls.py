from django.urls import path
from . import views

app_name="network"
urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("posts", views.posts, name="posts"),
    path("posts/<int:post_id>", views.get_put_post, name="get_put_post"),
    path("posts/<slug:name>/<slug:task>",views.update_follow,name="update_follow"),
    path("change/<slug:name>/<slug:task>",views.change,name="change"),
]
