# CLAUDE.md — F1 Insights

Contexto e regras de comportamento para o Claude Code neste projeto.
Leia isto antes de propor ou aplicar qualquer mudança.

## Sobre o projeto

Monorepo de estudo com objetivo duplo: (1) aprender Laravel a fundo como
camada de API, mantendo React/Next já conhecido no front, e (2) praticar
uso eficiente do Claude Code (economia de tokens, spec-driven development).

Ideia de produto: site para fãs de Fórmula 1, consumindo dados da API
pública OpenF1 (https://api.openf1.org/v1) e apresentando de forma própria
(gráficos, comparações, etc). Começa pequeno (poucas entidades) e deve
escalar bem conforme cresce.

⚠️ **Licenciamento**: os dados da OpenF1 são CC BY-NC-SA 4.0 (uso não
comercial). Este projeto é de estudo/uso pessoal. Nenhuma feature de
monetização (ads, paywall, assinatura) deve ser implementada sem antes
consultar a OpenF1 sobre uma licença adequada. Se alguma tarefa mencionar
monetização, sinalize isso antes de implementar.

## Stack

- **Front**: Next.js (App Router, TypeScript, Tailwind) em `web/`
- **API**: Laravel 13 (PHP 8.4) em `api/`
- **Banco**: PostgreSQL 16
- **Cache/Fila**: Redis 7
- **Infra**: Docker Compose (todos os serviços rodam em container, nunca
  direto no host)

## Estrutura do monorepo

```
f1-project/
├── docker-compose.yml
├── openspec/            # specs e mudancas (ver secao OpenSpec abaixo)
├── api/                 # Laravel
│   ├── Dockerfile
│   ├── docker/{nginx.conf,entrypoint.sh}
│   └── .env (nao commitado)
└── web/                 # Next.js
    ├── Dockerfile
    └── .env.local (nao commitado)
```

## Comandos — SEMPRE via Docker, nunca no host

O PHP, Composer, Node e npm não estão instalados no host — tudo roda
dentro dos containers. Use sempre:

```bash
docker compose exec api php artisan <comando>
docker compose exec api composer <comando>
docker compose exec web npm <comando>
docker compose logs -f <servico>
docker compose ps
```

Para reconstruir após mudar Dockerfile ou dependências:
```bash
docker compose up -d --build
```

## Armadilhas já conhecidas neste ambiente (não repetir a investigação)

1. **Composer install falha com exit code 2 / requisitos de PHP**: a
   versão do PHP no `api/Dockerfile` precisa bater com a exigida pelo
   `composer.lock` (hoje: PHP 8.4, Laravel 13 + Symfony 8). Se atualizar
   o Laravel e ele exigir PHP mais novo, atualizar o `FROM php:X.Y-fpm-alpine`
   também.
2. **Permissão em `storage/`/`bootstrap/cache`**: como o volume monta os
   arquivos do host por cima da imagem, o `chown` do Dockerfile não
   sobrevive. Isso é resolvido automaticamente pelo `api/docker/entrypoint.sh`
   (chmod 777 a cada start do container). Não remover esse entrypoint.
3. **`env_file` no docker-compose "congela" variáveis**: os serviços
   `api`, `queue-worker` e `scheduler` NÃO usam `env_file` — o Laravel já
   lê o `.env` sozinho via volume. Adicionar `env_file` de volta reintroduz
   o bug de `APP_KEY` (ou qualquer variável) ficar desatualizada até um
   `--force-recreate`.
4. **502 Bad Gateway após recriar o container `api`**: o `nginx` cacheia
   a resolução DNS do serviço `api`. Depois de recriar `api` isoladamente,
   rodar `docker compose restart nginx`. Um `docker compose down && up`
   completo não tem esse problema (recria a rede inteira).
5. **`queue-worker`/`scheduler` não recarregam `.env`/config sozinhos**:
   são processos PHP long-running (`php artisan queue:work`). Se uma
   config nova for adicionada (ex: `config/services.php`, nova env var),
   precisa `docker compose restart queue-worker scheduler` — senão os
   jobs falham com valor `null`/stale até o restart.
6. **Cache de objeto Eloquent quebra no HIT (Laravel 13)**: `config/cache.php`
   tem `serializable_classes => false` por padrão (protecao contra PHP
   object injection). Cachear uma `Collection`/`Model` diretamente faz o
   `unserialize()` no HIT devolver `__PHP_Incomplete_Class` em vez do
   objeto real (o MISS funciona pq nao passa por unserialize). Regra:
   `Cache::remember` deve guardar array já resolvido (ex:
   `Resource::collection(...)->resolve()`), nunca objeto Eloquent/Carbon
   cru — e os Resources devem converter datas pra string
   (`->toIso8601String()`) antes de entrar no array cacheado. Isso vale
   tambem pra Resource aninhado dentro de outro Resource: nunca colocar
   `new OutroResource($this->relacao)` direto no `toArray()` — isso deixa
   um objeto Resource vivo dentro do array cacheado. Usar
   `$this->whenLoaded('relacao', fn () => (new OutroResource($this->relacao))->resolve())`.
7. **Arquivos criados por `php artisan make:*` ficam `root:root`**: o
   volume é montado por cima da imagem e o container roda como root, mas
   os arquivos criados via `docker compose exec api php artisan make:...`
   herdam o dono do processo (root), quebrando edição pelo host. Rodar
   `docker compose exec api chown 1000:1000 <arquivo(s)>` logo após gerar.

## Convenções de código

- **Laravel**: seguir convenções padrão do framework (Eloquent Resources
  para toda resposta de API, nunca retornar Model/array cru). Migrations
  com nomes descritivos. Jobs para qualquer chamada à OpenF1 (nunca síncrono
  numa request HTTP).
- **Nomenclatura**: manter `openf1_*_key` como referência explícita ao
  identificador externo da OpenF1 em todas as tabelas sincronizadas, para
  rastreabilidade e idempotência (`updateOrCreate`, nunca `create` puro
  para dados sincronizados).
- **Commits**: mensagens em português ou inglês, mas consistentes dentro
  do mesmo PR/change. Preferência por Conventional Commits
  (`feat:`, `fix:`, `chore:`) quando fizer sentido.
- **Sem telemetria de alto volume no MVP**: `car_data` e qualquer endpoint
  de alta frequência da OpenF1 estão fora de escopo até uma mudança futura
  explícita.

## Fluxo OpenSpec — regras obrigatórias

Este projeto usa OpenSpec (`openspec/`) para spec-driven development.

- **Specs (`openspec/specs/`) são a fonte de verdade do sistema atual.**
  Nunca editar arquivos ali diretamente — eles só mudam via arquivamento
  de uma change (`/opsx:archive`).
- **Toda feature ou mudança de comportamento não trivial precisa de uma
  change antes de codar**: usar `/opsx:propose "<descrição>"` para gerar
  `proposal.md`, `specs/` (delta), `design.md` e `tasks.md` numa pasta
  própria em `openspec/changes/`.
- **Exceção**: fixes triviais (typo, ajuste de log, etc.) podem ser feitos
  direto, sem passar pelo fluxo de proposta.
- **Implementação segue o `tasks.md` item por item** (`/opsx:apply`).
  Não pular etapas nem implementar além do que está no checklist sem
  antes atualizar a proposta.
- **Ao concluir, arquivar** (`/opsx:archive`) para consolidar o delta na
  spec definitiva.
- Antes de iniciar uma sessão de implementação, validar a change com
  `openspec validate <nome-da-change>` se houver qualquer dúvida sobre o
  formato.

## Comportamento esperado do agente

- Sempre rodar migrations, comandos artisan e npm dentro dos containers
  (`docker compose exec`), nunca sugerir instalar PHP/Node no host.
- Nunca commitar `.env`/`.env.local` — apenas os `.env.example`.
- Ao adicionar uma dependência nova (Composer ou npm), rodar dentro do
  container correspondente para o `vendor`/`node_modules` (volumes
  nomeados) ficarem consistentes.
- Antes de propor mudanças que envolvam sincronizar novos recursos da
  OpenF1 (pit stops, weather, etc.), confirmar que está dentro do escopo
  atual ou propor isso explicitamente como uma nova change.
- Priorizar clareza e poucas entidades sobre generalização prematura —
  este é um projeto de aprendizado, não uma tentativa de cobrir 100% da
  OpenF1 de uma vez.