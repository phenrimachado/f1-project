# Proposal: Add Core F1 Domain (Meetings, Drivers, Laps)

## Intent
O projeto precisa de um dominio inicial minimo, porem solido, para exibir
dados de Formula 1 sincronizados a partir da API publica OpenF1
(https://api.openf1.org/v1). O objetivo deste MVP nao e cobrir todos os
recursos da OpenF1, e sim validar a arquitetura de sincronizacao, cache e
apresentacao com o menor numero de entidades possivel.

## Scope
Inclui:
- Sincronizacao de `meetings` e `sessions` (finais de semana de corrida e
  suas sessoes: treino, classificacao, corrida).
- Sincronizacao de `drivers` (pilotos participantes de uma sessao).
- Sincronizacao de `laps` (voltas), incluindo tempo total e tempos de setor.
- Endpoints REST proprios (Laravel) que servem esses dados ja normalizados
  para o front (Next.js), desacoplados do formato bruto da OpenF1.
- Cache dos dados sincronizados (Redis) para reduzir chamadas repetidas a
  API externa e respeitar o rate limit dela (3 req/s).

Fora de escopo (deliberadamente, ficam para mudancas futuras):
- `car_data` (telemetria de alta frequencia, 3.7Hz)
- `pit`, `weather`, `race_control`, `team_radio`
- Autenticacao/contas de usuario
- Qualquer funcionalidade de monetizacao (ver nota de licenciamento abaixo)

## Approach
- Laravel atua como camada de agregacao: um job agendado (Scheduler) busca
  dados novos na OpenF1, normaliza e persiste no Postgres.
- Leitura para o front sempre passa pelo cache Redis antes de bater no
  Postgres; o Postgres e a fonte de verdade, o Redis e apenas otimizacao.
- Endpoints proprios em `/api/meetings`, `/api/sessions`, `/api/drivers`,
  `/api/laps`, retornando via Laravel API Resources (nunca o payload cru
  da OpenF1 repassado direto).

## Note de licenciamento
Os dados da OpenF1 sao licenciados como CC BY-NC-SA 4.0 (uso nao comercial).
Este MVP e estritamente de estudo/uso pessoal. Qualquer plano de
monetizacao futuro exige contato previo com a OpenF1 sobre licenciamento
adequado antes de qualquer implementacao de ads/paywall.
