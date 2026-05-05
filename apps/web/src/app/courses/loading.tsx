export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse mx-auto" />
          <div className="h-5 w-96 bg-gray-100 rounded-lg animate-pulse mx-auto" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="h-32 bg-gray-100 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
