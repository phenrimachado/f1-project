import Link from "next/link";
import { getMeetings, getMeetingSessions } from "@/lib/api";
import { formatDateTime } from "@/lib/format";

const SESSION_TYPE_STYLES: Record<string, string> = {
  Qualifying: "bg-quali/15 text-quali",
  Race: "bg-accent/15 text-accent-foreground",
};

function sessionTypeStyle(type: string | null): string {
  if (!type) return "bg-surface-hover text-foreground-secondary";
  return SESSION_TYPE_STYLES[type] ?? "bg-surface-hover text-foreground-secondary";
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [meetings, sessions] = await Promise.all([
    getMeetings(),
    getMeetingSessions(id),
  ]);
  const meeting = meetings.find((m) => String(m.id) === id);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-foreground-secondary hover:text-accent-foreground"
      >
        ← Meetings
      </Link>
      <h1 className="mb-1 text-2xl font-semibold">
        {meeting?.name ?? `Meeting #${id}`}
      </h1>
      {meeting && (
        <p className="mb-6 text-sm text-foreground-secondary">
          {meeting.circuit_short_name}
          {meeting.country ? ` — ${meeting.country}` : ""}
        </p>
      )}

      {sessions.length === 0 ? (
        <p className="text-foreground-secondary">
          Nenhuma sessão sincronizada para este meeting.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-hover"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="font-medium">{session.session_name}</p>
                {session.session_type && (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${sessionTypeStyle(
                      session.session_type
                    )}`}
                  >
                    {session.session_type}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground-muted">
                {formatDateTime(session.date_start)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
