export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 h-4 w-20 animate-pulse rounded bg-surface" />
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-surface" />
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-surface" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-6 w-full animate-pulse rounded bg-surface" />
        ))}
      </div>
    </main>
  );
}
