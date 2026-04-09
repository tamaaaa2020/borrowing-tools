"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateStatus(id: number, status: "proses" | "selesai") {
  const session = await getSession();
  if (!session || session.role === "masyarakat") {
    throw new Error("Unauthorized");
  }

  await prisma.pengaduan.update({
    where: { id_pengaduan: id },
    data: { status },
  });

  revalidatePath("/dashboard/petugas");
}

export async function beriTanggapan(formData: FormData) {
  const session = await getSession();
  if (!session || session.role === "masyarakat") {
    throw new Error("Unauthorized");
  }

  const id_pengaduan = parseInt(formData.get("id_pengaduan") as string);
  const tanggapan = formData.get("tanggapan") as string;

  await prisma.tanggapan.create({
    data: {
      id_pengaduan,
      tanggapan,
      id_petugas: session.id,
    },
  });

  // Automatically update status to 'selesai' when given response
  await prisma.pengaduan.update({
    where: { id_pengaduan },
    data: { status: "selesai" },
  });

  revalidatePath("/dashboard/petugas");
}
