export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-gray-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-2 border-blue-500 animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
} 