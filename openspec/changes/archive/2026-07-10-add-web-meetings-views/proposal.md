## Why

O domínio core (meetings, sessions, drivers, laps) já está sincronizado e
exposto via REST (`/api/meetings`, `/api/meetings/{id}/sessions`,
`/api/sessions/{id}/drivers`, `/api/sessions/{id}/laps`,
`/api/sessions/{id}/drivers/{driverId}/laps`), mas nenhuma tela consome
esses dados ainda. Sem front, não dá pra validar a API na prática nem
fechar o primeiro ciclo do MVP (dado sincronizado → API → tela).

## What Changes

- Criar página inicial (`/`) listando os meetings sincronizados (nome,
  país, circuito, data), ordenados por data.
- Criar página de detalhe do meeting (`/meetings/[id]`) listando as
  sessions daquele meeting.
- Criar página de detalhe da session (`/sessions/[id]`) listando os
  drivers da sessão e as laps (tabela geral, com filtro por driver).
- Criar cliente HTTP simples no Next.js (fetch wrapper + tipos
  TypeScript) pra consumir a API Laravel, sem lib externa de data
  fetching nesta primeira etapa.
- Layout base compartilhado (navegação simples entre as 3 telas, estados
  de loading/erro).

## Capabilities

### New Capabilities
- `web-race-explorer`: telas Next.js para navegar meetings → sessions →
  drivers/laps, consumindo a API REST já existente do projeto.

### Modified Capabilities
(nenhuma — consumo da API existente, sem mudança de requisito no backend)

## Impact

- `web/app/` — novas rotas/páginas (`/`, `/meetings/[id]`,
  `/sessions/[id]`).
- `web/lib/` (ou equivalente) — cliente HTTP e tipos TypeScript para
  Meeting, Session, Driver, Lap.
- Nenhum impacto em `api/` — só consumo das rotas já implementadas.
