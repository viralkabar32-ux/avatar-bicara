import { useState } from 'react';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  onNavigatePanduan: () => void;
}

export function ApiKeyInput({ value, onChange, onNavigatePanduan }: ApiKeyInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          🔑 API Key Anda
        </label>
        <button
          type="button"
          onClick={onNavigatePanduan}
          className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
        >
          Cara mendapatkan API Key?
        </button>
      </div>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Masukkan API Key dari apifree.ai"
          className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all pr-24"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-xs px-2 py-1 rounded bg-gray-700/50 hover:bg-gray-600/50"
        >
          {show ? '🙈 Sembunyikan' : '👁️ Tampilkan'}
        </button>
      </div>
      <p className="text-xs text-gray-500">
        API Key hanya disimpan di browser Anda, tidak dikirim ke server kami.
      </p>
    </div>
  );
}
