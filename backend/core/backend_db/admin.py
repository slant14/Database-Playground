from django.contrib import admin
from .models import Classroom, Enrollment, Course, Assignment, Submission
from django.conf import settings
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile, Topic, Classroom

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ("email", "is_staff", "is_active",)
    list_filter = ("email", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)

admin.site.register(User)
admin.site.register(Profile)

#admin.site.register(Classroom)
admin.site.register(Topic)

@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'primary_instructor', 'capacity', 'created_date')
    search_fields = ('title',)

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "TA":
            kwargs["queryset"] = Profile.objects.filter(user__role='ta')
        return super().formfield_for_manytomany(db_field, request, **kwargs)

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'classroom', 'grade', 'enrollment_date')
    list_filter = ('classroom',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title',)

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'course', 'created_at')
    list_filter = ('course',)
    search_fields = ('name',)

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'assignment', 'created_at')
    list_filter = ('assignment',)