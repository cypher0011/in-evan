export default function Loading() {
  return (
    <div className="relative z-10 flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
        <p className="text-white/80 text-sm">Loading...</p>
      </div>
    </div>
  );
}
