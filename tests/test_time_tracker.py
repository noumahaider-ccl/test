# This file contains unit tests for the time-tracking application.
# It ensures that the `clock_in`, `clock_out`, and other core functionalities work as expected.
# Each test case sets up a fresh environment, runs the functions, and checks that the results are correct.

import unittest
import time
import os
from app.time_tracker import clock_in, clock_out, load_time_logs


class TestTimeTracker(unittest.TestCase):
    """
    This class contains unit tests for the time tracking application. Each test checks the expected functionality
    of the clock-in, clock-out, and time log viewing processes.
    """

    def setUp(self):
        """Setup before each test to create a clean environment"""
        self.user_id = "user123"  # Sample user ID for testing
        # Remove any existing time log file before each test
        if os.path.exists("time_logs.json"):
            os.remove("time_logs.json")

    def test_clock_in(self):
        """Test clocking in functionality"""
        clock_in(self.user_id)
        time_logs = load_time_logs()  # Load the updated time logs
        self.assertIn(self.user_id, time_logs, "User ID should be present in time logs after clock in.")
        self.assertIsNotNone(
            time_logs[self.user_id]["clock_in_time"],
            "Clock-in time should be recorded and not None."
        )

    def test_clock_out(self):
        """
        Test clocking out functionality.

        A short delay is added to ensure total_time is greater than 0.
        """
        clock_in(self.user_id)  # First, clock in the user
        time.sleep(1)           # Wait 1 second to ensure a nonzero total_time
        clock_out(self.user_id)

        time_logs = load_time_logs()  # Load the updated time logs
        self.assertIsNotNone(
            time_logs[self.user_id]["clock_out_time"],
            "Clock-out time should be recorded and not None."
        )
        self.assertGreater(
            time_logs[self.user_id]["total_time"],
            0,
            "Total time worked should be greater than zero after 1-second delay."
        )

    def test_view_time_log(self):
        """Test viewing the time log"""
        clock_in(self.user_id)   # Clock in the user
        clock_out(self.user_id)  # Clock out the user

        time_logs = load_time_logs()  # Load the time logs
        self.assertIn(
            self.user_id,
            time_logs,
            "User ID should be in time logs after clock in/out."
        )

