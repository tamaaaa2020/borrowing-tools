"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPengaduan(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "masyarakat") {
    throw new Error("Unauthorized");
  }

  const isi_laporan = formData.get("isi_laporan") as string;
  const foto = "default.jpg"; // In real scenario, handle file upload

  await prisma.pengaduan.create({
    data: {
      nik: session.id,
      isi_laporan,
      foto,
      status: "menunggu",
    },
  });

  revalidatePath("/dashboard/masyarakat");
}

export async function deletePengaduan(id: number) {
  const session = await getSession();
  if (!session || session.role !== "masyarakat") {
    throw new Error("Unauthorized");
  }

  await prisma.pengaduan.delete({
    where: { id_pengaduan: id },
  });

  revalidatePath("/dashboard/masyarakat");
}
