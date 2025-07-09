from django.db import models
from multiselectfield import MultiSelectField
from cities.models import City, Area


class House(models.Model):
    HOUSE_TYPE_CHOICES = [
        ('pg', 'PG'),
        ('flat', 'Flat')
    ]

    COMMON_AMENITIES_CHOICES = [
        ('room_cleaning', 'Room Cleaning'),
        ('cooking', 'Cooking'),
        ('lift', 'Lift'),
        ('warden', 'Warden'),
        ('laundry', 'Laundry'),
        ('mess', 'Mess'),
        ('refrigerator', 'Refrigerator'),
        ('wifi', 'Wifi'),
        ('power_backup', 'Power Backup'),
        ('common_tv', 'Common TV'),
    ]
    SUITABLE_FOR_CHOICES = [
        ('men', 'Men'),
        ('women', 'Women'),
        ('both', 'Both Men & Women'),
        ('family', 'Family'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High')
    ]

    PARKING_CHOICES = [
        ('bike', 'Bike Parking'),
        ('car', 'Car Parking'),
    ]

    title = models.CharField(max_length=200)
    address = models.CharField(max_length=300, blank=True, null=True)
    price = models.IntegerField()
    security_deposit = models.IntegerField(default=0)

    house_type = models.CharField(max_length=20, choices=HOUSE_TYPE_CHOICES)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    suitable_for = MultiSelectField(choices=SUITABLE_FOR_CHOICES, blank=True)
    food = models.BooleanField(default=False)
    bedrooms = models.PositiveIntegerField(default=1)

    public_transport = models.BooleanField(default=False)
    nightlife = models.BooleanField(default=False)
    restaurants = models.BooleanField(default=False)
    parks = models.BooleanField(default=False)
    shopping_centers = models.BooleanField(default=False)
    schools = models.BooleanField(default=False)
    healthcare = models.BooleanField(default=False)
    gyms = models.BooleanField(default=False)
    cafes = models.BooleanField(default=False)
    safety = models.BooleanField(default=False)

    parking = MultiSelectField(choices=PARKING_CHOICES, blank=True)

    pet_friendly = models.BooleanField(default=False)

    commute_time_priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    social_life_priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    family_friendliness_priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')

    geaser = models.BooleanField(default=False)
    tv = models.BooleanField(default=False)
    cupboard = models.BooleanField(default=False)
    attached_bathroom = models.BooleanField(default=False)
    bedding = models.BooleanField(default=False)
    
    common_amenities = MultiSelectField(choices=COMMON_AMENITIES_CHOICES, blank=True)
    google_map_link = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.title


class HouseImage(models.Model):
    house = models.ForeignKey(House, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"Image for {self.house.title}"


class MapLocations(models.Model):
    PLACE_TYPE_CHOICES = [
        ('movie_theater', 'Movie Theater'),
        ('shopping_mall', 'Shopping Mall'),
        ('hospital', 'Hospital'),
        ('school', 'School'),
        ('atm', 'ATM'),
        ('bus_station', 'Bus Station'),
        ('airport', 'Airport'),
        ('metro_station', 'Metro Station'),
        ('train_station', 'Train Station'),
        ('other', 'Other'),
    ]

    house = models.ForeignKey(House, on_delete=models.CASCADE, related_name='map_locations')
    name = models.CharField(max_length=200)
    place_type = models.CharField(max_length=20, choices=PLACE_TYPE_CHOICES)
    description = models.TextField(blank=True, null=True)
    map_embed_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.place_type}) near {self.house.title}"
