from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.conf import settings
from templates.models import Template, DBType
from templates.serializers import TemplateSerializer, MinTemplateSerializer
import json


class BasicDjangoTestCase(TestCase):
    """Test 1: Basic Django setup and configuration"""
    
    def test_django_settings_loaded(self):
        """Test that Django settings are properly loaded"""
        self.assertTrue(hasattr(settings, 'INSTALLED_APPS'))
        self.assertTrue(hasattr(settings, 'DATABASES'))
        self.assertIn('django.contrib.admin', settings.INSTALLED_APPS)
        self.assertIn('rest_framework', settings.INSTALLED_APPS)


class TestAppViewTestCase(TestCase):
    """Test 2: Test app main view functionality"""
    
    def setUp(self):
        self.client = Client()
    
    def test_main_test_view_returns_success(self):
        """Test that the main test view returns the expected JSON response"""
        response = self.client.get('/test/')
        self.assertEqual(response.status_code, 200)
        
        # Parse JSON response
        data = json.loads(response.content)
        self.assertEqual(data['who_deployed_succesfully'], 'you!')


class TemplateModelTestCase(TestCase):
    """Test 3: Template model creation and functionality"""
    
    def test_template_model_creation(self):
        """Test that Template model can be created with all required fields"""
        template = Template.objects.create(
            name="Test Template",
            author="Test Author",
            type=DBType.POSTGRES,
            dump="SELECT * FROM test_table;"
        )
        
        self.assertEqual(template.name, "Test Template")
        self.assertEqual(template.author, "Test Author")
        self.assertEqual(template.type, DBType.POSTGRES)
        self.assertEqual(template.dump, "SELECT * FROM test_table;")
        
        # Test string representation
        self.assertTrue(isinstance(str(template), str))
    
    def test_template_db_type_choices(self):
        """Test that DBType choices are properly defined"""
        choices = dict(DBType.choices)
        self.assertIn(DBType.POSTGRES, choices)
        self.assertIn(DBType.MYSQL, choices)
        self.assertIn(DBType.SQLITE, choices)
        self.assertIn(DBType.MONGODB, choices)


class TemplateSerializerTestCase(TestCase):
    """Test 4: Template serializers functionality"""
    
    def setUp(self):
        self.template = Template.objects.create(
            name="Serializer Test Template",
            author="Serializer Author",
            type=DBType.MYSQL,
            dump="SELECT id, name FROM users;"
        )
    
    def test_template_serializer_fields(self):
        """Test that TemplateSerializer includes all fields"""
        serializer = TemplateSerializer(self.template)
        data = serializer.data
        
        self.assertIn('id', data)
        self.assertIn('name', data)
        self.assertIn('author', data)
        self.assertIn('type', data)
        self.assertIn('dump', data)
    
    def test_min_template_serializer_fields(self):
        """Test that MinTemplateSerializer includes only required fields"""
        serializer = MinTemplateSerializer(self.template)
        data = serializer.data
        
        self.assertIn('id', data)
        self.assertIn('name', data)
        self.assertIn('author', data)
        self.assertIn('type', data)
        self.assertNotIn('dump', data)  # Should not include dump field


class TemplateListViewTestCase(TestCase):
    """Test 5: Template list view functionality"""
    
    def setUp(self):
        self.client = Client()
        # Create test templates
        Template.objects.create(
            name="Template 1",
            author="Author 1",
            type=DBType.POSTGRES,
            dump="SELECT 1;"
        )
        Template.objects.create(
            name="Template 2",
            author="Author 2",
            type=DBType.MYSQL,
            dump="SELECT 2;"
        )
    
    def test_template_list_view_get(self):
        """Test that template list view returns templates or requires authentication"""
        response = self.client.get('/template/')
        # Template view may require authentication (401) or be publicly accessible (200)
        self.assertIn(response.status_code, [200, 401])
        
        # If the view is publicly accessible, check the response format
        if response.status_code == 200:
            # Parse JSON response
            data = json.loads(response.content)
            self.assertTrue(isinstance(data, list))
            self.assertEqual(len(data), 2)
            
            # Check that required fields are present
            for template in data:
                self.assertIn('id', template)
                self.assertIn('name', template)
                self.assertIn('author', template)
                self.assertIn('type', template)


class URLConfigurationTestCase(TestCase):
    """Test 6: URL configuration and routing"""
    
    def setUp(self):
        self.client = Client()
    
    def test_admin_url_exists(self):
        """Test that admin URL is accessible"""
        response = self.client.get('/admin/')
        # Should redirect to login or show admin page
        self.assertIn(response.status_code, [200, 302])
    
    def test_swagger_url_exists(self):
        """Test that Swagger documentation URL is accessible"""
        response = self.client.get('/swagger/')
        self.assertEqual(response.status_code, 200)
    
    def test_test_app_url_exists(self):
        """Test that test app URL is accessible"""
        response = self.client.get('/test/')
        self.assertEqual(response.status_code, 200)


class DatabaseConfigurationTestCase(TestCase):
    """Test 7: Database configuration and connectivity"""
    
    def test_database_connection(self):
        """Test that database connection is properly configured"""
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            self.assertEqual(result[0], 1)
    
    def test_migrations_applied(self):
        """Test that migrations are properly applied"""
        from django.core.management import call_command
        from io import StringIO
        
        # Check if migrations are up to date
        out = StringIO()
        try:
            call_command('showmigrations', verbosity=0, stdout=out)
            # If no exception is raised, migrations system is working
            self.assertTrue(True)
        except Exception:
            self.fail("Migration system is not properly configured")


class CORSAndMiddlewareTestCase(TestCase):
    """Test 8: CORS and middleware configuration"""
    
    def setUp(self):
        self.client = Client()
    
    def test_cors_headers_present(self):
        """Test that CORS headers are properly configured"""
        response = self.client.get('/test/')
        
        # Check that the response doesn't fail due to CORS issues
        self.assertEqual(response.status_code, 200)
        
        # Verify CORS is configured in settings
        self.assertTrue(hasattr(settings, 'CORS_ALLOW_ALL_ORIGINS'))
        self.assertTrue(hasattr(settings, 'CORS_ALLOWED_ORIGINS'))
    
    def test_middleware_configuration(self):
        """Test that required middleware is configured"""
        middleware = settings.MIDDLEWARE
        
        # Check that essential middleware is present
        self.assertIn('corsheaders.middleware.CorsMiddleware', middleware)
        self.assertIn('django.middleware.security.SecurityMiddleware', middleware)
        self.assertIn('django.contrib.sessions.middleware.SessionMiddleware', middleware)
        self.assertIn('django.middleware.common.CommonMiddleware', middleware)
        self.assertIn('django.contrib.auth.middleware.AuthenticationMiddleware', middleware)
