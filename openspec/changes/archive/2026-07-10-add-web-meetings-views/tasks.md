## 1. Types & HTTP Client

- [x] 1.1 Criar `web/lib/types.ts` com `Meeting`, `Session`, `Driver`, `Lap` espelhando os Resources do Laravel
- [x] 1.2 Criar `web/lib/api.ts` com `getMeetings()`, `getMeetingSessions(id)`, `getSessionDrivers(id)`, `getSessionLaps(id)`, `getDriverLaps(sessionId, driverId)` — usando `API_INTERNAL_URL` (nao `NEXT_PUBLIC_API_URL`, ver nota em design.md sobre rede interna Docker)

## 2. Home Page — Lista de Meetings

- [x] 2.1 `app/page.tsx`: Server Component listando meetings (nome, país, circuito, data), cada um linkando pra `/meetings/[id]`
- [x] 2.2 `app/loading.tsx`: skeleton de loading
- [x] 2.3 `app/error.tsx`: mensagem de erro com retry
- [x] 2.4 Empty state quando a lista de meetings vier vazia

## 3. Meeting Detail — Sessions

- [x] 3.1 `app/meetings/[id]/page.tsx`: lista as sessions do meeting ordenadas por `date_start`, cada uma linkando pra `/sessions/[id]`
- [x] 3.2 `app/meetings/[id]/loading.tsx`
- [x] 3.3 `app/meetings/[id]/error.tsx`

## 4. Session Detail — Drivers & Laps

- [x] 4.1 `app/sessions/[id]/page.tsx`: lista os drivers da sessão, cada um linkando pra `/sessions/[id]?driver=<driverId>`
- [x] 4.2 Tabela de laps (todas ou filtradas por driver via `searchParams.driver`), ordenada por `lap_number`, mostrando tempo total e setores
- [x] 4.3 `app/sessions/[id]/loading.tsx`
- [x] 4.4 `app/sessions/[id]/error.tsx`

## 5. Layout & Navegação

- [x] 5.1 Navegação simples no `app/layout.tsx` raiz (link pra home)
- [x] 5.2 Remover o conteúdo boilerplate do `create-next-app` em `app/page.tsx`

## 6. Verification

- [x] 6.1 Rodar `docker compose exec web npm run build` (typecheck) — build limpo, `/` estatico (ISR 1m), `/meetings/[id]` e `/sessions/[id]` dinamicos
- [x] 6.2 Testar fluxo completo com dados reais já sincronizados: home → meeting → session, incluindo filtro por driver (via curl, conteudo renderizado confirmado: nomes de meeting/sessao/piloto, tabela de laps, filtro removendo coluna Piloto)
- [x] 6.3 Testar empty state (sessao sem laps, id 7: "Nenhuma volta sincronizada" confirmado) e error state (sessao inexistente: digest de erro + script de retry presentes no HTML — `error.tsx` e Client Component, a UI de fallback so troca no browser apos hidratacao, curl nao executa JS pra ver o texto final, mas o mecanismo (digest, `$RX` retry) esta correto tanto em dev quanto em build de producao)
