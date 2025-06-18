from django.urls import path
from .views import SessionView

urlpatterns = [
    path('', SessionView.as_view(), name='session')
]