import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAlat, deleteAlat } from "@/actions/alat";
import { Pencil, Trash2, PackagePlus } from "lucide-react";

export default async function AlatPage() {
  const alats = await prisma.alat.findMany({
    include: { kategori: true, rak: true }
  });
  const kategoris = await prisma.kategori.findMany();
  const raks = await prisma.rak.findMany();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <PackagePlus className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Alat</h2>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="bg-white border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-700">Tambah Alat Baru</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={createAlat} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Alat</label>
              <Input name="nama" placeholder="Contoh: Laptop ASUS" className="bg-slate-50 border-slate-200 focus:bg-white transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori</label>
              <select name="id_kategori" className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 transition-all" required>
                <option value="">Pilih Kategori</option>
                {kategoris.map(kat => (
                  <option key={kat.id} value={kat.id}>{kat.nama}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stok</label>
              <Input name="stok" type="number" defaultValue="1" min="0" className="bg-slate-50 border-slate-200 focus:bg-white transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deskripsi</label>
              <Input name="deskripsi" placeholder="Keterangan singkat" className="bg-slate-50 border-slate-200 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tahun Pembelian</label>
              <Input name="tahun_pembelian" type="number" placeholder="Contoh: 2024" className="bg-slate-50 border-slate-200 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Harga (Rp)</label>
              <Input name="harga" type="number" step="0.01" placeholder="Contoh: 5000000" className="bg-slate-50 border-slate-200 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lokasi Rak</label>
              <select name="id_rak" className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 transition-all">
                <option value="">Pilih Rak</option>
                {raks.map(r => (
                  <option key={r.id} value={r.id} disabled={r.status === 'PENUH'}>
                    {r.nama} - {r.lokasi} {r.status === 'PENUH' ? '(Penuh)' : `(${r.terisi}/${r.kapasitas})`}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Simpan Alat
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
          <CardTitle className="text-lg font-semibold text-slate-700">Daftar Alat</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Tahun & Harga</th>
                  <th className="px-6 py-4">Rak</th>
                  <th className="px-6 py-4 text-center">Stok</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alats.map((alat) => (
                  <tr key={alat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{alat.nama}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {alat.kategori.nama}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>{alat.tahun_pembelian || '-'}</div>
                      <div className="text-slate-500 font-medium">Rp {Number(alat.harga).toLocaleString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {alat.rak ? `${alat.rak.nama} (${alat.rak.lokasi})` : '-'}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-slate-600">{alat.stok}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <form action={async () => {
                          "use server";
                          await deleteAlat(alat.id);
                        }}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {alats.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">Belum ada data alat.</td>
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
