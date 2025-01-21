# Use the Python 3.8 slim image to build the container
FROM python:3.8-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container's working directory
COPY . /app

# Install dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables for Flask
ENV FLASK_APP=app.time_tracker
ENV FLASK_ENV=development

# Expose port 5000 to allow communication with the container
EXPOSE 5000

# The command to run the application when the container starts
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
