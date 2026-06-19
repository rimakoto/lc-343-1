import { useEffect, useRef, useCallback } from 'react';
import { usePomodoroStore, type TimerMode } from '@/store/pomodoroStore';

function triggerVibration(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200]);
    } catch {
      // ignore
    }
  }
}

export function useTimer() {
  const {
    mode,
    status,
    remainingSeconds,
    config,
    decrementRemaining,
    completePomodoro,
    resetToDefault,
    setStatus,
  } = usePomodoroStore();

  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef<((mode: TimerMode) => void) | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (status === 'running') return;
    setStatus('running');
  }, [status, setStatus]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    setStatus('paused');
  }, [status, setStatus]);

  const reset = useCallback(() => {
    clearTimer();
    resetToDefault();
  }, [clearTimer, resetToDefault]);

  const handleTick = useCallback(() => {
    const { remainingSeconds: currentRemaining } = usePomodoroStore.getState();
    if (currentRemaining <= 1) {
      clearTimer();
      triggerVibration();
      const currentMode = usePomodoroStore.getState().mode;
      if (onCompleteRef.current) {
        onCompleteRef.current(currentMode);
      }
      completePomodoro();
    } else {
      decrementRemaining();
    }
  }, [clearTimer, completePomodoro, decrementRemaining]);

  useEffect(() => {
    clearTimer();
    if (status === 'running') {
      intervalRef.current = window.setInterval(handleTick, 1000);
    }
    return clearTimer;
  }, [status, clearTimer, handleTick]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const totalSeconds = (mode === 'focus' ? config.focusDuration : config.breakDuration) * 60;
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;

  return {
    mode,
    status,
    remainingSeconds,
    progress,
    totalSeconds,
    start,
    pause,
    reset,
  };
}
