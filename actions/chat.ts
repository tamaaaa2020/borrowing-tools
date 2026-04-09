"use server";

import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { getSession } from "@/lib/auth";

export async function sendMessage(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const content = formData.get("content") as string;
  const receiverId = parseInt(formData.get("receiverId") as string);

  if (!content) return { error: "Pesan tidak boleh kosong" };

  // Basic Security Check: Peminjam hanya bisa chat dengan Petugas/Admin, dan sebaliknya
  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) return { error: "Penerima tidak ditemukan" };

  if (session.role === "PEMINJAM" && receiver.role === "PEMINJAM") {
    return { error: "Tidak diizinkan chat sesama peminjam" };
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.id,
        receiverId,
      },
      include: {
        sender: true,
      },
    });

    // Trigger Pusher
    const channelName = `chat-${Math.min(session.id, receiverId)}-${Math.max(session.id, receiverId)}`;
    await pusherServer.trigger(channelName, "new-message", message);

    return { success: true, message };
  } catch (error) {
    console.error("Chat error:", error);
    return { error: "Gagal mengirim pesan" };
  }
}

export async function getMessages(otherUserId: number) {
  const session = await getSession();
  if (!session) return [];

  return await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.id },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getChatContacts() {
  const session = await getSession();
  if (!session) return [];

  // Jika Petugas, ambil semua Peminjam yang pernah chat
  if (session.role === "PETUGAS" || session.role === "ADMIN") {
    const users = await prisma.user.findMany({
      where: {
        role: "PEMINJAM",
      },
      select: {
        id: true,
        nama: true,
        username: true,
      },
    });
    return users;
  }

  // Jika Peminjam, ambil semua Petugas
  const petugas = await prisma.user.findMany({
    where: {
      role: { in: ["PETUGAS", "ADMIN"] },
    },
    select: {
      id: true,
      nama: true,
      username: true,
    },
  });
  return petugas;
}

export async function clearOldMessages() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  try {
    await prisma.message.deleteMany({
      where: {
        createdAt: { lt: sevenDaysAgo },
      },
    });
    return { success: true };
  } catch (error) {
    return { error: "Gagal membersihkan database" };
  }
}
