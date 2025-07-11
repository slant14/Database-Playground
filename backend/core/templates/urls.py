from django.urls import path

from .views import TemplateListCreateView, TemplateRetreiveView

urlpatterns = [
    path('<int:pk>/', TemplateRetreiveView.as_view()),
    path('', TemplateListCreateView.as_view()),
]
