from django.contrib import admin
from .models import Classroom, Enrollment, Assignment, Submission, Article
from django.conf import settings
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ("email",
         "is_staff", "is_active",)
    list_filter = ("email",
         "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email",
             "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                  "password1", "password2", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("email",
        )
    ordering = ("email",
        )

admin.site.register(User)
admin.site.register(Profile)

#admin.site.register(Classroom)
#admin.site.register(Topic)

@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'primary_instructor', 'capacity', 'created_date')
    search_fields = ('title',)

    def save_model(self, request, obj, form, change):
        is_new = obj.pk is None
        super().save_model(request, obj, form, change)

        if is_new:
            # Создаём Enrollment для primary_instructor
            Enrollment.objects.get_or_create(
                student=obj.primary_instructor,
                classroom=obj
            )

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        # Создаём Enrollment для всех TA
        for ta in form.instance.TA.all():
            Enrollment.objects.get_or_create(
                student=ta,
                classroom=form.instance
            )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "primary_instructor":
            kwargs["queryset"] = Profile.objects.select_related('user').all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "TA":
            kwargs["queryset"] = Profile.objects.select_related('user').all()
        return super().formfield_for_manytomany(db_field, request, **kwargs)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'classroom', 'grade', 'enrollment_date')
    list_filter = ('classroom',)

#@admin.register(Course)
#class CourseAdmin(admin.ModelAdmin):
#    list_display = ('title', 'created_at')
#    search_fields = ('title',)

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'classroom', 'created_at')
    list_filter = ('classroom',)
    search_fields = ('title',)

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'assignment', 'created_at')
    list_filter = ('assignment',)

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_authors', 'description', 'file')
    list_filter = ('title',)

    def get_authors(self, obj):
        return ", ".join([profile.user.name for profile in obj.authors.all()])
    get_authors.short_description = 'Authors'