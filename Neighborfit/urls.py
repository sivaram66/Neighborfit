from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('houses.urls')),
    path('cities/', include('cities.urls')),
    path('houses/', include('houses.urls')),
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
]
