import CalendarApp from '@/components/Calendar';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <CalendarApp />
    </main>
  );
}
