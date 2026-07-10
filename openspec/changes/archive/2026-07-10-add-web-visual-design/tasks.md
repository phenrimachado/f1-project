## 1. Tokens de Cor & Tipografia

- [x] 1.1 `app/globals.css`: adicionar tokens em `:root` + `@theme inline` (Tailwind v4 CSS-first — gera utilities `bg-surface`, `text-accent-foreground` etc direto, sem `bg-[var(--x)]`). Corrigido de quebra: `body` tinha `font-family: Arial` sobrescrevendo o Geist mapeado e nunca usado
- [x] 1.2 Remover paleta `zinc`/`dark:` das telas existentes em favor dos tokens novos — confirmado via grep, zero ocorrencia restante em `web/app/**/*.tsx`

## 2. Helpers (Team Colors & Lap Highlight)

- [x] 2.1 Criar `web/lib/teamColors.ts` — mapa `team_name → hex` (temporada atual) + fallback cinza
- [x] 2.2 Criar `web/lib/laps.ts` — `getFastestLapId(laps)` e `getPersonalBestLapIds(laps)`, excluindo `is_pit_out_lap` e `lap_duration: null`

## 3. Restyle — Home

- [x] 3.1 `app/page.tsx`: lista → grid de cards mobile-first (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- [x] 3.2 `app/loading.tsx`: skeleton com os tokens novos
- [x] 3.3 `app/error.tsx`: cores com os tokens novos

## 4. Restyle — Meeting Detail

- [x] 4.1 `app/meetings/[id]/page.tsx`: sessions como badges por `session_type` (Practice/Qualifying/Race)
- [x] 4.2 `app/meetings/[id]/loading.tsx` e `error.tsx`: tokens novos

## 5. Restyle — Session Detail

- [x] 5.1 `app/sessions/[id]/page.tsx`: tabela vira leaderboard — barra de cor da equipe por piloto, tempos em `Geist Mono`/`tabular-nums`. Nota: coluna de posicao de corrida (nao de volta) nao implementada — API/tipo `Lap` nao carrega posicao por volta, so `lap_number`; adicionar exigiria novo dado da OpenF1, fora do escopo desta change puramente visual
- [x] 5.2 Aplicar `getFastestLapId`/`getPersonalBestLapIds`: destaque visual (fundo + texto + badge "FL"/"PB") nas linhas correspondentes — badge textual junto da cor pra nao depender so de cor (acessibilidade)
- [x] 5.3 Chips de filtro por piloto com cor de equipe (dot de cor + fundo destacado quando ativo)
- [x] 5.4 `app/sessions/[id]/loading.tsx` e `error.tsx`: tokens novos

## 6. Layout

- [x] 6.1 `app/layout.tsx`: header com os tokens novos, remover classes antigas

## 7. Verification

- [x] 7.1 Rodar `docker compose exec web npm run build` (typecheck) — build limpo
- [x] 7.2 Testar as 3 telas em viewport mobile (largura mínima) — grid `grid-cols-1` (1 coluna) confirmado no HTML de `/` e `/meetings/[id]`, expande via `sm:`/`lg:`; tabela de laps com `overflow-x-auto` confirmado
- [x] 7.3 Confirmar com dados reais (sessão 53): exatamente 1 badge "FL" (volta mais rápida da sessão) e 15 badges "PB" (melhor pessoal por piloto) — comportamento correto (motorista da FL nao repete badge PB)
- [x] 7.4 Confirmar cores de equipe — bug real encontrado: grid 2026 nao tem mais "Kick Sauber" (virou Audi) e "Haas" precisa ser "Haas F1 Team" (nome exato do banco); faltava "Cadillac" (equipe nova). Corrigido `teamColors.ts` pros 11 times reais de 2026; reteste confirmou 0 fallback cinza
