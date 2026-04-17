import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createRak, deleteRak } from "@/actions/rak";
import { Trash2, LibraryBig } from "lucide-react";

export default async function RakPage() {
  const raks = await prisma.rak.findMany({
    orderBy: { nama: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LibraryBig className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Rak</h2>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="bg-white border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-700">Tambah Rak Baru</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={createRak} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Rak</label>
              <Input name="nama" placeholder="Contoh: Rak A" className="bg-slate-50 border-slate-200 focus:bg-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lokasi</label>
              <Input name="lokasi" placeholder="Contoh: Lantai 1, Ruang 2" className="bg-slate-50 border-slate-200 focus:bg-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kapasitas</label>
              <Input name="kapasitas" type="number" min="1" placeholder="Contoh: 25" className="bg-slate-50 border-slate-200 focus:bg-white" required />
            </div>
            <Button type="submit" className="md:col-span-3 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
              Simpan Rak
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
          <CardTitle className="text-lg font-semibold text-slate-700">Daftar Rak</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Nama Rak</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4 text-center">Kapasitas</th>
                  <th className="px-6 py-4 text-center">Terisi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {raks.map((rak) => (
                  <tr key={rak.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{rak.nama}</td>
                    <td className="px-6 py-4 text-slate-600">{rak.lokasi}</td>
                    <td className="px-6 py-4 text-center font-mono">{rak.kapasitas}</td>
                    <td className="px-6 py-4 text-center font-mono">{rak.terisi}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        rak.status === 'PENUH' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {rak.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={async () => {
                        "use server";
                        await deleteRak(rak.id);
                      }}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
                {raks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">Belum ada data rak.</td>
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