import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Package, ClipboardList } from "lucide-react";

export default async function PetugasDashboard() {
  const stats = {
    alat: await prisma.alat.count(),
    peminjamanActive: await prisma.peminjaman.count({ 
      where: { status: "DIPINJAM" } 
    }),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Petugas Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring Alat</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alat}</div>
            <p className="text-xs text-muted-foreground">Total alat terdaftar di sistem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sedang Dipinjam</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.peminjamanActive}</div>
            <p className="text-xs text-muted-foreground">Peminjaman yang belum dikembalikan</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Alat</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Halaman monitoring alat dan pengembalian.</p>
        </CardContent>
      </Card>
    </div>
  );
}
