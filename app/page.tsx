"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, ShieldCheck, UserCircle, ArrowRight, Menu, X, Clock, Star, Archive, GraduationCap } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const features = [
    {
      icon: Clock,
      title: "Tracking Real-time",
      description: "Pantau status peminjaman barang dan inventaris sekolah secara langsung"
    },
    {
      icon: ShieldCheck,
      title: "Manajemen Terpusat",
      description: "Sistem verifikasi untuk keamanan sarana dan prasarana sekolah"
    },
    {
      icon: GraduationCap,
      title: "Portal Pendidikan",
      description: "Dirancang untuk memudahkan kebutuhan belajar mengajar"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* Navigation Header */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-100">
                <Archive className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                SIPERBAR
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-blue-600 font-bold text-sm uppercase tracking-wider transition-colors">
                Fitur
              </Link>
              <Link href="#about" className="text-slate-600 hover:text-blue-600 font-bold text-sm uppercase tracking-wider transition-colors">
                Tentang
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-blue-600 font-bold">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6">Daftar</Button>
              </Link>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto text-center space-y-16"
        >
          {/* Hero Content */}
          <div className="space-y-8">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-4"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Portal Sarpras Sekolah Digital</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Sistem Informasi <br/>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Peminjaman Barang
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
              Kelola inventaris sarana dan prasarana sekolah Anda dengan sistem yang cerdas, transparan, dan efisien. 
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/auth/register">
                <Button className="bg-slate-900 hover:bg-black text-white px-10 py-7 rounded-2xl font-bold text-xl shadow-2xl shadow-slate-200 transition-all duration-300 active:scale-95">
                  Mulai Peminjaman <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <motion.div 
            id="features"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 pt-16"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="group hover:shadow-2xl transition-all duration-500 border border-slate-100 bg-white rounded-[2.5rem] overflow-hidden h-full">
                  <CardHeader className="pt-10 pb-4">
                    <div className="mx-auto bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
                      <feature.icon className="h-10 w-10 text-slate-900 group-hover:text-white transition-colors duration-500" />
                    </div>
                    <CardTitle className="pt-8 text-2xl font-black text-slate-900 text-center tracking-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-12 px-8">
                    <p className="text-slate-500 text-center leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* User Roles Cards */}
          <div className="pt-24 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Akses Portal Sesuai Role</h2>
              <p className="text-slate-500 font-medium">Pilih kategori akun Anda untuk masuk ke sistem</p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {/* Peminjam Card */}
              <motion.div variants={itemVariants}>
                <Card className="group hover:shadow-xl transition-all duration-500 border border-slate-100 bg-white rounded-3xl overflow-hidden h-full">
                  <CardHeader className="pt-8 pb-4">
                    <div className="mx-auto bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center">
                      <UserCircle className="h-7 w-7 text-blue-600" />
                    </div>
                    <CardTitle className="pt-4 text-xl font-bold text-slate-900 text-center">
                      Siswa / Guru
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-10 px-8 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                      Ajukan peminjaman barang praktik atau sarana sekolah lainnya.
                    </p>
                    <Link href="/auth/login" className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold">
                        Masuk Peminjam
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Petugas Card */}
              <motion.div variants={itemVariants}>
                <Card className="group hover:shadow-xl transition-all duration-500 border border-slate-100 bg-white rounded-3xl overflow-hidden h-full">
                  <CardHeader className="pt-8 pb-4">
                    <div className="mx-auto bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center">
                      <ShieldCheck className="h-7 w-7 text-emerald-600" />
                    </div>
                    <CardTitle className="pt-4 text-xl font-bold text-slate-900 text-center">
                      Staf Sarpras
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-10 px-8 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                      Kelola stok barang, verifikasi pengembalian, dan bantuan teknis.
                    </p>
                    <Link href="/auth/login" className="block">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-bold">
                        Masuk Petugas
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Admin Card */}
              <motion.div variants={itemVariants}>
                <Card className="group hover:shadow-xl transition-all duration-500 border border-slate-100 bg-white rounded-3xl overflow-hidden h-full">
                  <CardHeader className="pt-8 pb-4">
                    <div className="mx-auto bg-slate-100 w-14 h-14 rounded-2xl flex items-center justify-center">
                      <Package className="h-7 w-7 text-slate-900" />
                    </div>
                    <CardTitle className="pt-4 text-xl font-bold text-slate-900 text-center">
                      Administrator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-10 px-8 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                      Kendali penuh manajemen data sekolah, laporan, dan audit sistem.
                    </p>
                    <Link href="/auth/login" className="block">
                      <Button className="w-full bg-slate-900 hover:bg-black h-12 rounded-xl font-bold">
                        Masuk Admin
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6 col-span-2">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-900 p-2 rounded-xl">
                  <Archive className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter">SIPERBAR</span>
              </div>
              <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
                Sistem Informasi Peminjaman Barang Sekolah. Solusi modern untuk transparansi sarana dan prasarana pendidikan.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Layanan</h3>
              <ul className="space-y-4 text-sm font-semibold text-slate-500">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Peminjaman Barang</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Cek Inventaris</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Laporan Kerusakan</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Sekolah</h3>
              <ul className="space-y-4 text-sm font-semibold text-slate-500">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Profil Sekolah</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Kontak Kami</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Bantuan</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">&copy; 2026 SIPERBAR - Sistem Informasi Peminjaman Barang. Hak cipta dilindungi.</p>
            <div className="flex gap-6">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Professional School Edition</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}