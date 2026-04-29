from django.contrib import admin
from .models import Category, Product, UserProfile, Order, OrderItem, Cart, CartItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_amount', 'created_at', 'total_items']
    list_filter = ['created_at']
    search_fields = ['user__username']
    inlines = [OrderItemInline]

    def total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

    total_items.short_description = "Total Items"


admin.site.register(Category)
admin.site.register(Product)
admin.site.register(UserProfile)

admin.site.register(Order, OrderAdmin)   # 👈 important
admin.site.register(OrderItem)

admin.site.register(Cart)
admin.site.register(CartItem)