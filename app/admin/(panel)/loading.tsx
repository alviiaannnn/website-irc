// Shown instantly while an admin screen loads, so a click never feels stuck.
export default function Loading() {
  const bar = 'animate-pulse rounded-lg bg-navy-200/50'
  return (
    <div role="status" aria-label="Loading" className="space-y-8">
      <div className={`${bar} h-4 w-48`} />
      <div className="space-y-3">
        <div className={`${bar} h-9 w-72`} />
        <div className={`${bar} h-4 w-full max-w-lg`} />
      </div>
      <div className="space-y-px overflow-hidden rounded-2xl border border-navy-200/70 bg-white">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className={`${bar} size-10 rounded-xl`} />
            <div className="flex-1 space-y-2">
              <div className={`${bar} h-3.5 w-1/3`} />
              <div className={`${bar} h-3 w-2/3`} />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
