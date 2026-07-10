import Link from "next/link";
import { getMeetings } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default async function HomePage() {
  const meetings = await getMeetings();

  if (meetings.length === 0) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="mb-6 text-2xl font-semibold">Meetings</h1>
        <p className="text-foreground-secondary">
          Nenhum meeting sincronizado ainda.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-6 text-2xl font-semibold">Meetings</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => (
          <Link
            key={meeting.id}
            href={`/meetings/${meeting.id}`}
            className="rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-hover"
          >
            <p className="font-medium">{meeting.name}</p>
            <p className="mt-1 text-sm text-foreground-secondary">
              {meeting.circuit_short_name}
              {meeting.country ? ` — ${meeting.country}` : ""}
            </p>
            <p className="mt-3 text-sm text-foreground-muted">
              {formatDate(meeting.date_start)}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
