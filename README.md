# Time Tracker Application

This is a simple time-tracking application built using Python. The app allows users to clock in and clock out, 
and tracks the total time worked. The project is containerized using Docker and comes with automated CI/CD pipelines using GitHub Actions.

## Features

- Clock in and clock out functionality
- Time log viewing
- Docker container support
- GitHub Actions CI/CD pipeline

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/time_tracker_project.git
    cd time_tracker_project
    ```

2. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Build the Docker container:
    ```bash
    docker build -t time-tracker-app .
    ```

4. Run the Docker container:
    ```bash
    docker run -d -p 5000:5000 time-tracker-app
    ```

5. Access the app:
    The application will be accessible at `http://localhost:5000` if Flask is used for expansion.

# CCL_Timetracker
Staff Time Tracker with a cool agent

