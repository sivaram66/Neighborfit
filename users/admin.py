from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'phone', 'name', 'is_active')
    list_filter = ('is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'phone', 'name', 'password', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'name', 'password1', 'password2', 'is_active')}
         ),
    )
    search_fields = ('email', 'phone', 'name')
    ordering = ('email',)


admin.site.register(CustomUser, CustomUserAdmin)
