import { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { usePomodoroStore } from '@/store/pomodoroStore';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { config, updateConfig } = usePomodoroStore();
  const [focusMinutes, setFocusMinutes] = useState(config.focusDuration);
  const [breakMinutes, setBreakMinutes] = useState(config.breakDuration);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSave = () => {
    if (focusMinutes < 1 || focusMinutes > 120) {
      setError('专注时长需在 1-120 分钟之间');
      return;
    }
    if (breakMinutes < 1 || breakMinutes > 60) {
      setError('休息时长需在 1-60 分钟之间');
      return;
    }
    setError('');
    updateConfig({ focusDuration: focusMinutes, breakDuration: breakMinutes });
    onClose();
  };

  const handleCancel = () => {
    setFocusMinutes(config.focusDuration);
    setBreakMinutes(config.breakDuration);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={cn(
          'w-full max-w-sm rounded-3xl bg-white shadow-2xl p-6',
          'animate-in fade-in zoom-in-95 duration-200'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            时长设置
          </h2>
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              专注时长（分钟）
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-tomato-400 focus:border-transparent
                         transition-all text-center text-lg font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              休息时长（分钟）
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-mint-400 focus:border-transparent
                         transition-all text-center text-lg font-mono"
            />
          </div>

          {error && (
            <p className="text-sm text-tomato-500 text-center">{error}</p>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-xl font-medium text-gray-600
                       bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl font-medium text-white
                       bg-tomato-500 hover:bg-tomato-600 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
