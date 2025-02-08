import unittest
from app.time_tracker import app
import os
import json

class TestTimeTracker(unittest.TestCase):
    def setUp(self):
        """Set up test client and application context"""
        app.config['TESTING'] = True
        self.client = app.test_client()
        self.ctx = app.app_context()
        self.ctx.push()
        self.user_id = "user123"
        
        # Ensure clean state for time logs
        if os.path.exists("time_logs.json"):
            os.remove("time_logs.json")
        with open("time_logs.json", "w") as f:
            json.dump({}, f)

    def tearDown(self):
        """Clean up after tests"""
        self.ctx.pop()
        if os.path.exists("time_logs.json"):
            os.remove("time_logs.json")

    def test_clock_in(self):
        """Test clocking in functionality"""
        response = self.client.post(f'/clock_in/{self.user_id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("clocked in", data['message'])

    def test_clock_out(self):
        """Test clocking out functionality"""
        # First clock in
        self.client.post(f'/clock_in/{self.user_id}')
        # Then clock out
        response = self.client.post(f'/clock_out/{self.user_id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("clocked out", data['message'])

    def test_view_time_log(self):
        """Test viewing time log functionality"""
        # Should return 404 for non-existent user
        response = self.client.get(f'/view_time_log/{self.user_id}')
        self.assertEqual(response.status_code, 404)

        # Clock in and out
        self.client.post(f'/clock_in/{self.user_id}')
        self.client.post(f'/clock_out/{self.user_id}')
        
        # Then view log
        response = self.client.get(f'/view_time_log/{self.user_id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['user_id'], self.user_id)

if __name__ == '__main__':
    unittest.main()
