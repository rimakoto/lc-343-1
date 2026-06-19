import PomodoroWidget from '@/components/PomodoroWidget';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-zinc-100 p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-tomato-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-mint-200/30 blur-3xl" />
      </div>
      <div className="relative">
        <PomodoroWidget />
        <p className="text-center text-gray-400 text-xs mt-6 font-mono">
          专注当下 · 高效生活
        </p>
      </div>
    </div>
  );
}