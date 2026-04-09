import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Package, Users, ClipboardList, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardContent() {
  const [
    totalUsers,
    totalAlat,
    activeLoans,
    recentPeminjaman,
    availableAlat
  ] = await Promise.all([
    prisma.user.count(),
    prisma.alat.count(),
    prisma.peminjaman.count({ where: { status: "DIPINJAM" } }),
    prisma.peminjaman.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { nama: true } },
        alat: { select: { nama: true } },
      }
    }),
    prisma.alat.count({ where: { stok: { gt: 0 } } })
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Overview Panel</h2>
          <p className="text-slate-500 mt-1">Ringkasan aktivitas sistem peminjaman barang</p>
        </div>
        <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-right px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Alat Tersedia</p>
            <p className="text-xl font-bold text-blue-600">{availableAlat}</p>
          </div>
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-100">
            <Package className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Alat</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalAlat}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-2xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengguna</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalUsers}</h3>
              </div>
              <div className="bg-sky-100 p-3 rounded-2xl">
                <Users className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alat Tersedia</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{availableAlat}</h3>
              </div>
              <div className="bg-indigo-100 p-3 rounded-2xl">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sedang Dipinjam</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeLoans}</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">Peminjaman Terbaru</CardTitle>
            <Clock className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            {recentPeminjaman.length > 0 ? (
              <div className="space-y-4">
                {recentPeminjaman.map((peminjaman: any) => (
                  <div key={peminjaman.id} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl transition-all group">
                    <div>
                      <p className="font-medium text-slate-900">{peminjaman.user.nama}</p>
                      <p className="text-sm text-slate-600">
                        {peminjaman.alat.nama} 
                        <span className="ml-2 text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-700">
                          x{peminjaman.jumlah}
                        </span>
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      peminjaman.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      peminjaman.status === 'DIPINJAM' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      peminjaman.status === 'DITOLAK' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {peminjaman.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600">Belum ada peminjaman</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">Ringkasan Sistem</CardTitle>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Efisiensi Peminjaman</p>
                <p className="text-2xl font-bold text-slate-900">98.5%</p>
              </div>
              <div className="bg-emerald-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Tingkat Persetujuan</span>
                <span className="font-semibold text-slate-900">95%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Utilitas Alat</span>
                <span className="font-semibold text-slate-900">87%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-none bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/dashboard/admin/peminjaman">
              <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
                <ClipboardList className="h-4 w-4 mr-2" />
                Verifikasi Peminjaman
              </Button>
            </Link>
            <Link href="/dashboard/admin/alat">
              <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
                <Package className="h-4 w-4 mr-2" />
                Kelola Alat
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
                <Users className="h-4 w-4 mr-2" />
                Kelola Pengguna
              </Button>
            </Link>
            <Link href="/dashboard/admin/laporan">
              <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
                <TrendingUp className="h-4 w-4 mr-2" />
                Lihat Laporan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}