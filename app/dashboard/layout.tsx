import { getSession } from "@/lib/auth";
import { logoutUser } from "@/actions/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package, User, LogOut, Wrench, BarChart3, Users, PackagePlus, History, MessageSquare, LibraryBig } from "lucide-react";
import { Suspense } from "react";
import MobileHeader from "@/components/MobileHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const getNavigationItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    ];

    switch (session.role) {
      case "ADMIN":
        return [
          ...baseItems,
          { href: "/dashboard/admin/users", label: "Pengguna", icon: Users },
          { href: "/dashboard/admin/alat", label: "Alat", icon: PackagePlus },
          { href: "/dashboard/admin/kategori", label: "Kategori", icon: Package },
          { href: "/dashboard/admin/rak", label: "Rak", icon: LibraryBig },
          { href: "/dashboard/admin/peminjaman", label: "Peminjaman", icon: History },
          { href: "/dashboard/admin/pengembalian", label: "Pengembalian", icon: History },
          { href: "/dashboard/admin/laporan", label: "Laporan", icon: BarChart3 },
          { href: "/dashboard/petugas/chat", label: "Chat CS", icon: MessageSquare },
        ];
      case "PETUGAS":
        return [
          ...baseItems,
          { href: "/dashboard/petugas/alat", label: "Alat", icon: PackagePlus },
          { href: "/dashboard/petugas/peminjaman", label: "Peminjaman", icon: History },
          { href: "/dashboard/petugas/chat", label: "Chat CS", icon: MessageSquare },
        ];
      case "PEMINJAM":
        return [
          ...baseItems,
          { href: "/dashboard/peminjam/alat", label: "Pinjam Alat", icon: PackagePlus },
          { href: "/dashboard/peminjam/riwayat", label: "Riwayat", icon: History },
          { href: "/dashboard/peminjam/chat", label: "Chat CS", icon: MessageSquare },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col md:flex-row">
      <MobileHeader 
        userName={session.name} 
        userRole={session.role} 
      />

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-100">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                SIPERBAR
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Peminjaman Barang</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                  >
                    <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{session.name}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase">{session.role}</p>
            </div>
          </div>
          
          <form action={logoutUser} className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
              <p className="text-xs text-slate-500">Selamat datang kembali, <span className="text-blue-600 font-semibold">{session.name}</span></p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Sistem Online</span>
              </div>
              
              <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-900">{session.name}</p>
                  <p className="text-[10px] text-blue-600 font-medium">{session.role}</p>
                </div>
                <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}