# Changelog

Registro de mudanças notáveis do projeto, mais recente primeiro. Projeto
de estudo, sem versionamento semântico por enquanto — cada entrada
referencia a change do [OpenSpec](openspec/) que a originou, quando
houver.

## 2026-07-10

- **docs**: atualiza o README com o status atual do front e adiciona
  este changelog.
- **feat**: design system visual do front — tema escuro único, tokens de
  cor via Tailwind v4 (`@theme inline`), tipografia `Geist`/`Geist Mono`
  pra números tabulares, cor por equipe, destaque visual da volta mais
  rápida da sessão e da melhor volta pessoal de cada piloto.
  (`add-web-visual-design`)
- **feat**: primeiras telas do front — lista de meetings, sessions de um
  meeting, drivers e laps de uma sessão com filtro por piloto. Server
  Components consumindo a API via rede interna do Docker.
  (`add-web-meetings-views`)

## 2026-07-09

- **docs**: separa o README de apresentação do guia de setup local
  (movido pra `docs/SETUP.md`).
- **feat**: scaffold do monorepo (Laravel 13 + Next.js + Docker Compose
  + OpenSpec) e domínio core F1 — sincronização de meetings, sessions,
  drivers e laps a partir da OpenF1, endpoints REST próprios, cache
  Redis com TTL diferenciado por status da sessão.
  (`add-core-f1-domain`)
