interface PanduanApiPageProps {
  onBack: () => void;
}

const steps = [
  {
    step: 1,
    title: 'Buka Halaman API Keys',
    text: 'Kunjungi halaman manajemen API Key di situs APIFree.ai:',
    link: 'https://www.apifree.ai/manage/api-keys',
  },
  {
    step: 2,
    title: 'Login atau Daftar',
    text: 'Login dengan akun yang sudah ada, atau daftar akun baru jika belum memiliki.',
  },
  {
    step: 3,
    title: 'Buat API Key Baru',
    text: 'Klik tombol "Create" atau "Buat API Key Baru" untuk membuat API Key.',
  },
  {
    step: 4,
    title: 'Salin API Key',
    text: 'Salin API Key yang telah dibuat. Pastikan menyimpannya di tempat yang aman.',
  },
  {
    step: 5,
    title: 'Tempelkan di Aplikasi',
    text: 'Tempelkan API Key tersebut pada kolom "API Key Anda" di halaman utama aplikasi ini.',
  },
];

export function PanduanApiPage({ onBack }: PanduanApiPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/60">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            ← Kembali
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              📖 Panduan API Key
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Cara mendapatkan API Key untuk menggunakan aplikasi ini
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-8">
          {/* Intro Card */}
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-3">
              Apa itu API Key?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              API Key adalah kunci akses unik yang diperlukan untuk menggunakan
              layanan SkyReels AI. Setiap pengguna memiliki API Key sendiri yang
              digunakan untuk mengautentikasi permintaan ke server AI. API Key
              Anda bersifat rahasia dan tidak boleh dibagikan kepada orang lain.
            </p>
          </div>

          {/* Steps */}
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-purple-300 mb-6">
              🚀 Langkah Mendapatkan API Key
            </h2>

            <div className="space-y-6">
              {steps.map(({ step, title, text, link }) => (
                <div
                  key={step}
                  className="flex gap-4 items-start animate-fade-in"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20">
                    {step}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold text-white mb-1">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {text}
                    </p>
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-purple-400 hover:text-purple-300 text-sm underline underline-offset-2 transition-colors break-all"
                      >
                        🔗 {link}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5">
            <div className="flex gap-3 items-start">
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-300 mb-1">
                  Keamanan API Key
                </h3>
                <ul className="text-yellow-200/80 text-sm space-y-1 leading-relaxed">
                  <li>
                    • Jaga kerahasiaan API Key Anda. Jangan bagikan kepada orang
                    lain.
                  </li>
                  <li>
                    • API Key Anda hanya disimpan di browser dan{' '}
                    <strong>tidak</strong> dikirim ke server kami.
                  </li>
                  <li>
                    • Jika API Key Anda bocor, segera buat API Key baru dan hapus
                    yang lama.
                  </li>
                  <li>
                    • Penggunaan API mungkin dikenakan biaya sesuai paket Anda di
                    apifree.ai.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* File Upload Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
            <div className="flex gap-3 items-start">
              <span className="text-2xl flex-shrink-0">💡</span>
              <div>
                <h3 className="font-semibold text-blue-300 mb-1">
                  Tips Upload File
                </h3>
                <ul className="text-blue-200/80 text-sm space-y-1 leading-relaxed">
                  <li>
                    • Anda bisa upload file langsung atau memasukkan URL publik.
                  </li>
                  <li>
                    • Jika upload gagal, gunakan mode "URL Langsung" dan upload
                    file Anda ke layanan hosting file seperti{' '}
                    <a
                      href="https://catbox.moe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-300"
                    >
                      catbox.moe
                    </a>{' '}
                    atau{' '}
                    <a
                      href="https://imgur.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-300"
                    >
                      imgur.com
                    </a>
                    .
                  </li>
                  <li>
                    • Foto avatar sebaiknya menampilkan wajah yang jelas,
                    menghadap ke depan.
                  </li>
                  <li>
                    • Audio sebaiknya berupa ucapan yang jelas dalam format MP3.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-600/25"
          >
            ← Kembali ke Generator
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 mt-12">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>Generator Avatar Berbicara AI — Menggunakan SkyReels API</p>
        </div>
      </footer>
    </div>
  );
}
