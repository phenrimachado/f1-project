export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-surface" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-surface-hover" />
            <div className="mb-3 h-3 w-1/2 animate-pulse rounded bg-surface-hover" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-surface-hover" />
          </div>
        ))}
      </div>
    </main>
  );
}
