interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PromptInput({ value, onChange }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        ✍️ Deskripsi atau Prompt
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Contoh: Seorang wanita tersenyum dan berbicara dengan ekspresi ramah, menghadap ke kamera dengan latar belakang kantor modern..."
        className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all resize-none leading-relaxed"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Deskripsikan gerakan, ekspresi, dan latar belakang yang diinginkan.
        </p>
        <span className="text-xs text-gray-600">{value.length} karakter</span>
      </div>
    </div>
  );
}
