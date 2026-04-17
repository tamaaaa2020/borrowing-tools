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

export async function autoRejectPendingUsers() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        status: "PENDING",
        createdAt: { lt: thirtyMinutesAgo }
      }
    });

    if (pendingUsers.length > 0) {
      await prisma.user.updateMany({
        where: {
          id: { in: pendingUsers.map(u => u.id) }
        },
        data: { status: "REJECTED" }
      });
      revalidatePath("/dashboard/admin/users");
    }
  } catch (error) {
    console.error("Auto-reject users failed:", error);
  }
}
