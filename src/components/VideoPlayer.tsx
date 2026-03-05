interface VideoPlayerProps {
  videoUrl: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  if (!videoUrl) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        🎬 Hasil Video Avatar
      </h3>

      <div className="rounded-xl overflow-hidden border border-gray-700 bg-black shadow-2xl shadow-purple-500/10">
        <video
          controls
          className="w-full rounded-lg"
          src={videoUrl}
          autoPlay
          playsInline
        >
          Browser Anda tidak mendukung pemutar video.
        </video>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-green-600/20 hover:shadow-green-500/30"
        >
          ⬇️ Unduh Video
        </a>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all text-sm font-medium"
        >
          🔗 Buka di Tab Baru
        </a>
      </div>
    </div>
  );
}
