"use client";

import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, KeyRound, User as UserIcon, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingAuth } from "@/components/LoadingAuth";

function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const res = await loginUser(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pt-10 pb-6 text-center bg-gradient-to-r from-blue-600 to-emerald-600 text-white relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mx-auto bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
            >
              <LogIn className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Selamat Datang</CardTitle>
            <p className="text-blue-100 text-sm">Masuk untuk mengelola sistem peminjaman barang sekolah</p>
          </CardHeader>
          
          <CardContent className="p-8 pt-10">
            <form action={handleSubmit} className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Input 
                  name="username" 
                  placeholder="Username atau Email" 
                  icon={<UserIcon className="h-4 w-4" />}
                  className="bg-white border-slate-200 focus:border-blue-500"
                  required 
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Kata Sandi"
                    icon={<KeyRound className="h-4 w-4" />}
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
                transition={{ delay: 0.5 }}
              >
                <Button 
                  type="submit" 
                  variant="gradient"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  {loading ? "Sedang Masuk..." : "Masuk ke SIPERBAR"}
                </Button>
              </motion.div>
            </form>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center space-y-4"
            >
              <p className="text-sm text-slate-600">
                Belum memiliki akun?{" "}
                <Link href="/auth/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Daftar Sekarang
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
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-slate-400">
            Dengan masuk, Anda menyetujui{" "}
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Syarat & Ketentuan</Link>
            {" "}dan{" "}
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Kebijakan Privasi</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingAuth />}>
      <LoginForm />
    </Suspense>
  )
}