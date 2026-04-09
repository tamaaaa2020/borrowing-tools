"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserStatus(id: number, status: "APPROVED" | "REJECTED") {
  try {
    await prisma.user.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Gagal memperbarui status user" };
  }
}

export async function deleteUser(id: number) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus user" };
  }
}
