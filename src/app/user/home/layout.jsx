

export default function homeLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-muted">

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
