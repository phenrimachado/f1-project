# Tasks

## 1. Database Schema
- [x] 1.1 Migration `meetings` (openf1_meeting_key, name, location, country, circuit_short_name, date_start)
- [x] 1.2 Migration `sessions` (meeting_id FK, openf1_session_key, session_name, session_type, date_start, date_end) — tabela fisica `race_sessions` (colisao com `sessions` nativa do Laravel)
- [x] 1.3 Migration `drivers` (openf1_driver_number, full_name, team_name, country_code)
- [x] 1.4 Migration `session_driver` (pivot: session_id, driver_id)
- [x] 1.5 Migration `laps` (session_id FK, driver_id FK, lap_number, lap_duration, duration_sector_1/2/3, is_pit_out_lap)

## 2. Models
- [x] 2.1 Model `Meeting` (hasMany Sessions)
- [x] 2.2 Model `Session` (belongsTo Meeting, belongsToMany Drivers, hasMany Laps)
- [x] 2.3 Model `Driver` (belongsToMany Sessions, hasMany Laps)
- [x] 2.4 Model `Lap` (belongsTo Session, belongsTo Driver)

## 3. OpenF1 Client
- [x] 3.1 Service `OpenF1Client` (wrapper HTTP para api.openf1.org/v1, usando `OPENF1_BASE_URL` do .env)
- [x] 3.2 Metodo `getMeetings()`, `getSessions()`, `getDrivers()`, `getLaps()`

## 4. Sync Jobs
- [x] 4.1 Job `SyncMeetingsJob`
- [x] 4.2 Job `SyncSessionsJob`
- [x] 4.3 Job `SyncDriversJob`
- [x] 4.4 Job `SyncLapsJob`
- [x] 4.5 Registrar jobs no Laravel Scheduler (`routes/console.php` ou `app/Console/Kernel.php`)

## 5. API Resources & Controllers
- [x] 5.1 `MeetingResource`, `SessionResource`, `DriverResource`, `LapResource`
- [x] 5.2 Controller + rota `GET /api/meetings`
- [x] 5.3 Controller + rota `GET /api/meetings/{id}/sessions`
- [x] 5.4 Controller + rota `GET /api/sessions/{id}/drivers`
- [x] 5.5 Controller + rota `GET /api/sessions/{id}/laps`
- [x] 5.6 Controller + rota `GET /api/sessions/{id}/drivers/{driverId}/laps`

## 6. Cache Layer
- [x] 6.1 Middleware ou camada de repositorio que verifica Redis antes de consultar Postgres
- [x] 6.2 TTL diferenciado (curto para sessao ativa, longo para sessao finalizada)

## 7. Verification
- [x] 7.1 Testar sync manual via `php artisan tinker` ou comando artisan dedicado — cadeia completa via tinker + queue worker real (26 meetings, 126 sessions, 22 drivers, 1866 laps sincronizados da temporada 2026)
- [x] 7.2 Testar os 5 endpoints via Postman/Insomnia ou `curl` — todos os 5 retornaram formato proprio (nunca payload cru da OpenF1). 2 bugs de cache encontrados via teste manual no Postman e corrigidos: (1) cache guardando objeto Eloquent/Carbon cru, ver nota 7.3; (2) `LapResource` guardava `new DriverResource(...)` (objeto Resource vivo) aninhado no array cacheado — corrigido pra `$this->whenLoaded('driver', fn () => (new DriverResource($this->driver))->resolve())`
- [x] 7.3 Confirmar que uma segunda chamada ao mesmo endpoint vem do cache (checar tempo de resposta ou logs) — chave `f1:session:53:laps` persistida no Redis (db 1) com TTL ~86400s (sessao finalizada = TTL longo). Bug encontrado e corrigido: Laravel 13 tem `serializable_classes => false` em `config/cache.php` (protecao contra PHP object injection), entao cache HIT com objeto Eloquent/Carbon virava `__PHP_Incomplete_Class`. Fix: controllers cacheiam o array ja resolvido pelo Resource (`->resolve()`), nao o objeto Eloquent; `MeetingResource`/`SessionResource` convertem `date_start`/`date_end` para string via `->toIso8601String()` antes de cachear.
