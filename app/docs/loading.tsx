import Nav from "@/components/landing/Nav";

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`rounded-md bg-[#141414] animate-pulse ${className}`}
      aria-hidden
    />
  );
}

export default function DocsLoading() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <header className="sticky top-0 z-50 pb-14">
        <Nav />
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:flex flex-col gap-2 w-52 shrink-0">
          <Skeleton className="h-3 w-20 mb-4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-full rounded-lg" />
          ))}
        </aside>

        {/* Content skeleton */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-40 w-full mt-4 rounded-xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </main>
      </div>
    </div>
  );
}
