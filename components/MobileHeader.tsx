"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Package, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/actions/auth";

interface MobileHeaderProps {
  userName: string;
  userRole: string;
}

export default function MobileHeader({ userName, userRole }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: "0%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40
      }
    }
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            SIPERBAR
          </span>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-white/95 backdrop-blur-lg z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/50">
              <span className="text-lg font-semibold text-slate-900">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{userName}</p>
                    <p className="text-sm text-slate-600 capitalize">{userRole}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                {userRole === "ADMIN" && (
                  <>
                    <Link href="/dashboard/admin/users" className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Pengguna</Link>
                    <Link href="/dashboard/admin/alat" className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Alat</Link>
                    <Link href="/dashboard/admin/kategori" className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Kategori</Link>
                    <Link href="/dashboard/admin/peminjaman" className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Peminjaman</Link>
                    <Link href="/dashboard/admin/pengembalian" className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Pengembalian</Link>
                    <Link href="/dashboard/admin/laporan" className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Laporan</Link>
                  </>
                )}

                {userRole === "PETUGAS" && (
                  <>
                    <Link href="/dashboard/petugas/alat" className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Alat</Link>
                    <Link href="/dashboard/petugas/peminjaman" className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Peminjaman</Link>
                  </>
                )}

                {userRole === "PEMINJAM" && (
                  <>
                    <Link href="/dashboard/peminjam/alat" className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Pinjam Alat</Link>
                    <Link href="/dashboard/peminjam/riwayat" className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Riwayat</Link>
                  </>
                )}

                <Link
                  href={userRole === "PEMINJAM" ? "/dashboard/peminjam/chat" : "/dashboard/petugas/chat"}
                  className="block px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Chat CS
                </Link>
              </div>
            </nav>

            <div className="p-4 border-t border-slate-200/50">
              <Button
                onClick={async () => {
                  setIsMenuOpen(false);
                  await logoutUser();
                }}
                variant="outline"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}