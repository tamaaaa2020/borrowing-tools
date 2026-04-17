import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateStatusPeminjaman, autoRejectExpiredLoans } from "@/actions/peminjaman";

export default async function PetugasPeminjamanPage() {
  // Panggil auto-reject setiap kali halaman dibuka
  await autoRejectExpiredLoans();

  const peminjamans = await prisma.peminjaman.findMany({
    where: { status: "PENDING" },
    include: {
      user: true,
      alat: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Persetujuan Peminjaman</h2>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengajuan Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2">Peminjam</th>
                  <th className="px-4 py-2">Alat</th>
                  <th className="px-4 py-2">Jumlah</th>
                  <th className="px-4 py-2">Tgl Pinjam</th>
                  <th className="px-4 py-2">Rencana Kembali</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {peminjamans.map((p: any) => (
                  <tr key={p.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{p.user.nama}</td>
                    <td className="px-4 py-3">{p.alat.nama}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold bg-slate-100 px-2 py-1 rounded">
                        {p.jumlah}
                      </span>
                    </td>
                    <td className="px-4 py-3">{new Date(p.tanggal_pinjam).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{new Date(p.tanggal_kembali_rencana).toLocaleDateString()}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <form action={async () => {
                        "use server";
                        await updateStatusPeminjaman(p.id, "DIPINJAM");
                      }}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Setujui</Button>
                      </form>
                      <form action={async () => {
                        "use server";
                        await updateStatusPeminjaman(p.id, "DITOLAK");
                      }}>
                        <Button size="sm" variant="destructive">Tolak</Button>
                      </form>
                    </td>
                  </tr>
                ))}
                {peminjamans.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Tidak ada pengajuan pending.</td>
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