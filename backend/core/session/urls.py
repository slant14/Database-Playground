from django.urls import path

from .views import SessionInfoView, SessionView, SessionValidView

urlpatterns = [
    path("", SessionView.as_view(), name="session"),
    path("info/", SessionInfoView.as_view(), name="session_info"),
    path("valid/", SessionValidView.as_view(), name="session_valid"),
]
