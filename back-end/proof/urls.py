from django.urls import path
from . import views

app_name = 'proof'
urlpatterns = [
    path('<str:username>/', views.UserProfileView.as_view(), name="proof"),
    path('post/<int:post_id>/<slug:post_slug>/',views.PostDetailView.as_view(), name='post_details'),
    path('comment/create/<int:post_id>/<slug:post_slug>/',views.CommentCreateView.as_view(), name='comment_create'),
    path('post/delete/<int:pk>/', views.PostDeleteView.as_view(), name="post_delete"),
    path('update/<int:post_id>/', views.PostUpdateView.as_view(), name="post_update"),
    path('post/create', views.PostCreateView.as_view(), name="post_create"),
    path('follow/<int:user_id>/', views.Follow.as_view(), name="follow"),
    path('Unfollow/<int:user_id>/', views.UnFollow.as_view(), name="unfollow"),
    path("comment/delete/<int:comment_id>/", views.CommentDeleteView.as_view(), name='comment_delete'),
    path("comment/reply/<int:comment_id>/<post_id>/",views.CommentReplyView.as_view(), name='commeent_reply'),
    path('like/<int:post_id>/', views.PostLikeView.as_view(), name='post_like'),
    path('followers-following/<str:username>/', views.UserRelations.as_view(), name='relations'),
    path('edit_profile/<str:username>/', views.EditProfileView.as_view(), name="edit_profile"),
    path('direct_list', views.DirectListView.as_view(), name="direct_list"),
    path('directs/<int:direct_id>/', views.DirectView.as_view(), name="directs"),
    path('send_direct/<str:username>/', views.SendDirectView.as_view(), name='create_direct'),
]
