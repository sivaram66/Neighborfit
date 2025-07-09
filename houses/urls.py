from django.urls import path  # type: ignore
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('preferences/', views.preferences, name='preferences'),
    path('results/', views.results, name='results'),
    path('contact/', views.contact, name='contact'),
    path('get-areas/', views.get_areas, name='get_areas'),
    path('quicksearch/', views.quicksearch, name='quicksearch'),
    path('houses/<int:house_id>//',
         views.property_details, name='property_details'),
]
