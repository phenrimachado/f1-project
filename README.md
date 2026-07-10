# F1 Insights

Projeto de estudo com objetivo duplo: aprender Laravel a fundo como camada
de API (mantendo React/Next já conhecido no front) e praticar
desenvolvimento orientado a spec (OpenSpec) com uso eficiente de agentes
de IA.

Consome dados da API pública [OpenF1](https://api.openf1.org/v1) e os
apresenta de forma própria — gráficos, comparações, etc. Começa pequeno
(poucas entidades) e escala conforme o domínio cresce.

## Stack

- **Front**: Next.js (App Router, TypeScript, Tailwind) — `web/`
- **API**: Laravel 13 (PHP 8.4) — `api/`
- **Banco**: PostgreSQL 16
- **Cache/Fila**: Redis 7
- **Infra**: Docker Compose — todos os serviços rodam em container

## Status

**API**: domínio core implementado — sincronização de meetings, sessions,
drivers e laps a partir da OpenF1, com endpoints REST próprios
(`/api/meetings`, `/api/meetings/{id}/sessions`,
`/api/sessions/{id}/drivers`, `/api/sessions/{id}/laps`,
`/api/sessions/{id}/drivers/{driverId}/laps`) e cache Redis com TTL
diferenciado por status da sessão.

**Front**: 3 telas navegáveis (meetings → sessions → drivers/laps)
consumindo a API acima, com tema visual próprio (dark, tipografia
`Geist`/`Geist Mono`, cor por equipe, destaque de volta mais rápida e
melhor pessoal do piloto). Mobile-first em todo layout novo (ver
[web/CLAUDE.md](web/CLAUDE.md)).

Fora de escopo por enquanto: telemetria de alta frequência (`car_data`),
pit stops, weather, race control, team radio, autenticação de usuários.

Histórico de mudanças: [CHANGELOG.md](CHANGELOG.md).

## Rodando localmente

Veja [docs/SETUP.md](docs/SETUP.md).

## Desenvolvimento

O projeto usa [OpenSpec](openspec/) para desenvolvimento orientado a
spec — toda feature não trivial passa por proposta, design e tasks antes
de codar. Instruções detalhadas de comportamento e armadilhas conhecidas
do ambiente estão em [CLAUDE.md](CLAUDE.md).

## Licenciamento

Os dados da OpenF1 são licenciados como **CC BY-NC-SA 4.0** (uso não
comercial). Este projeto é de estudo/uso pessoal — nenhuma feature de
monetização (ads, paywall, assinatura) será implementada sem antes
consultar a OpenF1 sobre uma licença adequada.
