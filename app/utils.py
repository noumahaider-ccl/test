# This file contains utility functions for loading and saving time logs from and to the `time_logs.json` file.
# These functions help in managing the application’s persistent data.

import json
import os

TIME_LOGS_FILE = "time_logs.json"  # File path for storing time logs


def load_time_logs():
    """
    Load the time logs from a JSON file.

    Returns:
        dict: A dictionary of time logs, where each key is a user ID and the value is their time log data.

    Description:
        If the `time_logs.json` file exists, this function loads and returns the data from the file.
        If the file does not exist, it returns an empty dictionary.
    """
    if os.path.exists(TIME_LOGS_FILE):  # Check if the time logs file exists
        with open(TIME_LOGS_FILE, "r") as file:
            return json.load(file)  # Load and return the content of the JSON file
    return {}


def save_time_logs(time_logs):
    """
    Save the time logs to a JSON file.

    Args:
        time_logs (dict): A dictionary of time logs to save to the file.

    Description:
        This function takes a dictionary of time logs and writes it to the `time_logs.json` file.
    """
    with open(TIME_LOGS_FILE, "w") as file:
        json.dump(time_logs, file, indent=4)  # Write the dictionary to a JSON file with indentation for readability
