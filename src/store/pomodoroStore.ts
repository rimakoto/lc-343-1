import { create } from 'zustand';
import {
  type PomodoroConfig,
  loadConfig,
  saveConfig,
  getTodayCompleted,
  incrementTodayCompleted,
} from '@/utils/storage';

export type TimerMode = 'focus' | 'break';
export type TimerStatus = 'idle' | 'running' | 'paused';

interface PomodoroState {
  config: PomodoroConfig;
  mode: TimerMode;
  status: TimerStatus;
  remainingSeconds: number;
  todayCompleted: number;
  setMode: (mode: TimerMode) => void;
  setStatus: (status: TimerStatus) => void;
  setRemainingSeconds: (seconds: number) => void;
  decrementRemaining: () => void;
  resetToDefault: () => void;
  updateConfig: (config: Partial<PomodoroConfig>) => void;
  completePomodoro: () => void;
}

function getDefaultSeconds(config: PomodoroConfig, mode: TimerMode): number {
  const minutes = mode === 'focus' ? config.focusDuration : config.breakDuration;
  return minutes * 60;
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  config: loadConfig(),
  mode: 'focus',
  status: 'idle',
  remainingSeconds: getDefaultSeconds(loadConfig(), 'focus'),
  todayCompleted: getTodayCompleted(),

  setMode: (mode) => {
    const { config } = get();
    set({ mode, remainingSeconds: getDefaultSeconds(config, mode), status: 'idle' });
  },

  setStatus: (status) => set({ status }),

  setRemainingSeconds: (seconds) => set({ remainingSeconds: seconds }),

  decrementRemaining: () => {
    const { remainingSeconds } = get();
    set({ remainingSeconds: Math.max(0, remainingSeconds - 1) });
  },

  resetToDefault: () => {
    const { config, mode } = get();
    set({ remainingSeconds: getDefaultSeconds(config, mode), status: 'idle' });
  },

  updateConfig: (partial) => {
    const { config, mode } = get();
    const newConfig = { ...config, ...partial };
    saveConfig(newConfig);
    set({ config: newConfig, remainingSeconds: getDefaultSeconds(newConfig, mode), status: 'idle' });
  },

  completePomodoro: () => {
    const { mode } = get();
    const newCount = incrementTodayCompleted();
    const nextMode: TimerMode = mode === 'focus' ? 'break' : 'focus';
    const newConfig = get().config;
    set({
      mode: nextMode,
      status: 'running',
      remainingSeconds: getDefaultSeconds(newConfig, nextMode),
      todayCompleted: newCount,
    });
  },
}));
