export interface PomodoroConfig {
  focusDuration: number;
  breakDuration: number;
}

export interface DailyRecord {
  date: string;
  completedPomodoros: number;
}

const CONFIG_KEY = 'pomodoro_config';
const RECORDS_KEY = 'pomodoro_records';

const DEFAULT_CONFIG: PomodoroConfig = {
  focusDuration: 25,
  breakDuration: 5,
};

export function loadConfig(): PomodoroConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      focusDuration: parsed.focusDuration ?? DEFAULT_CONFIG.focusDuration,
      breakDuration: parsed.breakDuration ?? DEFAULT_CONFIG.breakDuration,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: PomodoroConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function loadRecords(): DailyRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DailyRecord[];
  } catch {
    return [];
  }
}

export function saveRecords(records: DailyRecord[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayCompleted(): number {
  const records = loadRecords();
  const today = getTodayDateStr();
  const todayRecord = records.find((r) => r.date === today);
  return todayRecord?.completedPomodoros ?? 0;
}

export function incrementTodayCompleted(): number {
  const records = loadRecords();
  const today = getTodayDateStr();
  const idx = records.findIndex((r) => r.date === today);
  if (idx >= 0) {
    records[idx].completedPomodoros += 1;
  } else {
    records.push({ date: today, completedPomodoros: 1 });
  }
  saveRecords(records);
  return getTodayCompleted();
}
