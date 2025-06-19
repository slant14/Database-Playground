from django.urls import path

from .views import SessionView, SessionInfoView

urlpatterns = [
    path('', SessionView.as_view(), name='session'),
    path('info/', SessionInfoView.as_view(), name='session')
]