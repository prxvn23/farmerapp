FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libpng-dev libjpeg-dev libfreetype6-dev libssl-dev pkg-config libcurl4-openssl-dev \
    && docker-php-ext-install pdo pdo_mysql \
    # Install and enable MongoDB extension
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy project files
COPY . .

# Install PHP dependencies (ignore platform req to avoid ext-mongodb confusion)
RUN composer install --no-dev --prefer-dist --optimize-autoloader --ignore-platform-req=ext-mongodb

CMD [ "php", "-S", "0.0.0.0:8000", "-t", "public" ]
