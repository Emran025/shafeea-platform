# ---- Base PHP Stage ----
# Use the official PHP 8.2 FPM image as a base.
FROM php:8.2-fpm as base

# Set working directory
WORKDIR /var/www/html

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies required by Laravel and common PHP extensions.
# - libpng-dev, libjpeg-dev, libfreetype6-dev for GD extension.
# - libzip-dev for zip extension.
# - libpq-dev for PostgreSQL (pdo_pgsql) extension.
# - libicu-dev for intl extension.
# - nodejs and npm for the build stage.
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libpq-dev \
    libicu-dev \
    nodejs \
    npm \
    nginx

# Install PHP extensions.
RUN docker-php-ext-install \
    pdo_pgsql \
    bcmath \
    gd \
    intl \
    zip \
    opcache

# Clear apt cache to reduce image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer globally.
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer


# ---- Composer Vendor Stage ----
# This stage installs composer dependencies and is cached as long as composer files don't change.
FROM base as composer_vendor

COPY database/ database/
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-plugins --no-scripts --no-dev --prefer-dist


# ---- Node Modules Stage ----
# This stage installs node dependencies and is cached as long as package files don't change.
FROM node:18 as node_modules

WORKDIR /var/www/html
COPY package.json package-lock.json ./
RUN npm install


# ---- Build Stage ----
# This stage builds the frontend assets.
FROM base as build

WORKDIR /var/www/html

# Copy composer dependencies from the dedicated stage
COPY --from=composer_vendor /var/www/html/vendor/ vendor/

# Copy node dependencies from the dedicated stage
COPY --from=node_modules /var/www/html/node_modules/ node_modules/

# Copy the entire application source code
COPY . .

# Build the frontend assets
RUN npm run build

# Remove node modules after build to reduce image size
RUN rm -rf node_modules


# ---- Production Stage ----
# This is the final, optimized image that will be deployed.
FROM base as production

WORKDIR /var/www/html

# Copy the built application files from the build stage
COPY --from=build /var/www/html/ .

# Set correct permissions for storage and bootstrap cache directories
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Copy Nginx and entrypoint configurations
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
