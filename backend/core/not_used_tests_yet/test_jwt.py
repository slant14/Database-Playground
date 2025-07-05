# tests/test_jwt_auth.py
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from account.models import User

class JWTAuthTest(APITestCase):
    def setUp(self):
        # Init testuser
        self.email = "testuser@example.com"
        self.password = "ExAmPlE#password1@3$5"
        self.user = User.objects.create_user(email=self.email, password=self.password)
        
        # Get token URLs
        self.token_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')
        self.verify_url = reverse('token_verify')

    def test_obtain_jwt_token_success(self):
        response = self.client.post(
            self.token_url,
            {'email': self.email, 'password': self.password},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_obtain_jwt_token_fail_wrong_password(self):
        #Wrong password 401 Unauthorized
        response = self.client.post(
            self.token_url,
            {'email': self.email, 'password': 'wrongpass'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_jwt_token_success(self):
        # Get new access-token from refresh-token
        resp1 = self.client.post(
            self.token_url,
            {'email': self.email, 'password': self.password},
            format='json'
        )
        refresh_token = resp1.data.get('refresh')

        resp2 = self.client.post(
            self.refresh_url,
            {'refresh': refresh_token},
            format='json'
        )
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp2.data)

    def test_verify_jwt_token_success(self):
        #Check valid password
        resp1 = self.client.post(
            self.token_url,
            {'email': self.email, 'password': self.password},
            format='json'
        )
        access_token = resp1.data.get('access')
       
        resp2 = self.client.post(
            self.verify_url,
            {'token': access_token},
            format='json'
        )
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)

