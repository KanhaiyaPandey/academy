export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin mx-auto mb-4"
          style={{ borderTopColor: "#ec4899" }}
        />
        <p className="text-gray-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
