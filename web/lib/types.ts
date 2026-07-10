export interface Meeting {
  id: number;
  openf1_meeting_key: number;
  name: string;
  location: string | null;
  country: string | null;
  circuit_short_name: string | null;
  date_start: string | null;
}

export interface Session {
  id: number;
  meeting_id: number;
  openf1_session_key: number;
  session_name: string;
  session_type: string | null;
  date_start: string | null;
  date_end: string | null;
}

export interface Driver {
  id: number;
  openf1_driver_number: number;
  full_name: string;
  team_name: string | null;
  country_code: string | null;
}

export interface Lap {
  id: number;
  session_id: number;
  driver: Driver | null;
  lap_number: number;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  is_pit_out_lap: boolean;
}
