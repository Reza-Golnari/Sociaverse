from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


app_name = 'accounts'
urlpatterns = [
    path('register/', views.UserRegisterView.as_view(),
         name='user_register'),  # User registration
    path('logout/', views.UserLogoutView.as_view(),
         name='user_logout'),  # User logou
    path("reset/main", views.UserPassReset.as_view(),
         name="reset"),  # Password reset - enter email
    path("reset/sent", views.UserPassDone.as_view(),
         name="pass_reset_done"),  # Password reset - email sent
    path("confrim/<uidb64>/<token>/", views.UserPassConf.as_view(),
         name="user_reset_confrim"),  # Password reset - confirm reset
    path("confrim/finish", views.UserPassComplete.as_view(),
         name="user_reset_complete"),  # Password reset - complete reset
    path("api/token/", TokenObtainPairView.as_view(),
         name='token_obtain_pair'),  # Obtain token
    path("api/token/refresh/", TokenRefreshView.as_view(),
         name='token_refresh'),  # Refresh token
]
