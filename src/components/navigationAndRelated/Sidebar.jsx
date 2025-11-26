

export default function Sidebar() {
  
  return (
    <aside className="w-64 min-h-screen bg-sidebar-primary text-sidebar-primary-foreground">
      

      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <nav className="space-y-3">
        <a href="/dashboard" className="block hover:text-primary">Home</a>
        <a href="/dashboard/books" className="block hover:text-primary">Kelola Buku</a>
        <a href="/dashboard/users" className="block hover:text-primary">Kelola User</a>
        <a href="/dashboard/staff" className="block hover:text-primary">Kelola Staff</a>
      </nav>
    </aside>
  );
}
