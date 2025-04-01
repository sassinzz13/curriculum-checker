# Pull base image
FROM python:3.10.4-slim-bullseye
# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
#set work directory
WORKDIR /code
#Install necessary dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*
#install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt
#copy project
COPY . .
#command to run server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]