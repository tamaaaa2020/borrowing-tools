import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { kembalikanAlat } from "@/actions/peminjaman";
import { PaymentModal } from "@/components/PaymentModal";
import { Clock, CheckCircle2, AlertCircle, History } from "lucide-react";

export default async function RiwayatPeminjamanPage() {
  const session = await getSession();
  const riwayats = await prisma.peminjaman.findMany({
    where: { id_user: session.id },
    include: {
      alat: true,
      pengembalian: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <History className="h-6 w-6 text-slate-600" />
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat Peminjaman Saya</h2>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
          <CardTitle className="text-lg font-semibold text-slate-700">Daftar Peminjaman</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Alat</th>
                  <th className="px-6 py-4 text-center">Jumlah</th>
                  <th className="px-6 py-4">Tgl Pinjam</th>
                  <th className="px-6 py-4">Batas Kembali</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Denda</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {riwayats.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{r.alat.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg font-bold">
                        {r.jumlah}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{r.tanggal_pinjam.toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 text-slate-500">{r.tanggal_kembali_rencana.toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${r.status === "PENDING" ? "bg-amber-100 text-amber-700" : 
                          r.status === "DIPINJAM" ? "bg-sky-100 text-sky-700" :
                          r.status === "DIKEMBALIKAN" ? "bg-emerald-100 text-emerald-700" :
                          "bg-rose-100 text-rose-700"}`}>
                        {r.status === "PENDING" && <Clock className="h-3 w-3" />}
                        {r.status === "DIKEMBALIKAN" && <CheckCircle2 className="h-3 w-3" />}
                        {r.status === "DITOLAK" && <AlertCircle className="h-3 w-3" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {r.pengembalian && Number(r.pengembalian.denda) > 0 ? (
                        <div className="space-y-1">
                          <div className="font-bold text-rose-600">
                            Rp {Number(r.pengembalian.denda).toLocaleString('id-ID')}
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold
                            ${r.pengembalian.status_pembayaran === "LUNAS" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>
                            {r.pengembalian.status_pembayaran}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Tidak ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.status === "DIPINJAM" && (
                        <form action={async () => {
                          "use server";
                          await kembalikanAlat(r.id);
                        }}>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Kembalikan Alat</Button>
                        </form>
                      )}
                      {r.pengembalian && r.pengembalian.status_pembayaran === "BELUM_BAYAR" && (
                        <PaymentModal 
                          id_peminjaman={r.pengembalian.id} 
                          denda={Number(r.pengembalian.denda)} 
                          namaAlat={r.alat.nama} 
                          snapUrl={r.pengembalian.snapUrl}
                        />
                      )}
                    </td>
                  </tr>
                ))}
                {riwayats.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic bg-slate-50/30">
                      Belum ada riwayat peminjaman.
                    </td>
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
