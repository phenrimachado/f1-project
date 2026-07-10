# Setup local

Guia pra rodar o projeto na sua máquina. Todo o stack roda em container —
não precisa instalar PHP, Composer, Node ou npm no host.

## Pré-requisitos

- Docker e Docker Compose

## Passo a passo

1. Copie os arquivos de ambiente:
   ```bash
   cp .env.example .env
   cp api/.env.example api/.env
   cp web/.env.example web/.env.local
   ```

2. Suba os containers:
   ```bash
   docker compose up -d --build
   ```

3. Gere a chave da aplicação Laravel e rode as migrations:
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
- Armadilhas conhecidas do ambiente (permissões, cache de config, DNS do
  nginx etc.) estão documentadas no [CLAUDE.md](../CLAUDE.md).
