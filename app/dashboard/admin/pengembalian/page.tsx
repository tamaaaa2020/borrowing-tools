import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, CreditCard, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import KirimTagihanButton from "@/components/KirimTagihanButton";

export default async function AdminPengembalianPage() {
  const pengembalians = await prisma.pengembalian.findMany({
    include: {
      peminjaman: {
        include: {
          user: true,
          alat: true
        }
      }
    },
    orderBy: { tanggal_kembali_aktual: "desc" }
  });

  const stats = {
    totalDenda: pengembalians.reduce((acc: number, curr: any) => acc + Number(curr.denda), 0),
    lunas: pengembalians.filter((p: any) => p.status_pembayaran === "LUNAS" && Number(p.denda) > 0).length,
    belumLunas: pengembalians.filter((p: any) => p.status_pembayaran === "BELUM_BAYAR").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-emerald-600" />
          Rekap Pembayaran Denda
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Denda Keluar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">Rp {stats.totalDenda.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Sudah Lunas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.lunas} <span className="text-sm font-normal text-slate-400">Transaksi</span></div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-rose-500 uppercase tracking-widest">Belum Bayar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{stats.belumLunas} <span className="text-sm font-normal text-slate-400">Transaksi</span></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-700">Daftar Transaksi Pengembalian</CardTitle>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Filter className="h-3.5 w-3.5" /> Filter Data
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Peminjam</th>
                  <th className="px-6 py-4">Alat</th>
                  <th className="px-6 py-4 text-center">Jumlah</th>
                  <th className="px-6 py-4">Tgl Kembali</th>
                  <th className="px-6 py-4">Denda</th>
                  <th className="px-6 py-4">Status Bayar</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pengembalians.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{p.peminjaman.user.nama}</td>
                    <td className="px-6 py-4 text-slate-600">{p.peminjaman.alat.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg font-bold">
                        {p.peminjaman.jumlah}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{p.tanggal_kembali_aktual.toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${Number(p.denda) > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        Rp {Number(p.denda).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {Number(p.denda) > 0 ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                          ${p.status_pembayaran === "LUNAS" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {p.status_pembayaran === "LUNAS" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {p.status_pembayaran}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <KirimTagihanButton 
                        pengembalianId={p.id} 
                        statusPembayaran={p.status_pembayaran} 
                        denda={Number(p.denda)} 
                        hasSnapToken={!!p.snapToken}
                      />
                    </td>
                  </tr>
                ))}
                {pengembalians.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Belum ada data pengembalian.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
