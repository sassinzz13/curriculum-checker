# Pull base image
FROM python:3.10.4-slim-bullseye

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ACCEPT_EULA=Y \
    PATH="$PATH:/opt/mssql-tools/bin"

# Set work directory
WORKDIR /code

# Install dependencies for pyodbc and MS SQL Server ODBC Driver 17
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        gnupg2 \
        unixodbc \
        unixodbc-dev \
        libgssapi-krb5-2 \
        apt-transport-https \
        ca-certificates \
        software-properties-common && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    echo "deb [arch=amd64] https://packages.microsoft.com/debian/11/prod bullseye main" > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 mssql-tools && \
    apt-get install -y libssl1.1 || true && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Diagnostic step (optional, can be removed later)
RUN odbcinst -q -d && ls /opt/microsoft/msodbcsql17/lib64/

# Copy requirements and install dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Run Django dev server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# For production, switch to gunicorn:
# CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
