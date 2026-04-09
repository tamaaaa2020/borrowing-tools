import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintButton } from "@/components/PrintButton";

export default async function LaporanPage() {
  const data = await prisma.peminjaman.findMany({
    include: {
      user: true,
      alat: true,
      pengembalian: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Laporan Peminjaman</h2>
        <PrintButton data={data} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Seluruh Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100 text-xs uppercase border-b">
                <tr>
                  <th className="px-4 py-2 border-r">ID</th>
                  <th className="px-4 py-2 border-r">Peminjam</th>
                  <th className="px-4 py-2 border-r">Alat</th>
                  <th className="px-4 py-2 border-r">Tgl Pinjam</th>
                  <th className="px-4 py-2 border-r">Tgl Kembali</th>
                  <th className="px-4 py-2 border-r">Status</th>
                  <th className="px-4 py-2">Denda</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3 border-r font-mono">#{item.id}</td>
                    <td className="px-4 py-3 border-r">{item.user.nama}</td>
                    <td className="px-4 py-3 border-r">{item.alat.nama}</td>
                    <td className="px-4 py-3 border-r">{item.tanggal_pinjam.toLocaleDateString()}</td>
                    <td className="px-4 py-3 border-r">
                      {item.pengembalian 
                        ? item.pengembalian.tanggal_kembali_aktual.toLocaleDateString()
                        : item.tanggal_kembali_rencana.toLocaleDateString() + " (Rencana)"}
                    </td>
                    <td className="px-4 py-3 border-r">{item.status}</td>
                    <td className="px-4 py-3">
                      {item.pengembalian ? `Rp ${Number(item.pengembalian.denda).toLocaleString()}` : "Rp 0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          main { padding: 0 !important; }
          nav { display: none !important; }
        }
      `}} />
    </div>
  );
}
