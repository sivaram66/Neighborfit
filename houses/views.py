
from .models import House, Area, City
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.db.models import Q


def home(request):
    user_name = None
    if request.user.is_authenticated:
        user_name = request.user.name  

    context = {
        'user_name': user_name,
    }
    return render(request, 'index.html', context)


def about(request):
    return render(request, 'about.html')


def dashboard(request):
    return render(request, 'dashboard.html')


def preferences(request):
    if request.method == "POST":
        selected_city_id = request.POST.get('city')
    else:
        selected_city_id = request.GET.get('city')

    cities = City.objects.all()
    if selected_city_id:
        areas = Area.objects.filter(city_id=selected_city_id)
    else:
        areas = Area.objects.none()

    if request.method == "POST":
        city_id = request.POST.get('city')
        area_id = request.POST.get('area')
        house_type = request.POST.get('house_type')
        price_range = request.POST.get('budget_range')
        suitable_for = request.POST.getlist('suitable_for')
        food = request.POST.get('food')
        public_transport = request.POST.get('public_transport')
        nightlife = request.POST.get('nightlife')
        restaurants = request.POST.get('restaurants')
        parks = request.POST.get('parks')
        shopping_centers = request.POST.get('shopping_centers')
        schools = request.POST.get('schools')
        healthcare = request.POST.get('healthcare')
        gyms = request.POST.get('gyms')
        cafes = request.POST.get('cafes')
        safety = request.POST.get('safety')
        parking = request.POST.getlist('parking')
        pet_friendly = request.POST.get('pet_friendly')
        commute_time_priority = request.POST.get('commute_time_priority')
        social_life_priority = request.POST.get('social_life_priority')
        family_friendliness_priority = request.POST.get('family_friendliness_priority')
        geaser = request.POST.get('geaser')
        tv = request.POST.get('tv')
        cupboard = request.POST.get('cupboard')
        attached_bathroom = request.POST.get('attached_bathroom')
        bedding = request.POST.get('bedding')

        filters = Q()
        if city_id:
            filters &= Q(city_id=city_id)
        if area_id:
            filters &= Q(area_id=area_id)
        if house_type:
            filters &= Q(house_type=house_type)

        if suitable_for:
            q = Q()
            for value in suitable_for:
                q |= Q(suitable_for__icontains=value)
            filters &= q

        if parking:
            q = Q()
            for value in parking:
                q |= Q(parking__icontains=value)
            filters &= q

        if food:
            filters &= Q(food=True)
        if public_transport:
            filters &= Q(public_transport=True)
        if nightlife:
            filters &= Q(nightlife=True)
        if restaurants:
            filters &= Q(restaurants=True)
        if parks:
            filters &= Q(parks=True)
        if shopping_centers:
            filters &= Q(shopping_centers=True)
        if schools:
            filters &= Q(schools=True)
        if healthcare:
            filters &= Q(healthcare=True)
        if gyms:
            filters &= Q(gyms=True)
        if cafes:
            filters &= Q(cafes=True)
        if safety:
            filters &= Q(safety=True)
        if pet_friendly:
            filters &= Q(pet_friendly=True)
        if commute_time_priority:
            filters &= Q(commute_time_priority=commute_time_priority)
        if social_life_priority:
            filters &= Q(social_life_priority=social_life_priority)
        if family_friendliness_priority:
            filters &= Q(family_friendliness_priority=family_friendliness_priority)
        if geaser:
            filters &= Q(geaser=True)
        if tv:
            filters &= Q(tv=True)
        if cupboard:
            filters &= Q(cupboard=True)
        if attached_bathroom:
            filters &= Q(attached_bathroom=True)
        if bedding:
            filters &= Q(bedding=True)

        if price_range:
            if '-' in price_range:
                min_price, max_price = map(int, price_range.split('-'))
                filters &= Q(price__gte=min_price, price__lte=max_price)
            elif price_range.endswith('+'):
                min_price = int(price_range[:-1])
                filters &= Q(price__gte=min_price)

        matching_houses = House.objects.filter(filters)
        return render(request, "results.html", {
            "houses": matching_houses,
            "match_count": matching_houses.count(),
            "filter_tags": [],
        })

    return render(request, "preferences.html", {
        "cities": cities,
        "areas": areas,
        "selected_city_id": selected_city_id,
    })


