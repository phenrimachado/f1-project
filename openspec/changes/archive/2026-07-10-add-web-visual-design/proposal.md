## Why

As 3 telas do front (meetings, sessions, laps) usam só o scaffold padrão
do `create-next-app` — sem identidade visual, cores ou tipografia
pensadas pro domínio (dados de corrida). Antes de crescer o número de
telas, vale fixar um sistema visual coerente (cores, tipografia, padrões
de card/badge/tabela) e aplicá-lo nas telas existentes, inspirado em
sites do mesmo nicho (F1.com, F1TV, RaceFans, Motorsport.com).

## What Changes

- Definir tokens de cor: tema dark-first (fundo quase-preto, superfície
  cinza escuro, texto off-white), acento vermelho de corrida, cores de
  status pra tempos de volta (mais rápida da sessão, melhor pessoal do
  piloto).
- Definir tipografia: `Geist Sans` (UI/texto) e `Geist Mono` (tempos,
  posições, números tabulares) — ambas já carregadas no
  `layout.tsx`, sem uso real ainda.
- Mapa fixo `team_name → cor da equipe` pra usar como acento visual nas
  linhas/badges de piloto.
- Restyle das 3 telas existentes:
  - Home (`/`): lista simples → grid de cards de meeting.
  - Meeting (`/meetings/[id]`): lista de sessions → badges/chips
    coloridos por tipo de sessão.
  - Session (`/sessions/[id]`): tabela crua → leaderboard (posição,
    barra de cor da equipe, tempos em mono, destaque pra volta mais
    rápida da sessão e melhor volta pessoal do piloto).
- Mobile-first obrigatório em toda a implementação (já documentado em
  `web/CLAUDE.md`).

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `web-race-explorer`: o requirement "View Session Laps" ganha
  comportamento novo e testável — a volta mais rápida da sessão e a
  melhor volta pessoal de cada piloto devem ser visualmente destacadas
  na tabela de laps (não é só cor: é informação nova pro usuário).

## Impact

- `web/app/globals.css` — tokens de cor (CSS custom properties, dark
  mode).
- `web/app/page.tsx`, `web/app/meetings/[id]/page.tsx`,
  `web/app/sessions/[id]/page.tsx` — restyle.
- `web/lib/` — novo helper de cor de equipe e de identificação de volta
  mais rápida/melhor pessoal.
- Nenhum impacto em `api/` — puramente apresentação, sem novo dado
  vindo da API.
