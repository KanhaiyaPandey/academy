export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin mx-auto mb-4"
          style={{ borderTopColor: "#a855f7" }}
        />
        <p className="text-gray-400 text-sm font-medium">Loading admission form...</p>
      </div>
    </div>
  );
}
