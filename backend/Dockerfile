# Use official PHP image with Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libpng-dev libjpeg-dev libfreetype6-dev libssl-dev pkg-config libcurl4-openssl-dev \
    && docker-php-ext-install pdo pdo_mysql bcmath sockets \
    # Install and enable MongoDB extension
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy all project files to Apache web root
COPY . /var/www/html/

# Install PHP dependencies (ignore platform req to avoid ext-mongodb confusion)
RUN composer install --no-dev --prefer-dist --optimize-autoloader --ignore-platform-req=ext-mongodb || true

# Enable Apache mod_rewrite (for clean URLs, APIs, etc.)
RUN a2enmod rewrite

# Expose port 80 for Render
EXPOSE 80

# Start Apache in foreground (Render needs this)
CMD ["apache2-foreground"]
