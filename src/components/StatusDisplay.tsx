import { useEffect, useState } from 'react';

interface StatusDisplayProps {
  status: string;
  statusMessage: string;
}

export function StatusDisplay({ status, statusMessage }: StatusDisplayProps) {
  const [dots, setDots] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (status === 'processing' || status === 'uploading' || status === 'submitting') {
      const dotInterval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
      return () => clearInterval(dotInterval);
    }
    setDots('');
  }, [status]);

  useEffect(() => {
    if (status === 'processing') {
      const timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (status !== 'processing') {
      setElapsedSeconds(0);
    }
  }, [status]);

  const getStatusStyle = () => {
    switch (status) {
      case 'uploading':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'submitting':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'processing':
        return 'border-orange-500/30 bg-orange-500/10';
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return '📤';
      case 'submitting':
        return '📡';
      case 'processing':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '🔄';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'uploading':
        return 'text-blue-300';
      case 'submitting':
        return 'text-yellow-300';
      case 'processing':
        return 'text-orange-300';
      case 'success':
        return 'text-green-300';
      case 'error':
        return 'text-red-300';
      default:
        return 'text-gray-300';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}d`;
    return `${secs}d`;
  };

  const isActive =
    status === 'processing' || status === 'uploading' || status === 'submitting';

  return (
    <div
      className={`p-4 rounded-xl border ${getStatusStyle()} animate-fade-in transition-all`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{getStatusIcon()}</span>
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${getStatusTextColor()}`}>
            {statusMessage}
            {isActive && dots}
          </p>

          {status === 'processing' && (
            <>
              <p className="text-xs text-gray-500 mt-1">
                Waktu berjalan: {formatTime(elapsedSeconds)}
              </p>
              <div className="mt-3 w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${Math.min(90, 10 + elapsedSeconds * 0.5)}%`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Polling status setiap 5 detik. Proses bisa memakan waktu 1-5 menit.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
