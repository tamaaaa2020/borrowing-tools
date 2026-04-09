"use client";

import { registerPeminjam } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError("");
    setSuccess("");
    setLoading(true);
    
    const res = await registerPeminjam(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      setSuccess(res.message || "Pendaftaran berhasil! Silakan login.");
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl">
            <CardContent className="pt-10 pb-10 text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CardTitle className="text-3xl font-bold text-slate-800">Pendaftaran Berhasil!</CardTitle>
                <p className="text-slate-600 mt-2">
                  {success}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-slate-500 mt-2">Mengarahkan ke halaman login...</p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pt-10 pb-6 text-center bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mx-auto bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
            >
              <UserPlus className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Daftar Akun Baru</CardTitle>
            <p className="text-blue-100 text-sm">Bergabung dengan sistem peminjaman barang sekolah kami</p>
          </CardHeader>
          
          <CardContent className="p-8 pt-10">
            <form action={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Input 
                  name="nama" 
                  placeholder="Nama Lengkap"
                  icon={<User className="h-4 w-4" />}
                  className="bg-white border-slate-200 focus:border-blue-500"
                  required 
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Input 
                  name="username" 
                  placeholder="Username"
                  icon={<User className="h-4 w-4" />}
                  className="bg-white border-slate-200 focus:border-blue-500"
                  required 
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Kata Sandi"
                    icon={<Lock className="h-4 w-4" />}
                    className="bg-white border-slate-200 focus:border-blue-500 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <p className="text-sm text-red-600 font-medium text-center">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  type="submit" 
                  variant="gradient"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  {loading ? "Mendaftar..." : "Daftar Sekarang"}
                </Button>
              </motion.div>
            </form>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-center space-y-4"
            >
              <p className="text-sm text-slate-600">
                Sudah memiliki akun?{" "}
                <Link href="/auth/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Masuk di sini
                </Link>
              </p>
              
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center justify-center space-x-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mx-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali ke Halaman Utama</span>
                </button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-slate-400">
            Dengan mendaftar, Anda menyetujui{" "}
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Syarat & Ketentuan</Link>
            {" "}dan{" "}
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Kebijakan Privasi</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}