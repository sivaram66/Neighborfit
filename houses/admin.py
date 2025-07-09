from django.contrib import admin
from .models import House, HouseImage, MapLocations


class HouseImageInline(admin.TabularInline):
    model = HouseImage
    extra = 1


class MapLocationInline(admin.TabularInline):
    model = MapLocations
    extra = 1


class HouseAdmin(admin.ModelAdmin):
    inlines = [HouseImageInline, MapLocationInline]
    list_display = ('title', 'price', 'house_type', 'city', 'area')
    search_fields = ('title', 'address')
    list_filter = ('house_type', 'city', 'area')


admin.site.register(House, HouseAdmin)
admin.site.register(HouseImage)
admin.site.register(MapLocations)
