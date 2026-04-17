import { prisma } from "@/lib/prisma";
import PilihAlatClient from "@/components/PilihAlatClient";

export default async function PilihAlatPage() {
  const alats = await prisma.alat.findMany({
    include: { kategori: true, rak: true },
    where: { stok: { gt: 0 } }
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pilih Alat</h2>
        <p className="text-slate-500 mt-1">Pilih alat yang ingin Anda pinjam hari ini</p>
      </div>

      <PilihAlatClient alats={alats} />
    </div>
  );
}
