## MODIFIED Requirements

### Requirement: View Session Laps
The system SHALL display lap data for a session, with the option to
filter by driver, consuming `GET /api/sessions/{id}/laps` and
`GET /api/sessions/{id}/drivers/{driverId}/laps`. The fastest lap of the
session and each driver's personal best lap SHALL be visually
distinguished from other laps.

#### Scenario: All laps for a session
- **WHEN** the user views a session detail page without a driver filter
- **THEN** the system displays all laps for that session ordered by lap
  number, including driver, lap time, and sector times

#### Scenario: Filter laps by driver
- **WHEN** the user selects a specific driver on the session page
- **THEN** the system displays only that driver's laps, ordered by lap
  number

#### Scenario: Fastest lap of the session is highlighted
- **WHEN** the laps table for a session is displayed
- **THEN** the lap with the lowest `lap_duration` in that session is
  visually distinguished from the other laps

#### Scenario: Driver's personal best lap is highlighted
- **WHEN** the laps table for a session is displayed
- **THEN** each driver's lap with the lowest `lap_duration` among their
  own laps is visually distinguished, separately from the session's
  fastest lap
