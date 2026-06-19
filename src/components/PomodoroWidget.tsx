import { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { usePomodoroStore, type TimerMode } from '@/store/pomodoroStore';
import CircleProgress from '@/components/CircleProgress';
import SettingsModal from '@/components/SettingsModal';
import { cn } from '@/lib/utils';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const modeStyles: Record<TimerMode, { bg: string; ring: string; text: string; badge: string; label: string; icon: React.ReactNode }> = {
  focus: {
    bg: 'bg-gradient-to-br from-tomato-400 via-tomato-500 to-tomato-600',
    ring: 'stroke-white',
    text: 'text-white',
    badge: 'bg-white/20 text-white',
    label: '专注中',
    icon: null,
  },
  break: {
    bg: 'bg-gradient-to-br from-mint-400 via-mint-500 to-mint-600',
    ring: 'stroke-white',
    text: 'text-white',
    badge: 'bg-white/20 text-white',
    label: '休息中',
    icon: <Coffee className="w-4 h-4" />,
  },
};

export default function PomodoroWidget() {
  const { mode, status, remainingSeconds, progress, start, pause, reset } = useTimer();
  const { todayCompleted, config } = usePomodoroStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shaking, setShaking] = useState(false);

  const style = modeStyles[mode];
  const isRunning = status === 'running';

  const handleComplete = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 800);
  };

  return (
    <div
      className={cn(
        'relative w-[340px] min-h-[420px] rounded-[36px] p-6 flex flex-col items-center',
        'shadow-2xl overflow-hidden transition-all duration-700 ease-out',
        style.bg,
        shaking && 'animate-shake'
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      <div className="relative w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-white/60" />
          <span>今日已完成</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-white font-bold text-sm">
            {todayCompleted} <span className="text-white/70 font-normal">个番茄</span>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
            aria-label="设置"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center">
        <CircleProgress
          progress={progress}
          size={230}
          strokeWidth={10}
          colorClass={style.ring}
          trackClass="stroke-white/15"
          className={cn(isRunning && 'animate-pulse-ring')}
        >
          <div className={cn('flex flex-col items-center', style.text)}>
            <span className="font-mono text-6xl font-bold tracking-tight tabular-nums drop-shadow-sm">
              {formatTime(remainingSeconds)}
            </span>
          </div>
        </CircleProgress>
      </div>

      <div className="relative w-full flex flex-col items-center gap-5 mt-2">
        <div
          className={cn(
            'px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 backdrop-blur-sm',
            style.badge
          )}
        >
          {style.icon}
          <span>{style.label}</span>
        </div>

        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={start}
              className={cn(
                'flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base',
                'bg-white shadow-lg hover:shadow-xl hover:-translate-y-0.5',
                'active:translate-y-0 active:scale-95 transition-all duration-200',
                mode === 'focus' ? 'text-tomato-600' : 'text-mint-600'
              )}
            >
              <Play className="w-5 h-5 fill-current" />
              开始
            </button>
          ) : (
            <button
              onClick={pause}
              className={cn(
                'flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base',
                'bg-white/90 hover:bg-white shadow-lg hover:shadow-xl hover:-translate-y-0.5',
                'active:translate-y-0 active:scale-95 transition-all duration-200',
                mode === 'focus' ? 'text-tomato-600' : 'text-mint-600'
              )}
            >
              <Pause className="w-5 h-5 fill-current" />
              暂停
            </button>
          )}

          <button
            onClick={reset}
            className={cn(
              'p-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white',
              'backdrop-blur-sm active:scale-90 transition-all duration-200'
            )}
            aria-label="重置"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="text-white/60 text-xs font-mono">
          专注 {config.focusDuration}分 · 休息 {config.breakDuration}分
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
