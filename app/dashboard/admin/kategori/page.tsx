import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createKategori, deleteKategori } from "@/actions/alat";
import { Pencil, Trash2, Tags } from "lucide-react";

export default async function KategoriPage() {
  const kategoris = await prisma.kategori.findMany();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Tags className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Kategori</h2>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="bg-white border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-700">Tambah Kategori</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={createKategori} className="flex gap-4">
            <Input name="nama" placeholder="Nama Kategori Baru" className="bg-slate-50 border-slate-200 focus:bg-white transition-all" required />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Tambah
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
          <CardTitle className="text-lg font-semibold text-slate-700">Daftar Kategori</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {kategoris.map((kat) => (
              <div key={kat.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                <span className="font-semibold text-slate-700">{kat.nama}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <form action={async () => {
                    "use server";
                    await deleteKategori(kat.id);
                  }}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
            {kategoris.length === 0 && (
              <p className="text-sm text-slate-400 py-10 text-center italic">Belum ada kategori.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
