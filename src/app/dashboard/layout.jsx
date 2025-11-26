import Sidebar from "@/components/navigationAndRelated/Sidebar";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar />

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
