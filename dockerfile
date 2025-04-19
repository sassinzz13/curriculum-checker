# Pull base image
FROM python:3.10.4-slim-bullseye

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="$PATH:/opt/mssql-tools18/bin"

# Set work directory
WORKDIR /code

# Install dependencies for pyodbc and MS SQL Server ODBC driver
RUN apt-get update && \
    apt-get install -y curl gnupg2 unixodbc unixodbc-dev libgssapi-krb5-2 && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 && \
    ACCEPT_EULA=Y apt-get install -y mssql-tools18 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify and display ODBC driver installation
RUN odbcinst -j && \
    cat /etc/odbcinst.ini && \
    ls -l /opt/microsoft/msodbcsql18/lib64/

# Copy the requirements file and install dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn==20.1.0
 # Use no-cache-dir to avoid caching unnecessary files

# Copy the rest of the project files into the container
COPY . .

# Expose the port on which the Django app will run
EXPOSE 8000

# Command to run the application (runs Django's development server)
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Command for production (you can uncomment this if using gunicorn in production)
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]