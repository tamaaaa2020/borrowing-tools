"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRak(formData: FormData) {
  const nama = formData.get("nama") as string;
  const lokasi = formData.get("lokasi") as string;
  const kapasitas = parseInt(formData.get("kapasitas") as string);

  await prisma.rak.create({
    data: { nama, lokasi, kapasitas },
  });
  revalidatePath("/dashboard/admin/rak");
}

export async function deleteRak(id: number) {
  await prisma.rak.delete({ where: { id } });
  revalidatePath("/dashboard/admin/rak");
}