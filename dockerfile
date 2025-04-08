# Pull base image
FROM python:3.10.4-slim-bullseye

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /code

# Install dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt  # Use no-cache-dir to avoid caching unnecessary files

# Copy the rest of the project files into the container
COPY . .

# Expose the port on which the Django app will run
EXPOSE 8000

# Command to run the application (runs Django's development server)
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
# Command for production
 CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]