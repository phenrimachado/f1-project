import Link from "next/link";
import { getDriverLaps, getSessionDrivers, getSessionLaps } from "@/lib/api";
import { formatLapTime } from "@/lib/format";
import { getFastestLapId, getPersonalBestLapIds } from "@/lib/laps";
import { getTeamColor } from "@/lib/teamColors";

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ driver?: string }>;
}) {
  const { id } = await params;
  const { driver: driverId } = await searchParams;

  const [drivers, laps] = await Promise.all([
    getSessionDrivers(id),
    driverId ? getDriverLaps(id, driverId) : getSessionLaps(id),
  ]);

  const fastestLapId = getFastestLapId(laps);
  const personalBestLapIds = getPersonalBestLapIds(laps);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-foreground-secondary hover:text-accent-foreground"
      >
        ← Meetings
      </Link>
      <h1 className="mb-6 text-2xl font-semibold">Sessão #{id}</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/sessions/${id}`}
          className={`rounded-full px-3 py-1 text-sm ${
            !driverId
              ? "bg-accent text-white"
              : "border border-border bg-surface text-foreground-secondary hover:bg-surface-hover"
          }`}
        >
          Todos
        </Link>
        {drivers.map((driver) => (
          <Link
            key={driver.id}
            href={`/sessions/${id}?driver=${driver.id}`}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${
              driverId === String(driver.id)
                ? "bg-accent text-white"
                : "border border-border bg-surface text-foreground-secondary hover:bg-surface-hover"
            }`}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: getTeamColor(driver.team_name) }}
            />
            {driver.full_name}
          </Link>
        ))}
      </div>

      {laps.length === 0 ? (
        <p className="text-foreground-secondary">
          Nenhuma volta sincronizada para este filtro.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-foreground-muted">
                <th className="py-2 pl-4 pr-4 font-medium">Volta</th>
                {!driverId && <th className="py-2 pr-4 font-medium">Piloto</th>}
                <th className="py-2 pr-4 font-medium font-mono">Tempo</th>
                <th className="py-2 pr-4 font-medium font-mono">S1</th>
                <th className="py-2 pr-4 font-medium font-mono">S2</th>
                <th className="py-2 pr-4 font-medium font-mono">S3</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap) => {
                const isFastest = lap.id === fastestLapId;
                const isPersonalBest = personalBestLapIds.has(lap.id);
                const timeClass = isFastest
                  ? "text-fastest"
                  : isPersonalBest
                    ? "text-personal-best"
                    : "text-foreground";

                return (
                  <tr
                    key={lap.id}
                    className={`border-b border-border last:border-0 ${
                      isFastest
                        ? "bg-fastest/10"
                        : isPersonalBest
                          ? "bg-personal-best/10"
                          : ""
                    }`}
                  >
                    <td className="py-2 pl-4 pr-4 font-mono">
                      {lap.lap_number}
                      {lap.is_pit_out_lap ? (
                        <span className="ml-1 text-xs text-foreground-muted">
                          (pit out)
                        </span>
                      ) : null}
                    </td>
                    {!driverId && (
                      <td className="py-2 pr-4">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-3 w-1 shrink-0 rounded-full"
                            style={{
                              backgroundColor: getTeamColor(lap.driver?.team_name ?? null),
                            }}
                          />
                          {lap.driver?.full_name ?? "—"}
                        </span>
                      </td>
                    )}
                    <td className={`py-2 pr-4 font-mono ${timeClass}`}>
                      {formatLapTime(lap.lap_duration)}
                      {isFastest && (
                        <span className="ml-1.5 rounded bg-fastest/20 px-1 text-xs font-sans text-fastest">
                          FL
                        </span>
                      )}
                      {!isFastest && isPersonalBest && (
                        <span className="ml-1.5 rounded bg-personal-best/20 px-1 text-xs font-sans text-personal-best">
                          PB
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4 font-mono text-foreground-secondary">
                      {formatLapTime(lap.duration_sector_1)}
                    </td>
                    <td className="py-2 pr-4 font-mono text-foreground-secondary">
                      {formatLapTime(lap.duration_sector_2)}
                    </td>
                    <td className="py-2 pr-4 font-mono text-foreground-secondary">
                      {formatLapTime(lap.duration_sector_3)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
