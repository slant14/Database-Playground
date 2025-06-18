from django.urls import path
from .views import SessionView

urlpatterns = [
    path('session/', SessionView.as_view(), name='session')
]