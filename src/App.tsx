import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { AvatarUpload } from './components/AvatarUpload';
import { AudioUpload } from './components/AudioUpload';
import { PromptInput } from './components/PromptInput';
import { GenerateButton } from './components/GenerateButton';
import { StatusDisplay } from './components/StatusDisplay';
import { VideoPlayer } from './components/VideoPlayer';
import { PanduanApiPage } from './components/PanduanApiPage';
import { uploadFile, submitVideoGeneration, startPolling } from './lib/api';

type Page = 'home' | 'panduan';

export default function App() {
  const [page, setPage] = useState<Page>('home');

  // Form state
  const [apiKey, setApiKey] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [prompt, setPrompt] = useState('');

  // Process state
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  // Polling cleanup ref
  const stopPollingRef = useRef<(() => void) | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (stopPollingRef.current) {
        stopPollingRef.current();
      }
    };
  }, []);

  const handleAvatarFileChange = useCallback(
    (file: File | null, preview: string | null) => {
      setAvatarFile(file);
      setAvatarPreview(preview);
    },
    []
  );

  const handleAudioFileChange = useCallback(
    (file: File | null, preview: string | null) => {
      setAudioFile(file);
      setAudioPreview(preview);
    },
    []
  );

  const resetProcess = useCallback(() => {
    if (stopPollingRef.current) {
      stopPollingRef.current();
      stopPollingRef.current = null;
    }
    setLoading(false);
    setStatus('');
    setStatusMessage('');
    setVideoUrl('');
    setError('');
  }, []);

  const handleGenerate = useCallback(async () => {
    // Validate inputs
    if (!apiKey.trim()) {
      setError('Silakan masukkan API Key Anda terlebih dahulu.');
      return;
    }

    const hasAvatar = avatarFile || avatarUrl.trim();
    const hasAudio = audioFile || audioUrl.trim();

    if (!hasAvatar) {
      setError(
        'Silakan upload foto avatar atau masukkan URL gambar avatar.'
      );
      return;
    }

    if (!hasAudio) {
      setError(
        'Silakan upload audio MP3 atau masukkan URL file audio.'
      );
      return;
    }

    if (!prompt.trim()) {
      setError('Silakan masukkan deskripsi atau prompt untuk video.');
      return;
    }

    // Reset previous state
    resetProcess();
    setLoading(true);
    setError('');

    try {
      // Step 1: Get file URLs
      let finalAvatarUrl = avatarUrl.trim();
      let finalAudioUrl = audioUrl.trim();

      // Upload avatar if file is provided and no URL given
      if (avatarFile && !finalAvatarUrl) {
        setStatus('uploading');
        setStatusMessage('Mengunggah foto avatar');

        try {
          finalAvatarUrl = await uploadFile(avatarFile);
        } catch (e) {
          console.error('Avatar upload error:', e);
          setStatus('error');
          setStatusMessage('Gagal mengunggah foto avatar');
          setError(
            'Gagal mengunggah foto avatar ke server hosting. Silakan gunakan mode "URL Langsung" dan masukkan URL gambar yang sudah di-upload ke layanan hosting file (misalnya catbox.moe, imgur.com).'
          );
          setLoading(false);
          return;
        }
      }

      // Upload audio if file is provided and no URL given
      if (audioFile && !finalAudioUrl) {
        setStatus('uploading');
        setStatusMessage('Mengunggah file audio');

        try {
          finalAudioUrl = await uploadFile(audioFile);
        } catch (e) {
          console.error('Audio upload error:', e);
          setStatus('error');
          setStatusMessage('Gagal mengunggah file audio');
          setError(
            'Gagal mengunggah file audio ke server hosting. Silakan gunakan mode "URL Langsung" dan masukkan URL audio yang sudah di-upload ke layanan hosting file (misalnya catbox.moe).'
          );
          setLoading(false);
          return;
        }
      }

      // Step 2: Submit to SkyReels API
      setStatus('submitting');
      setStatusMessage('Mengirim permintaan ke SkyReels API');

      let requestId: string;
      try {
        requestId = await submitVideoGeneration(
          apiKey.trim(),
          finalAvatarUrl,
          finalAudioUrl,
          prompt.trim()
        );
      } catch (e) {
        console.error('Submit error:', e);
        setStatus('error');
        setStatusMessage('Gagal mengirim permintaan');
        setError(
          e instanceof Error
            ? `Terjadi kesalahan saat mengirim permintaan: ${e.message}`
            : 'Terjadi kesalahan saat mengirim permintaan ke API.'
        );
        setLoading(false);
        return;
      }

      // Step 3: Start polling
      setStatus('processing');
      setStatusMessage('Sedang membuat video... Mohon tunggu');

      stopPollingRef.current = startPolling(apiKey.trim(), requestId, {
        onStatusUpdate: (pollStatus) => {
          if (pollStatus === 'processing') {
            setStatus('processing');
            setStatusMessage('Sedang membuat video... Mohon tunggu');
          }
        },
        onSuccess: (videos) => {
          setStatus('success');
          setStatusMessage('Video berhasil dibuat! 🎉');
          if (videos.length > 0) {
            setVideoUrl(videos[0]);
          }
          setLoading(false);
        },
        onError: (errorMsg) => {
          setStatus('error');
          setStatusMessage('Terjadi kesalahan saat membuat video');
          setError(errorMsg || 'Terjadi kesalahan yang tidak diketahui.');
          setLoading(false);
        },
      });
    } catch (e) {
      console.error('Unexpected error:', e);
      setStatus('error');
      setStatusMessage('Terjadi kesalahan');
      setError(
        e instanceof Error
          ? e.message
          : 'Terjadi kesalahan yang tidak diketahui.'
      );
      setLoading(false);
    }
  }, [apiKey, avatarFile, avatarUrl, audioFile, audioUrl, prompt, resetProcess]);

  // Render guide page
  if (page === 'panduan') {
    return <PanduanApiPage onBack={() => setPage('home')} />;
  }

  const isFormValid =
    apiKey.trim() &&
    (avatarFile || avatarUrl.trim()) &&
    (audioFile || audioUrl.trim()) &&
    prompt.trim();

  const hasResult = status || videoUrl || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">
              🎭
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                Generator Avatar Berbicara AI
              </h1>
              <p className="text-gray-500 text-xs hidden sm:block">
                Powered by SkyReels API
              </p>
            </div>
          </div>
          <button
            onClick={() => setPage('panduan')}
            className="text-sm px-4 py-2 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 rounded-xl transition-all text-gray-300 hover:text-white flex items-center gap-2"
          >
            <span className="hidden sm:inline">📖 Panduan API</span>
            <span className="sm:hidden">📖</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
            Buat Video{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Avatar Berbicara
            </span>{' '}
            dengan AI
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Upload foto avatar dan audio, lalu biarkan AI membuat video avatar
            yang berbicara secara realistis. Cukup masukkan API Key Anda untuk
            memulai.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form Column - Left (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/60 rounded-2xl p-5 md:p-7 shadow-2xl shadow-purple-500/5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                  ⚙️ Pengaturan Video
                </h2>
                {loading && (
                  <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full animate-pulse">
                    Sedang Memproses
                  </span>
                )}
              </div>

              <ApiKeyInput
                value={apiKey}
                onChange={setApiKey}
                onNavigatePanduan={() => setPage('panduan')}
              />

              <div className="border-t border-gray-800/40" />

              <AvatarUpload
                file={avatarFile}
                url={avatarUrl}
                previewUrl={avatarPreview}
                onFileChange={handleAvatarFileChange}
                onUrlChange={setAvatarUrl}
              />

              <AudioUpload
                file={audioFile}
                url={audioUrl}
                previewUrl={audioPreview}
                onFileChange={handleAudioFileChange}
                onUrlChange={setAudioUrl}
              />

              <div className="border-t border-gray-800/40" />

              <PromptInput value={prompt} onChange={setPrompt} />

              <GenerateButton
                onClick={handleGenerate}
                disabled={!isFormValid}
                loading={loading}
              />

              {!isFormValid && !loading && (
                <p className="text-xs text-center text-gray-500">
                  Isi semua kolom di atas untuk mengaktifkan tombol generate.
                </p>
              )}
            </div>
          </div>

          {/* Result Column - Right (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/60 rounded-2xl p-5 md:p-7 shadow-2xl shadow-purple-500/5 space-y-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                📺 Hasil Video
              </h2>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 animate-fade-in">
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">❌</span>
                    <div>
                      <p className="text-red-300 text-sm font-medium mb-1">
                        Terjadi Kesalahan
                      </p>
                      <p className="text-red-400/80 text-xs leading-relaxed">
                        {error}
                      </p>
                    </div>
                  </div>
                  {!loading && (
                    <button
                      onClick={resetProcess}
                      className="mt-3 text-xs text-red-300 hover:text-white bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Tutup pesan ini
                    </button>
                  )}
                </div>
              )}

              {/* Status Display */}
              {status && (
                <StatusDisplay status={status} statusMessage={statusMessage} />
              )}

              {/* Video Player */}
              {videoUrl && <VideoPlayer videoUrl={videoUrl} />}

              {/* Empty State */}
              {!hasResult && (
                <div className="text-center py-12 md:py-16 text-gray-500">
                  <div className="text-7xl mb-4 opacity-50">🎬</div>
                  <p className="text-lg font-medium text-gray-400">
                    Video Anda akan muncul di sini
                  </p>
                  <p className="text-sm mt-2 max-w-[250px] mx-auto leading-relaxed">
                    Isi formulir di samping dan klik "Buat Video Avatar" untuk
                    memulai
                  </p>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="bg-gray-900/30 border border-gray-800/40 rounded-2xl p-5 text-sm text-gray-400 space-y-3">
              <p className="font-semibold text-gray-300 flex items-center gap-2">
                💡 Tips & Informasi
              </p>
              <ul className="space-y-2 text-xs leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-purple-400 flex-shrink-0">•</span>
                  <span>
                    Gunakan foto wajah yang jelas, menghadap ke depan, dengan
                    pencahayaan baik.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 flex-shrink-0">•</span>
                  <span>
                    Audio MP3 sebaiknya berisi ucapan yang jelas tanpa banyak
                    noise.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 flex-shrink-0">•</span>
                  <span>
                    Prompt yang detail dan spesifik menghasilkan video yang lebih
                    baik.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 flex-shrink-0">•</span>
                  <span>
                    Proses pembuatan video membutuhkan waktu sekitar 1-5 menit.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 flex-shrink-0">•</span>
                  <span>
                    Jika upload file gagal, gunakan mode "URL Langsung" dan
                    upload file ke{' '}
                    <a
                      href="https://catbox.moe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 underline"
                    >
                      catbox.moe
                    </a>{' '}
                    terlebih dahulu.
                  </span>
                </li>
              </ul>
            </div>

            {/* Model Info */}
            <div className="bg-gray-900/30 border border-gray-800/40 rounded-2xl p-5 text-sm space-y-2">
              <p className="font-semibold text-gray-300 flex items-center gap-2">
                🤖 Model AI
              </p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-gray-800 text-purple-300 px-3 py-1.5 rounded-lg font-mono break-all">
                  skywork-ai/skyreels-v3/standard/single-avatar
                </code>
              </div>
              <p className="text-xs text-gray-500">
                Model SkyReels v3 untuk membuat avatar tunggal berbicara.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/60">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm space-y-1">
          <p className="font-medium">
            🎭 Generator Avatar Berbicara AI
          </p>
          <p className="text-xs">
            Menggunakan SkyReels API — API Key Anda hanya disimpan di browser
          </p>
        </div>
      </footer>
    </div>
  );
}
