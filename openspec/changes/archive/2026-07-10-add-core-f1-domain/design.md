# Design: Core F1 Domain

## Data Model (Postgres)

**meetings**
- id (PK)
- openf1_meeting_key (unique, referencia externa da OpenF1)
- name, location, country, circuit_short_name
- date_start
- timestamps

**race_sessions** (nome fisico da tabela; Laravel ja reserva `sessions`
para o proprio driver de sessao HTTP, entao a entidade de dominio "sessao
de corrida" e persistida como `race_sessions`. Model continua `Session`,
rotas `/api/.../sessions` inalteradas.)
- id (PK)
- meeting_id (FK -> meetings)
- openf1_session_key (unique)
- session_name (Practice 1, Qualifying, Race...)
- session_type
- date_start, date_end
- timestamps

**drivers**
- id (PK)
- openf1_driver_number (unique por sessao, nao globalmente)
- full_name, team_name, country_code
- timestamps

**session_driver** (pivot; um piloto pode participar de varias sessoes)
- session_id (FK)
- driver_id (FK)

**laps**
- id (PK)
- session_id (FK -> race_sessions)
- driver_id (FK -> drivers)
- lap_number
- lap_duration (nullable, em segundos)
- duration_sector_1, duration_sector_2, duration_sector_3 (nullable)
- is_pit_out_lap (bool)
- timestamps

## Sync Strategy
- Um `SyncMeetingsJob` (via Laravel Scheduler, container `scheduler`) roda
  periodicamente (ex: a cada 15 min durante um GP, menos frequente fora
  disso) e:
  1. Busca `/meetings` recentes na OpenF1.
  2. Para cada meeting novo/atualizado, dispara `SyncSessionsJob`.
  3. Para cada sessao ativa/recente, dispara `SyncDriversJob` e
     `SyncLapsJob`.
- Jobs sao enfileirados (Redis queue, container `queue-worker`), nao
  executados sincronamente, para nao travar o processo do scheduler.
- Idempotencia: toda sincronizacao usa `updateOrCreate` chaveado pelo
  `openf1_*_key` correspondente, nunca `create` puro.

## Cache Strategy
- Chave de cache: `f1:{resource}:{identificador}` (ex:
  `f1:session:9159:laps`).
- TTL curto (ex: 60s) para sessoes em andamento (dados mudam rápido),
  TTL longo (ex: 24h) para meetings/sessions já finalizados (dados
  estáveis).
- Cache é invalidado automaticamente pelo TTL; não há invalidação manual
  neste MVP (fica para uma mudança futura, se necessário).

## API Endpoints (Laravel, prefixo `/api`)
- `GET /meetings` — lista meetings sincronizados
- `GET /meetings/{id}/sessions` — sessoes de um meeting
- `GET /sessions/{id}/drivers` — pilotos de uma sessao
- `GET /sessions/{id}/laps` — voltas de uma sessao (todos os pilotos)
- `GET /sessions/{id}/drivers/{driverId}/laps` — voltas de um piloto
  especifico na sessao

Todos os endpoints retornam via Laravel API Resources dedicados
(`MeetingResource`, `SessionResource`, `DriverResource`, `LapResource`),
nunca o array associativo cru vindo da OpenF1.

## Out of Scope (explicitamente adiado)
- Telemetria (`car_data`), pit stops, weather, race control, team radio.
- Autenticacao de usuarios.
- Qualquer feature de monetizacao.
