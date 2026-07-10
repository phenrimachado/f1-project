# F1 Insights — ambiente local

Monorepo: `api` (Laravel) + `web` (Next.js), orquestrados via Docker Compose,
com Postgres e Redis.

## Primeira execução (as pastas `api/` e `web/` ainda estão vazias)

1. Copie os arquivos de ambiente:
   ```bash
   cp .env.example .env
   cp api/.env.example api/.env
   cp web/.env.example web/.env.local
   ```

2. Crie o esqueleto do Laravel dentro de `api/` (usando um container
   temporário do Composer, sem precisar ter PHP instalado na sua máquina):
   ```bash
   docker run --rm -v "$(pwd)/api":/app -w /app composer:2 \
     create-project laravel/laravel .
   ```

3. Crie o esqueleto do Next.js dentro de `web/`:
   ```bash
   docker run --rm -v "$(pwd)/web":/app -w /app node:20-alpine \
     npx create-next-app@latest . --typescript --app --tailwind --eslint
   ```

4. Suba tudo:
   ```bash
   docker compose up -d --build
   ```

5. Gere a chave da aplicação Laravel e rode as migrations:
   ```bash
   docker compose exec api php artisan key:generate
   docker compose exec api php artisan migrate
   ```

## Endereços

| Serviço | URL |
|---|---|
| Front (Next.js) | http://localhost:3000 |
| API (via nginx) | http://localhost:8000/api |
| Postgres | localhost:5432 |
| Redis | localhost:6379 |

## Serviços do docker-compose.yml

- **postgres** — banco de dados principal.
- **redis** — cache, sessão e fila do Laravel.
- **api** — PHP-FPM rodando o Laravel (não expõe porta HTTP diretamente).
- **nginx** — serve HTTP na porta 8000 e repassa requisições `.php` para o `api`.
- **queue-worker** — roda `php artisan queue:work` (sincronização com a OpenF1).
- **scheduler** — roda `php artisan schedule:run` a cada 60s.
- **web** — Next.js em modo dev na porta 3000.

## Comandos do dia a dia

```bash
docker compose up -d              # sobe tudo em background
docker compose logs -f api        # acompanha logs da API
docker compose exec api bash      # entra no container da API
docker compose exec api php artisan migrate
docker compose exec api composer require <pacote>
docker compose down               # derruba tudo (mantém os volumes/dados)
```

## Notas

- Os hosts `postgres`, `redis`, `api`, `nginx`, `web` só existem *dentro* da
  rede Docker (`f1_network`). Do host (sua máquina), use sempre `localhost`.
- `api/.env` e `web/.env.local` nunca devem ser commitados — apenas os
  `.env.example`.
- Uso comercial: os dados vêm da API pública OpenF1, licenciada como
  CC BY-NC-SA 4.0 (uso não comercial). Antes de monetizar o projeto, será
  necessário falar com a OpenF1 sobre uma licença adequada.
