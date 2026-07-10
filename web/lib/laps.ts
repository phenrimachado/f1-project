import type { Lap } from "./types";

function isEligible(lap: Lap): boolean {
  return !lap.is_pit_out_lap && lap.lap_duration !== null;
}

export function getFastestLapId(laps: Lap[]): number | null {
  const eligible = laps.filter(isEligible);
  if (eligible.length === 0) return null;

  return eligible.reduce((best, lap) =>
    (lap.lap_duration as number) < (best.lap_duration as number) ? lap : best
  ).id;
}

export function getPersonalBestLapIds(laps: Lap[]): Set<number> {
  const bestByDriver = new Map<number, Lap>();

  for (const lap of laps) {
    if (!isEligible(lap) || !lap.driver) continue;

    const current = bestByDriver.get(lap.driver.id);
    if (!current || (lap.lap_duration as number) < (current.lap_duration as number)) {
      bestByDriver.set(lap.driver.id, lap);
    }
  }

  return new Set([...bestByDriver.values()].map((lap) => lap.id));
}
