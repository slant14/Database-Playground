from django.urls import reverse
from rest_framework.test import APITestCase

class QueryViewTest(APITestCase):
    def test_simple_select_query(self):
        url = reverse('db-query')
        payload = {
            "action": "query",  # любой не 'state', чтобы вызывался chroma_query
            "code": "SELECT 1 AS number;",
            "user_id": "testuser"
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("command", response.data)
        self.assertIn("result", response.data)

    def test_missing_code_returns_400(self):
        url = reverse('db-query')
        payload = {
            "action": "query",
            "user_id": "testuser"
            # нет 'code'
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data.get("error"), "Missing query")

    def test_action_state_calls_chroma_state(self):
        url = reverse('db-query')
        payload = {
            "action": "state",
            "user_id": "testuser"
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, 200)
        # Можно добавить конкретные проверки по ответу chroma_state, если знаешь что там возвращается

    def test_invalid_json_returns_400(self):
        url = reverse('db-query')
        # Отправляем невалидный JSON (например, пустую строку)
        response = self.client.post(url, data="", content_type="application/json")
        self.assertEqual(response.status_code, 400)

