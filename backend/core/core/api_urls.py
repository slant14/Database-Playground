from rest_framework import routers
from backend_db.views import UserViewSet, ClassroomViewSet, EnrollmentViewSet, CourseViewSet, AssignmentViewSet, SubmissionViewSet, ProfileViewSet
from schema.views import DBSchemaModelViewSet

router = routers.DefaultRouter()
router.register(r'profile', ProfileViewSet)
router.register(r'users', UserViewSet)
router.register(r'classrooms', ClassroomViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'submissions', SubmissionViewSet)
router.register(r'schema', DBSchemaModelViewSet)

urlpatterns = router.urls