# ---- Base PHP Stage ----
FROM php:8.2-fpm-bookworm AS base

WORKDIR /var/www/html
ENV DEBIAN_FRONTEND=noninteractive

# Add the PHP extension installer script
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

# Install system dependencies and PHP extensions using the script
# This script automatically handles dependencies for extensions like gd, zip, intl, etc.
RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions \
    pdo_pgsql \
    bcmath \
    gd \
    intl \
    zip \
    opcache \
    @composer

# Install Nginx and minimal system tools needed for runtime
RUN apt-get update && apt-get install -y \
    nginx \
    git \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ---- Composer Dependencies Stage ----
FROM base AS composer_deps

COPY database/ database/
COPY composer.json composer.lock ./

# Install Composer packages
RUN composer install --no-interaction --no-plugins --no-scripts --no-dev --prefer-dist

# ---- Frontend Build Stage (Node.js) ----
# Build assets in a separate Node image to keep the final image small
FROM node:18 AS node_build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Run the build process
RUN npm run build

# ---- Production Stage ----
FROM base AS production

WORKDIR /var/www/html

# Copy app files
COPY . .

# Copy vendor files from composer_deps stage
COPY --from=composer_deps /var/www/html/vendor/ vendor/

# Copy compiled frontend assets (public/build) from node_build stage
COPY --from=node_build /app/public/build public/build

# Setup permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Setup Nginx and Entrypoint
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
