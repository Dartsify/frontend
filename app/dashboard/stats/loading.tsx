export default function StatsLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 animate-pulse">
      <div className="h-9 bg-gray-200 rounded-md w-64 mb-2" />

      {/* 10 StatCards Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-[90px]"
          >
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>

      {/* 2 Ratios Cards Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-64">
          <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-2" />
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-6" />
          <div className="flex-1 flex items-end justify-center gap-4">
            <div className="w-16 sm:w-20 bg-gray-200 rounded-t-lg h-[60%]" />
            <div className="w-20 sm:w-24 bg-gray-200 rounded-t-lg h-[85%]" />
            <div className="w-16 sm:w-20 bg-gray-200 rounded-t-lg h-[45%]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-64">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gray-200" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* 2 Bottom Cards Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center h-[420px]">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 self-start" />
          <div className="w-64 h-64 rounded-full bg-gray-200 mt-4" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[420px]">
          <div className="h-6 bg-gray-200 rounded w-64 mb-6" />
          <div className="flex-1 flex items-end justify-around pb-6 gap-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="w-full bg-gray-200 rounded-t-sm"
                style={{ height: `${Math.max(10, Math.random() * 100)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
