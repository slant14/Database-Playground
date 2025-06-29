from django.urls import path

from .views import SessionInfoView, SessionView

urlpatterns = [
    path("", SessionView.as_view(), name="session"),
    path("info/", SessionInfoView.as_view(), name="session"),
]
