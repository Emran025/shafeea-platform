#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Run Laravel optimizations
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage symlink
echo "Creating storage symlink..."
php artisan storage:link --force

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force
php artisan db:seed --force

# Start PHP-FPM in the background
php-fpm &

# Start Nginx in the foreground
nginx -g "daemon off;"
