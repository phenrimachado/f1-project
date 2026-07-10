# Delta for F1 Data

## ADDED Requirements

### Requirement: Sync Meetings and Sessions
The system MUST synchronize meetings (race weekends) and their sessions
(practice, qualifying, race) from the OpenF1 API on a scheduled basis.

#### Scenario: New meeting appears on OpenF1
- GIVEN the OpenF1 API has a meeting not yet present locally
- WHEN the sync job runs
- THEN the meeting and its sessions are persisted in the local database

#### Scenario: Existing meeting is updated
- GIVEN a meeting already exists locally
- WHEN the sync job runs and the OpenF1 data has changed
- THEN the local record is updated, not duplicated

### Requirement: Sync Drivers per Session
The system MUST synchronize the list of drivers participating in each
session, including team and car number.

#### Scenario: Drivers list for a session
- GIVEN a session has been synced
- WHEN a client requests the drivers for that session
- THEN the API returns all drivers linked to that session

### Requirement: Sync Laps per Session
The system MUST synchronize lap data (lap number, lap time, sector times)
for each driver in a session.

#### Scenario: Laps for a driver in a session
- GIVEN a session and a driver have been synced
- WHEN a client requests laps for that driver in that session
- THEN the API returns all laps ordered by lap number

### Requirement: Cached Read Access
The system MUST serve read requests for meetings, sessions, drivers, and
laps from cache (Redis) when available, falling back to the database on
cache miss.

#### Scenario: Cache hit
- GIVEN a resource was fetched recently and is cached
- WHEN a client requests it again within the cache TTL
- THEN the response is served from Redis without querying Postgres

#### Scenario: Cache miss
- GIVEN a resource is not present in the cache
- WHEN a client requests it
- THEN the system queries Postgres, returns the data, and populates the
  cache for subsequent requests

### Requirement: Own API Contract
The system MUST expose its own REST endpoints and response shape,
independent of the OpenF1 API's raw response format.

#### Scenario: Frontend consumes normalized data
- GIVEN the frontend requests `/api/sessions/{id}/laps`
- WHEN the API responds
- THEN the payload follows the project's own Resource format, not the
  OpenF1 raw JSON structure
