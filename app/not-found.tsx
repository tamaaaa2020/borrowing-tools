"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Icon */}
        <div className="mx-auto bg-gradient-to-br from-blue-100 to-emerald-100 w-32 h-32 rounded-3xl flex items-center justify-center">
          <Wrench className="h-16 w-16 text-blue-600" />
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-slate-900">404</h1>
          <h2 className="text-2xl font-semibold text-slate-800">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin telah dipindahkan atau tidak lagi tersedia.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="gradient" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </button>
        </div>
        
        {/* Footer */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator.
          </p>
        </div>
      </div>
    </div>
  );
}