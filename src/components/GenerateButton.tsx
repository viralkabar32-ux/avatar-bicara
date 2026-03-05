interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function GenerateButton({ onClick, disabled, loading }: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 disabled:from-gray-700 disabled:via-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 shadow-xl shadow-purple-600/25 disabled:shadow-none relative overflow-hidden group"
    >
      {loading && (
        <div className="absolute inset-0 animate-shimmer" />
      )}
      {loading ? (
        <span className="flex items-center justify-center gap-3 relative z-10">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Memproses...
        </span>
      ) : (
        <span className="relative z-10 flex items-center justify-center gap-2">
          🎬 Buat Video Avatar
        </span>
      )}
    </button>
  );
}
