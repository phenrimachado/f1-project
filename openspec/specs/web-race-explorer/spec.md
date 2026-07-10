# Web Race Explorer

## Purpose
Telas Next.js para navegar meetings → sessions → drivers/laps,
consumindo a API REST do domínio core F1 (ver
[f1-data](../f1-data/spec.md)).

## Requirements

### Requirement: View Meetings List
The system SHALL display a list of synchronized meetings on the home
page, ordered by date, consuming `GET /api/meetings`.

#### Scenario: Meetings available
- **WHEN** the user visits the home page
- **THEN** the page displays each meeting's name, country, circuit, and
  date

#### Scenario: No meetings synced yet
- **WHEN** the API returns an empty meetings list
- **THEN** the page displays an empty state message instead of an empty
  table

### Requirement: Navigate to Meeting Sessions
The system SHALL allow the user to navigate from a meeting to its
sessions, consuming `GET /api/meetings/{id}/sessions`.

#### Scenario: View sessions for a meeting
- **WHEN** the user selects a meeting from the list
- **THEN** the system navigates to that meeting's detail page and
  displays its sessions ordered by start date

### Requirement: View Session Drivers
The system SHALL display the drivers participating in a session,
consuming `GET /api/sessions/{id}/drivers`.

#### Scenario: Drivers list for a session
- **WHEN** the user selects a session
- **THEN** the system navigates to that session's detail page and
  displays the participating drivers

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

### Requirement: Handle Loading and Error States
The system SHALL show appropriate feedback while data is loading or when
an API request fails.

#### Scenario: Loading state
- **WHEN** a page is fetching data from the API
- **THEN** the system displays a loading indicator instead of a blank
  page

#### Scenario: API error
- **WHEN** an API request fails
- **THEN** the system displays an error message instead of crashing
