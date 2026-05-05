export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="h-10 w-40 bg-gray-200 rounded-xl animate-pulse mx-auto" />
          <div className="h-5 w-72 bg-gray-100 rounded-lg animate-pulse mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info skeleton */}
          <div className="space-y-4">
            <div className="h-7 w-36 bg-gray-200 rounded animate-pulse" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Form skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
            <div className="h-7 w-44 bg-gray-200 rounded animate-pulse" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
            <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
