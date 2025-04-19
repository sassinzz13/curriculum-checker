# Use full Debian Bullseye image instead of slim
FROM python:3.10-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ACCEPT_EULA=Y \
    DEBIAN_FRONTEND=noninteractive \
    PATH="$PATH:/opt/mssql-tools18/bin"

# Set work directory
WORKDIR /code

# Install required system packages and ODBC drivers
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    gnupg2 \
    apt-transport-https \
    ca-certificates \
    gcc \
    g++ \
    make \
    build-essential \
    libssl-dev \
    libgssapi-krb5-2 \
    unixodbc \
    unixodbc-dev \
    software-properties-common && \
    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/microsoft.gpg && \
    curl https://packages.microsoft.com/config/debian/11/prod.list -o /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    apt-get install -y msodbcsql18 mssql-tools18 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify ODBC driver installation
RUN echo "==== ODBCINST INFO ====" && \
    odbcinst -j && \
    echo "==== odbcinst.ini ====" && \
    cat /etc/odbcinst.ini || true && \
    python -c "import pyodbc; print('Available ODBC Drivers:', pyodbc.drivers())"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn==20.1.0

# Copy app code
COPY . .

# Expose port
EXPOSE 8000

# Start app with Gunicorn
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]