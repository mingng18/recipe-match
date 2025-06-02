export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow pb-20">
        {/* Ensure padding accommodates the navbar */}
        {children}
      </main>
    </div>
  );
}
