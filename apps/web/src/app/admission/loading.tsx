export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-full border-4 border-pink-100 border-t-pink-500 animate-spin mx-auto mb-4"
          style={{ borderTopColor: "#ec4899" }}
        />
        <p className="text-gray-400 text-sm font-medium">Loading admission form...</p>
      </div>
    </div>
  );
}