def results(request):
    houses = House.objects.all()

    city_name = request.GET.get('city')
    max_price = request.GET.get('max_price')
    house_type = request.GET.get('house_type')
    pet_friendly = request.GET.get('pet_friendly')
    public_transport = request.GET.get('public_transport')
    suitable_for = request.GET.get('suitable_for')
    area_name = request.GET.get('area')

    filter_tags = []
    if area_name:
        houses = houses.filter(area__name__iexact=area_name)
        filter_tags.append(area_name.capitalize())

    if city_name:
        houses = houses.filter(city__name__iexact=city_name)
        filter_tags.append(city_name.capitalize())

    if max_price:
        try:
            max_price_int = int(max_price)
            houses = houses.filter(price__lte=max_price_int)
            filter_tags.append(f"₹{max_price_int} Max")
        except ValueError:
            pass

    if house_type:
        houses = houses.filter(house_type__iexact=house_type)
        filter_tags.append(house_type.capitalize())

    if pet_friendly == 'yes':
        houses = houses.filter(pet_friendly=True)
        filter_tags.append("Pet Friendly")
    elif pet_friendly == 'no':
        houses = houses.filter(pet_friendly=False)
        filter_tags.append("No Pets")

    if public_transport == 'yes':
        houses = houses.filter(public_transport=True)
        filter_tags.append("Public Transport Nearby")
    elif public_transport == 'no':
        houses = houses.filter(public_transport=False)
        filter_tags.append("No Public Transport")

    if suitable_for:
        if suitable_for == 'both':
            houses = houses.filter(suitable_for__icontains='family') | houses.filter(suitable_for__icontains='bachelor')
            filter_tags.append("Suitable for Both")
        elif suitable_for == 'family':
            houses = houses.filter(suitable_for__icontains='family')
            filter_tags.append("Family Friendly")
        else:
            houses = houses.filter(suitable_for__icontains=suitable_for)
            filter_tags.append(f"Suitable for {suitable_for.capitalize()}")

    houses = houses.order_by('price')

    match_count = houses.count()

    context = {
        'houses': houses,
        'match_count': match_count,
        'filter_tags': filter_tags,
    }

    return render(request, 'results.html', context)


def contact(request):
    return render(request, 'contact.html')


def property_details(request, house_id):
    house = get_object_or_404(House, id=house_id)
    nearby_places = house.map_locations.all()

    similar_properties = House.objects.filter(area=house.area).exclude(id=house.id)[:4]
    images = house.images.all()
    context = {
        "house": house,
        "images": images,
        "similar_properties": similar_properties,
        "nearby_places": nearby_places,
    }
    return render(request, "property_details.html", context)


def get_areas(request):
    city_id = request.GET.get('city_id')
    areas = Area.objects.filter(city_id=city_id).values('id', 'name')
    return JsonResponse({'areas': list(areas)})


def quicksearch(request):
    if request.method == "GET":
        city_id = request.GET.get('quick-city')
        area_id = request.GET.get('quick-area')
        house_type = request.GET.get('property-type')
        budget = request.GET.get('quick-budget')

        params = {}

        if city_id:
            from .models import City
            try:
                city_obj = City.objects.get(id=city_id)
                params['city'] = city_obj.name
            except City.DoesNotExist:
                pass

        if area_id:
            from .models import Area
            try:
                area_obj = Area.objects.get(id=area_id)
                params['area'] = area_obj.name
            except Area.DoesNotExist:
                pass

        if house_type:
            params['house_type'] = house_type

        if budget:
            if '-' in budget:
                _, max_price = budget.split('-')
                params['max_price'] = max_price
            elif budget.endswith('+'):
                params['max_price'] = budget[:-1]

        return redirect(f"/houses/results/?{'&'.join([f'{k}={v}' for k, v in params.items()])}")

    return redirect('home')


