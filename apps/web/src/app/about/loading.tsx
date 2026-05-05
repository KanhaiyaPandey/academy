export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="h-12 w-80 bg-white/20 rounded-xl animate-pulse mx-auto" />
          <div className="h-5 w-96 bg-white/10 rounded-lg animate-pulse mx-auto" />
        </div>
      </div>

      {/* Story skeleton */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl p-6 h-36 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
