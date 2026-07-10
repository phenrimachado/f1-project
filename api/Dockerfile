FROM php:8.4-fpm-alpine

# Dependencias de sistema necessarias para compilar as extensoes PHP abaixo
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    oniguruma-dev \
    icu-dev \
    autoconf \
    g++ \
    make

# Extensoes PHP usadas pelo Laravel + Postgres
RUN docker-php-ext-install pdo pdo_pgsql zip bcmath intl opcache

# Extensao Redis via PECL (usada por cache/queue/session drivers do Laravel)
RUN pecl install redis && docker-php-ext-enable redis

# Composer (copiado da imagem oficial, sem precisar instalar via curl)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Em dev o codigo real vem via volume (docker-compose.yml), isso aqui so garante
# que a imagem builda mesmo antes do "composer create-project" ser rodado.
COPY . .

RUN if [ -f composer.json ]; then \
      composer install --no-interaction --prefer-dist --optimize-autoloader; \
    fi

RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
