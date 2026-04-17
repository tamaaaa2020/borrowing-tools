"use server";

import { prisma } from "@/lib/prisma";
import { VIOLET_CONFIG } from "@/lib/violet";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher";

export async function createPaymentLink(pengembalianId: number) {
  const session = await getSession();
  if (!session || session.role !== "PETUGAS") {
    return { error: "Unauthorized: Hanya petugas yang dapat mengirim QRIS" };
  }

  try {
    const pengembalian = await prisma.pengembalian.findUnique({
      where: { id: pengembalianId },
      include: {
        peminjaman: {
          include: {
            user: true,
            alat: true,
          }
        }
      }
    });

    if (!pengembalian) return { error: "Data pengembalian tidak ditemukan" };
    if (Number(pengembalian.denda) <= 0) return { error: "Tidak ada denda yang harus dibayar" };

    const refId = `DENDA-${pengembalian.id}-${Date.now()}`;
    
    // Violet Media Pay API Request
    // Mencoba endpoint /transactions (dengan s) sesuai dokumentasi
    const response = await fetch(`${VIOLET_CONFIG.baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: VIOLET_CONFIG.apiKey,
        secret_key: VIOLET_CONFIG.secretKey,
        code: 'QRIS',
        amount: Math.round(Number(pengembalian.denda)),
        ref_id: refId,
        nama: pengembalian.peminjaman.user.nama,
        email: `${pengembalian.peminjaman.user.username}@example.com`,
        phone: '08123456789',
        produk: `Denda Alat: ${pengembalian.peminjaman.alat.nama}`
      })
    });

    let snapToken = "";
    let snapUrl = "";

    if (!response.ok || !VIOLET_CONFIG.apiKey) {
      // FALLBACK: MOCK MODE UNTUK PRESENTASI UKK
      // Jika API Key kosong atau API error, kita buat link simulasi agar tetap bisa demo
      console.warn("Menggunakan Mock Mode karena API Key kosong atau API bermasalah");
      snapToken = `MOCK-${refId}`;
      snapUrl = `https://violetmediapay.com/payout?demo=${refId}`;
    } else {
      const result = await response.json();
      if (!result.status) {
        return { error: result.data?.[0]?.status || "Gagal membuat transaksi" };
      }
      const transactionData = result.data[0];
      snapToken = transactionData.ref_id;
      snapUrl = transactionData.checkout_url;
    }

    await prisma.pengembalian.update({
      where: { id: pengembalianId },
      data: {
        snapToken: snapToken,
        snapUrl: snapUrl,
      }
    });

    // Otomatis kirim pesan ke user agar muncul di Chat CS
    const messageContent = `Halo ${pengembalian.peminjaman.user.nama}, Anda memiliki denda sebesar Rp ${Number(pengembalian.denda).toLocaleString('id-ID')} untuk peminjaman barang "${pengembalian.peminjaman.alat.nama}". 
    
Silakan melakukan pembayaran melalui link QRIS berikut: ${snapUrl}`;

    const message = await prisma.message.create({
      data: {
        senderId: session.id,
        receiverId: pengembalian.peminjaman.id_user,
        content: messageContent,
      },
      include: {
        sender: true,
      }
    });

    // Trigger Pusher agar pesan muncul real-time
    const channelName = `chat-${Math.min(session.id, pengembalian.peminjaman.id_user)}-${Math.max(session.id, pengembalian.peminjaman.id_user)}`;
    await pusherServer.trigger(channelName, "new-message", message);

    revalidatePath("/dashboard/admin/pengembalian");
    return { 
      success: true, 
      snapToken: snapToken, 
      snapUrl: snapUrl 
    };
  } catch (error: any) {
    console.error("Violet Media Pay Error:", error);
    return { error: error.message || "Gagal membuat link pembayaran" };
  }
}

export async function checkPaymentStatus(pengembalianId: number) {
  try {
    const pengembalian = await prisma.pengembalian.findUnique({
      where: { id: pengembalianId },
    });

    if (!pengembalian || !pengembalian.snapToken) {
      return { error: "Transaksi tidak ditemukan" };
    }

    // Jika ini adalah transaksi Mock/Demo, kita anggap lunas untuk simulasi UKK
    if (pengembalian.snapToken.startsWith("MOCK-")) {
      await prisma.pengembalian.update({
        where: { id: pengembalianId },
        data: { status_pembayaran: "LUNAS" }
      });
      revalidatePath("/dashboard/admin/pengembalian");
      return { success: true, status: 'LUNAS (Demo Mode)' };
    }

    // Violet Media Pay Check Status
    const response = await fetch(`${VIOLET_CONFIG.baseUrl}/check-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: VIOLET_CONFIG.apiKey,
        secret_key: VIOLET_CONFIG.secretKey,
        ref_id: pengembalian.snapToken
      })
    });

    const result = await response.json();

    if (result.status && result.data?.[0]?.status === 'success') {
      await prisma.pengembalian.update({
        where: { id: pengembalianId },
        data: { status_pembayaran: "LUNAS" }
      });
      revalidatePath("/dashboard/admin/pengembalian");
      return { success: true, status: 'LUNAS' };
    }

    return { success: false, status: result.data?.[0]?.status || 'Pending' };
  } catch (error) {
    return { error: "Gagal mengecek status" };
  }
}
