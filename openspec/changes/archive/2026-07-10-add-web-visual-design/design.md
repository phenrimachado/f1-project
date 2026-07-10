## Context

As 3 telas atuais (`/`, `/meetings/[id]`, `/sessions/[id]`) usam só
Tailwind cru com paleta `zinc` genérica do scaffold do `create-next-app`.
`Geist Sans` e `Geist Mono` já estão carregadas em `app/layout.tsx` mas
`Geist Mono` não é usada em lugar nenhum ainda. Não existe biblioteca de
componentes (decisão da mudança anterior,
`openspec/changes/archive/2026-07-10-add-web-meetings-views/design.md`)
e este design mantém essa decisão.

## Goals / Non-Goals

**Goals:**
- Tema dark único, com identidade visual de site de corrida (acento
  vermelho, tipografia mono pra números).
- Tokens de cor centralizados (CSS custom properties em
  `globals.css`), reutilizados via classes Tailwind arbitrárias
  (`bg-[var(--surface)]` etc) — sem introduzir Tailwind config custom
  nem lib de tema.
- Destaque visual pra volta mais rápida da sessão e melhor volta pessoal
  de cada piloto (requirement modificado em
  `specs/web-race-explorer/spec.md`).
- Cor de equipe por piloto como acento visual (barra lateral/chip).
- Mobile-first em todo componente novo/alterado (`web/CLAUDE.md`).

**Non-Goals:**
- Light mode / toggle de tema — o site adota **um único tema escuro**,
  sem `prefers-color-scheme` nem `dark:` variants. Simplifica a
  implementação (não precisa estilizar tudo duas vezes) e é o padrão
  em sites de motorsport (F1TV, F1.com não oferecem light mode).
- Biblioteca de componentes (shadcn/ui, Radix, etc) — mantém a decisão
  da mudança anterior.
- Animações/transições elaboradas — só hover states simples.
- Página de "legenda de cores das equipes" ou glossário visual.

## Decisions

**Tema único escuro, tokens via CSS custom properties.**
`app/globals.css` ganha um bloco `:root` com os tokens abaixo. Zero uso
de `dark:` daqui pra frente — as classes usam os tokens diretamente
(`bg-[var(--surface)]`, `text-[var(--text-primary)]`).

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0d0d0d` | fundo da página |
| `--surface` | `#1a1a1a` | cards, header |
| `--surface-hover` | `#242424` | hover de card/linha |
| `--border` | `rgba(255,255,255,0.08)` | divisores, bordas de card |
| `--text-primary` | `#f5f5f5` | títulos, texto principal |
| `--text-secondary` | `#a3a3a3` | subtítulos, metadados |
| `--text-muted` | `#737373` | labels de tabela, texto auxiliar |
| `--accent` | `#e10600` | fundo de botão/badge ativo, borda de destaque |
| `--accent-text` | `#ff3b30` | acento usado como texto (contraste melhor sobre `--bg`/`--surface` que `--accent`) |
| `--status-fastest` | `#a855f7` (roxo) | volta mais rápida da sessão |
| `--status-personal-best` | `#22c55e` (verde) | melhor volta pessoal do piloto |

Justificativa das duas variantes de vermelho: `--accent` (`#e10600`) tem
contraste baixo como texto sobre fundo escuro; usado como texto vira
`--accent-text` (`#ff3b30`), mais claro. Convenção emprestada do
método do skill `dataviz` (cor de status é reservada e não reaproveitada
como categórica) — aqui roxo/verde são fixos pro par
fastest/personal-best e não usados em mais nada na tela.

**`Geist Mono` para todo número tabular.**
Tempos de volta, setores, número do carro e posição usam a classe da
variável `--font-geist-mono` com `tabular-nums` — alinha em coluna,
reforça a leitura tipo "telão de cronometragem". `Geist Sans` continua
pra tudo que é texto (nomes, labels, navegação).

**Mapa fixo `team_name → cor` em `web/lib/teamColors.ts`.**
Objeto simples `Record<string, string>` com as 11 equipes da temporada
2026 (grid real, confirmado via `Driver::distinct()->pluck('team_name')`
no banco: McLaren, Ferrari, Red Bull Racing, Mercedes, Aston Martin,
Alpine, Williams, Racing Bulls, Audi, Cadillac, Haas F1 Team — chave
exata igual ao `team_name` sincronizado da OpenF1, não o nome "popular"
da equipe) + cor cinza de fallback pra time não mapeado. Usado como
indicador de cor nas linhas da tabela de laps e nos chips de filtro por
piloto.

**Cálculo de fastest lap / personal best no cliente, direto no
Server Component.**
Novo helper `web/lib/laps.ts`:
- `getFastestLapId(laps)`: menor `lap_duration` entre as laps da sessão
  **excluindo** `is_pit_out_lap` (convenção real de corrida: volta de
  saída de pit não conta pra volta mais rápida) e `lap_duration: null`.
- `getPersonalBestLapIds(laps)`: mesmo critério, agrupado por
  `driver_id` — retorna um `Set<number>` de lap ids.
`SessionPage` chama os dois sobre o array de laps já buscado (sem
requisição extra à API) e passa pra tabela decidir a classe visual de
cada linha.

**Cards em vez de listas (home, meeting) — grid mobile-first.**
`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` — 1 coluna no
mobile, expande em telas maiores, conforme regra de `web/CLAUDE.md`.

**Badges de tipo de sessão com cor fixa por `session_type`.**
`Practice` → neutro (`--surface-hover` + `--text-secondary`),
`Qualifying` → âmbar (`#f59e0b`), `Race` → `--accent`. Tipos não
mapeados caem no neutro.

## Risks / Trade-offs

- [Tema único escuro] → usuário que prefere light mode não tem opção.
  Mitigação: fora de escopo por decisão de produto (Non-Goals); revisar
  se usuários reais pedirem.
- [Cores de equipe hardcoded] → muda a cada temporada (equipes trocam
  cor/nome, ex: patrocínio). Mitigação: é só um mapa de string→hex, uma
  edição isolada quando a OpenF1 começar a refletir uma nova temporada.
- [Cálculo de fastest/personal-best no cliente] → recalculado a cada
  render (sem cache dedicado). Mitigação: dataset por sessão é pequeno
  (dezenas de laps), custo desprezível; se crescer, mover pro backend
  vira uma mudança futura.
