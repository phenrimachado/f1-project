## Context

O front (`web/`) ainda é o scaffold padrão do `create-next-app` (Next.js
16, App Router, TypeScript, Tailwind). `NEXT_PUBLIC_API_URL` já está
definido em `web/.env.example` apontando pra `http://localhost:8000/api`.
A API já expõe os 5 endpoints do domínio core (meetings, sessions,
drivers, laps) com cache Redis e formato próprio (ver
`openspec/specs/f1-data/spec.md`).

## Goals / Non-Goals

**Goals:**
- 3 páginas navegáveis (meetings → sessions → drivers/laps) consumindo a
  API existente.
- Padrão de data-fetching simples e idiomático do App Router, sem
  dependência externa nesta primeira etapa.
- Loading/error state por rota usando as convenções nativas do Next.js.

**Non-Goals:**
- Paginação da lista de meetings (poucos meetings por temporada; revisar
  se o dataset crescer com múltiplas temporadas).
- Design system ou biblioteca de componentes — layout mínimo com
  Tailwind puro.
- Autenticação, favoritos, ou qualquer estado persistido no cliente.
- Client-side data fetching (SWR/react-query) — fica pra uma mudança
  futura se a interatividade exigir.

## Decisions

**Server Components + `fetch` nativo, sem lib de data-fetching.**
As 3 páginas são Server Components (`app/page.tsx`,
`app/meetings/[id]/page.tsx`, `app/sessions/[id]/page.tsx`) que chamam a
API diretamente no servidor via `fetch`. Alternativa considerada: SWR ou
React Query — descartado por adicionar dependência e complexidade de
client-side state pra um MVP que só lê dados (sem mutação, sem
polling em tempo real ainda).

**URL da API server-side é diferente da `NEXT_PUBLIC_API_URL`.**
Descoberto durante a implementação: Server Components rodam dentro do
container `web`, onde `localhost:8000` não resolve pro `nginx` (isolamento
de rede Docker — `localhost` ali é o próprio container `web`).
`NEXT_PUBLIC_API_URL=http://localhost:8000/api` continua correta pro que
for client-side (browser, no host), mas o `api.ts` — que só roda
server-side neste design — usa uma env var própria,
`API_INTERNAL_URL=http://nginx/api` (rede interna Docker, porta 80 do
nginx), setada em `docker-compose.yml` no serviço `web`.

**Cliente HTTP fino em `web/lib/api.ts`.**
Funções `getMeetings()`, `getMeetingSessions(id)`,
`getSessionDrivers(id)`, `getSessionLaps(id)`,
`getDriverLaps(sessionId, driverId)`, cada uma um `fetch` tipado pro
endpoint correspondente, usando `NEXT_PUBLIC_API_URL` como base. Espelha
o papel do `OpenF1Client` no backend: um wrapper único, sem lógica de UI
misturada.

**Tipos TypeScript em `web/lib/types.ts`.**
Interfaces `Meeting`, `Session`, `Driver`, `Lap` espelhando exatamente o
shape dos Resources do Laravel (`MeetingResource`, `SessionResource`,
`DriverResource`, `LapResource`), incluindo `driver` aninhado em `Lap`.

**Filtro de driver via query string (`?driver=<id>`), sem JS client-side.**
A página de sessão lê `searchParams.driver` no Server Component e decide
entre `getSessionLaps` (sem filtro) ou `getDriverLaps` (com filtro). Os
links de cada driver na lista apontam pra
`/sessions/[id]?driver=<driverId>`, navegação nativa do Next
(`<Link>`), sem estado de cliente.

**`loading.tsx`/`error.tsx` por rota, não estado manual.**
Cada segmento de rota (`app/`, `app/meetings/[id]/`,
`app/sessions/[id]/`) ganha seu próprio `loading.tsx` (skeleton simples)
e `error.tsx` (mensagem + botão de retry), usando as convenções nativas
do App Router em vez de `useState`/`useEffect` manual.

**Cache do `fetch` alinhado ao TTL do backend.**
`fetch(..., { next: { revalidate: 60 } })` como padrão — mesmo TTL curto
(`activeTtl`) usado no cache Redis do backend (`ResolvesCacheTtl`).
Mantém as duas camadas de cache com expectativa de frescor consistente,
sem precisar de invalidação manual nesta etapa.

## Risks / Trade-offs

- [Sem lib de data-fetching] → filtro de driver recarrega a página
  (server-side) a cada troca. Mitigação: é um Server Component, a
  navegação via `<Link>` já é rápida (prefetch do Next); aceitável pro
  volume de dados do MVP.
- [Sem paginação em meetings] → lista cresce sem limite conforme mais
  temporadas forem sincronizadas. Mitigação: fora de escopo agora,
  revisitar quando houver mais de ~1 temporada de dados.
- [`revalidate: 60` fixo, não diferenciado por sessão finalizada/ativa
  como no backend] → simplificação intencional; o cache do backend já
  garante a fonte de verdade correta, o `revalidate` do front só evita
  refetch excessivo do lado do Next.

## Migration Plan

Sem dado a migrar (feature nova, só leitura). Ordem de implementação:
1. Tipos + cliente HTTP (`web/lib/types.ts`, `web/lib/api.ts`).
2. Página de meetings (`/`) + `loading`/`error`.
3. Página de meeting (`/meetings/[id]`) + `loading`/`error`.
4. Página de session (`/sessions/[id]`) + `loading`/`error`.
Cada etapa é testável isoladamente no navegador antes de seguir pra
próxima.
