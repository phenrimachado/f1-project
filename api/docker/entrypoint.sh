#!/bin/sh
set -e

# O volume (./api:/var/www/html) monta os arquivos do host por cima da imagem,
# entao as permissoes definidas no Dockerfile (chown www-data) nao sobrevivem.
# Este script reaplica a permissao necessaria toda vez que o container sobe,
# antes de iniciar o processo principal (php-fpm, queue:work, schedule:run...).
mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions storage/logs bootstrap/cache
chmod -R 777 storage bootstrap/cache 2>/dev/null || true

exec "$@"