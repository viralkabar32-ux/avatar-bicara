import { useRef, useState } from 'react';

interface AvatarUploadProps {
  file: File | null;
  url: string;
  previewUrl: string | null;
  onFileChange: (file: File | null, previewUrl: string | null) => void;
  onUrlChange: (url: string) => void;
}

export function AvatarUpload({
  file,
  url,
  previewUrl,
  onFileChange,
  onUrlChange,
}: AvatarUploadProps) {
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

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        🖼️ Foto Avatar
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
            {previewUrl ? (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  className="max-h-48 mx-auto rounded-lg shadow-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-lg transition-colors"
                >
                  ✕
                </button>
                <p className="text-xs text-gray-400 mt-3 truncate max-w-[200px]">
                  {file?.name}
                </p>
              </div>
            ) : (
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                <div className="text-5xl mb-3">📷</div>
                <p className="text-sm font-medium">
                  Klik untuk upload gambar avatar
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP — Maks 10MB
                </p>
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
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
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all"
          />
          {url && (
            <div className="rounded-lg overflow-hidden border border-gray-700 max-w-[200px]">
              <img
                src={url}
                alt="Preview"
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <p className="text-xs text-gray-500">
            Masukkan URL publik gambar yang dapat diakses langsung.
          </p>
        </div>
      )}
    </div>
  );
}
