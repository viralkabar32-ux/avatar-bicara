import { useRef, useState } from 'react';

interface AudioUploadProps {
  file: File | null;
  url: string;
  previewUrl: string | null;
  onFileChange: (file: File | null, previewUrl: string | null) => void;
  onUrlChange: (url: string) => void;
}

export function AudioUpload({
  file,
  url,
  previewUrl,
  onFileChange,
  onUrlChange,
}: AudioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const preview = URL.createObjectURL(f);
      onFileChange(f, preview);
    }
  };

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onFileChange(null, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        🎵 Audio MP3
      </label>

      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
            mode === 'upload'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-gray-700/60 text-gray-400 hover:text-gray-300'
          }`}
        >
          📁 Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
            mode === 'url'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-gray-700/60 text-gray-400 hover:text-gray-300'
          }`}
        >
          🔗 URL Langsung
        </button>
      </div>

      {mode === 'upload' ? (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500/60 hover:bg-purple-500/5 transition-all group"
          >
            {previewUrl && file ? (
              <div className="space-y-3">
                <div className="text-4xl">🎶</div>
                <div>
                  <p className="text-sm text-green-400 font-medium truncate max-w-full px-4">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <audio
                  controls
                  src={previewUrl}
                  className="mx-auto max-w-full"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20"
                >
                  ✕ Hapus file
                </button>
              </div>
            ) : (
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                <div className="text-5xl mb-3">🎤</div>
                <p className="text-sm font-medium">
                  Klik untuk upload file audio
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  MP3, WAV, OGG — Maks 25MB
                </p>
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/x-wav,.mp3,.wav,.ogg"
            onChange={handleFile}
            className="hidden"
          />
        </>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com/audio.mp3"
            className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all"
          />
          <p className="text-xs text-gray-500">
            Masukkan URL publik file audio yang dapat diakses langsung.
          </p>
        </div>
      )}
    </div>
  );
}
