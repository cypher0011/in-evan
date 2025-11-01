export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}
