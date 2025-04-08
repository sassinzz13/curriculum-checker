from django.test import TestCase
from django.test import SimpleTestCase
from django.urls import resolve, reverse
# Create your tests here.
class HomePageTests(TestCase):
    def setUp(self):
        url = reverse("student_data")
        self.response = self.client.get(url)
    
    def test_url_exist_at_correct_location(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        
    def test_homepage_template(self):
        response = self.client.get("/")
        self.assertTemplateUsed(response, "student_data.html")
    
    