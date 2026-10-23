// app/dashboard/stats/loading.tsx

function StatCardSkeleton({ index }: { index: number }) {
  return (
    <div key={index} className="card card-xs animate-pulse">
      <div className="h-3.5 bg-border rounded w-26 mb-2" />
      <div className="h-8 bg-border rounded w-18" />
    </div>
  );
}

export default function StatsLoading() {
  const barHeightClasses = [
    "h-[18%]",
    "h-[28%]",
    "h-[38%]",
    "h-[48%]",
    "h-[58%]",
    "h-[68%]",
    "h-[78%]",
  ];

  return (
    <div>
      <h1 className="animate-pulse">
        <span className="block h-11 w-68 bg-border rounded-xl" />
      </h1>

      <main className="main-container flex flex-col gap-2 md:gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <StatCardSkeleton key={i} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div className="card animate-pulse min-h-80">
            <div className="h-7 bg-border rounded w-56 mb-2" />
            <div className="h-4 bg-border rounded w-72 mb-5" />
            <div className="content mt-2 flex-1 flex items-end justify-center gap-4">
              <div className="w-16 sm:w-20 bg-border rounded-t-lg h-[55%]" />
              <div className="w-20 sm:w-24 bg-border rounded-t-lg h-[82%]" />
              <div className="w-16 sm:w-20 bg-border rounded-t-lg h-[42%]" />
            </div>
          </div>

          <div className="card animate-pulse min-h-80">
            <div className="h-7 bg-border rounded w-42 mb-2" />
            <div className="h-4 bg-border rounded w-56 mb-5" />
            <div className="content mt-2 grid grid-cols-2 gap-4 flex-1">
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-border" />
              </div>
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-border" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
          <div className="card animate-pulse min-h-110">
            <div className="h-7 bg-border rounded w-44 mb-2" />
            <div className="h-4 bg-border rounded w-64 mb-5" />
            <div className="content flex-1 w-full flex items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-border" />
            </div>
          </div>

          <div className="card animate-pulse min-h-110">
            <div className="h-7 bg-border rounded w-52 mb-2" />
            <div className="h-4 bg-border rounded w-72 mb-5" />
            <div className="content flex-1 min-h-75 w-full flex items-end justify-around gap-2 pb-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full bg-border rounded-t-sm ${barHeightClasses[i % barHeightClasses.length]}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
