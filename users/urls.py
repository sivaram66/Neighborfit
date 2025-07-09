from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.register, name='signup'),
    path('validate_otp/', views.validate_otp, name='validate_otp'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('resend_otp/', views.resend_otp, name='resend_otp'),
]
