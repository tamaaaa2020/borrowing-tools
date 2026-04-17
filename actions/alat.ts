"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Kategori Actions
export async function createKategori(formData: FormData) {
  const nama = formData.get("nama") as string;
  await prisma.kategori.create({ data: { nama } });
  revalidatePath("/dashboard/admin/kategori");
}

export async function deleteKategori(id: number) {
  await prisma.kategori.delete({ where: { id } });
  revalidatePath("/dashboard/admin/kategori");
}

// Alat Actions
export async function createAlat(formData: FormData) {
  const nama = formData.get("nama") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const stok = parseInt(formData.get("stok") as string);
  const id_kategori = parseInt(formData.get("id_kategori") as string);
  
  const tahun_pembelian = formData.get("tahun_pembelian") ? parseInt(formData.get("tahun_pembelian") as string) : null;
  const harga = formData.get("harga") ? parseFloat(formData.get("harga") as string) : 0;
  const id_rak = formData.get("id_rak") ? parseInt(formData.get("id_rak") as string) : null;

  await prisma.$transaction(async (tx) => {
    await tx.alat.create({
      data: { nama, deskripsi, stok, id_kategori, tahun_pembelian, harga, id_rak },
    });

    if (id_rak) {
      const rak = await tx.rak.findUnique({ where: { id: id_rak } });
      if (rak) {
        const newTerisi = rak.terisi + stok;
        const newStatus = newTerisi >= rak.kapasitas ? "PENUH" : "TERSEDIA";
        await tx.rak.update({
          where: { id: id_rak },
          data: { terisi: newTerisi, status: newStatus }
        });
      }
    }
  });

  revalidatePath("/dashboard/admin/alat");
}

export async function updateAlat(id: number, formData: FormData) {
  const nama = formData.get("nama") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const stok = parseInt(formData.get("stok") as string);
  const id_kategori = parseInt(formData.get("id_kategori") as string);
  
  const tahun_pembelian = formData.get("tahun_pembelian") ? parseInt(formData.get("tahun_pembelian") as string) : null;
  const harga = formData.get("harga") ? parseFloat(formData.get("harga") as string) : 0;
  const id_rak = formData.get("id_rak") ? parseInt(formData.get("id_rak") as string) : null;

  await prisma.$transaction(async (tx) => {
    const oldAlat = await tx.alat.findUnique({ where: { id } });
    
    await tx.alat.update({
      where: { id },
      data: { nama, deskripsi, stok, id_kategori, tahun_pembelian, harga, id_rak },
    });

    // Handle Rak logic if Rak changes or Stok changes
    if (oldAlat && oldAlat.id_rak !== id_rak) {
      // Kurangi dari rak lama
      if (oldAlat.id_rak) {
        const oldRak = await tx.rak.findUnique({ where: { id: oldAlat.id_rak } });
        if (oldRak) {
          const newTerisi = Math.max(0, oldRak.terisi - oldAlat.stok);
          await tx.rak.update({
            where: { id: oldAlat.id_rak },
            data: { terisi: newTerisi, status: newTerisi >= oldRak.kapasitas ? "PENUH" : "TERSEDIA" }
          });
        }
      }
      // Tambah ke rak baru
      if (id_rak) {
        const newRak = await tx.rak.findUnique({ where: { id: id_rak } });
        if (newRak) {
          const newTerisi = newRak.terisi + stok;
          await tx.rak.update({
            where: { id: id_rak },
            data: { terisi: newTerisi, status: newTerisi >= newRak.kapasitas ? "PENUH" : "TERSEDIA" }
          });
        }
      }
    } else if (oldAlat && oldAlat.id_rak === id_rak && id_rak) {
      // Jika rak sama tapi stok berubah
      const stokDiff = stok - oldAlat.stok;
      if (stokDiff !== 0) {
        const rak = await tx.rak.findUnique({ where: { id: id_rak } });
        if (rak) {
          const newTerisi = Math.max(0, rak.terisi + stokDiff);
          await tx.rak.update({
            where: { id: id_rak },
            data: { terisi: newTerisi, status: newTerisi >= rak.kapasitas ? "PENUH" : "TERSEDIA" }
          });
        }
      }
    }
  });

  revalidatePath("/dashboard/admin/alat");
}

export async function deleteAlat(id: number) {
  await prisma.alat.delete({ where: { id } });
  revalidatePath("/dashboard/admin/alat");
}
