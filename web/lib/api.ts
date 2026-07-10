import type { Driver, Lap, Meeting, Session } from "./types";

const BASE_URL = process.env.API_INTERNAL_URL ?? "http://nginx/api";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${path} (${res.status})`);
  }

  const json = await res.json();
  return json.data as T;
}

export function getMeetings(): Promise<Meeting[]> {
  return apiFetch<Meeting[]>("/meetings");
}

export function getMeetingSessions(meetingId: string | number): Promise<Session[]> {
  return apiFetch<Session[]>(`/meetings/${meetingId}/sessions`);
}

export function getSessionDrivers(sessionId: string | number): Promise<Driver[]> {
  return apiFetch<Driver[]>(`/sessions/${sessionId}/drivers`);
}

export function getSessionLaps(sessionId: string | number): Promise<Lap[]> {
  return apiFetch<Lap[]>(`/sessions/${sessionId}/laps`);
}

export function getDriverLaps(
  sessionId: string | number,
  driverId: string | number
): Promise<Lap[]> {
  return apiFetch<Lap[]>(`/sessions/${sessionId}/drivers/${driverId}/laps`);
}
