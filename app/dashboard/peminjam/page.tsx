import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Package, History, Clock } from "lucide-react";

export default async function PeminjamDashboard() {
  const session = await getSession();
  
  const stats = {
    myPeminjaman: await prisma.peminjaman.count({
      where: { id_user: session.id }
    }),
    activePeminjaman: await prisma.peminjaman.count({
      where: { id_user: session.id, status: "DIPINJAM" }
    }),
    pendingPeminjaman: await prisma.peminjaman.count({
      where: { id_user: session.id, status: "PENDING" }
    }),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Peminjam</h2>
        <p className="text-gray-500">Selamat datang kembali, {session.name}!</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Peminjaman</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myPeminjaman}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sedang Dipinjam</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activePeminjaman}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingPeminjaman}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alat Tersedia</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Silahkan pilih alat di menu "Pinjam Alat" untuk mengajukan peminjaman.</p>
        </CardContent>
      </Card>
    </div>
  );
}
