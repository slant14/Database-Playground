from django.urls import path
from . import views

urlpatterns = [
    path('chroma/', views.ChromaQueryParser.as_view(), name='chroma-query-parser'),
    path('schema/', views.SchemaView.as_view(), name='db-schema'),
    path('query/', views.QueryView.as_view(), name='db-query'),
    path('put/', views.PutView.as_view(), name='db-put'),
]
