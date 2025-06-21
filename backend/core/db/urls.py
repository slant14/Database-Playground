from django.urls import path

from .views import (
    PutView,
    SchemaView,
    QueryView
)


urlpatterns = [
    path('', PutView.as_view()),
    path('schema/', SchemaView.as_view()),
    path('query/', QueryView.as_view()),
]
