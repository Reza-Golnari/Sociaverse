from django.contrib import admin
from .models import Poste, Relation, Comment, Vote, Directs


@admin.register(Poste)
class PosteAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Poste model.
    """

    prepopulated_fields = {"slug": ("title",)}


admin.site.register(Relation)
admin.site.register(Vote)
admin.site.register(Comment)
admin.site.register(Directs)
