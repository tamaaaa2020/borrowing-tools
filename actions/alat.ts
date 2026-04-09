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

  await prisma.alat.create({
    data: { nama, deskripsi, stok, id_kategori },
  });
  revalidatePath("/dashboard/admin/alat");
}

export async function updateAlat(id: number, formData: FormData) {
  const nama = formData.get("nama") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const stok = parseInt(formData.get("stok") as string);
  const id_kategori = parseInt(formData.get("id_kategori") as string);

  await prisma.alat.update({
    where: { id },
    data: { nama, deskripsi, stok, id_kategori },
  });
  revalidatePath("/dashboard/admin/alat");
}

export async function deleteAlat(id: number) {
  await prisma.alat.delete({ where: { id } });
  revalidatePath("/dashboard/admin/alat");
}
