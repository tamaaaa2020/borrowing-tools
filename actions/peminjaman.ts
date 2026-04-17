"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function ajukanPeminjaman(items: { id_alat: number, jumlah: number }[], tanggal_kembali_rencana: string) {
  const session = await getSession();
  if (!session) return { error: "Silahkan login terlebih dahulu" };

  if (items.length === 0) return { error: "Pilih minimal satu alat" };
  const tglKembali = new Date(tanggal_kembali_rencana);

  try {
    await prisma.$transaction(async (tx: any) => {
      for (const item of items) {
        // Cek stok alat
        const alat = await tx.alat.findUnique({ where: { id: item.id_alat } });
        if (!alat || alat.stok < item.jumlah) {
          throw new Error(`Stok alat ${alat?.nama || 'tidak ditemukan'} tidak mencukupi`);
        }

        await tx.peminjaman.create({
          data: {
            id_user: session.id,
            id_alat: item.id_alat,
            jumlah: item.jumlah,
            tanggal_kembali_rencana: tglKembali,
            status: "PENDING",
          },
        });
      }
    });

    revalidatePath("/dashboard/peminjam/riwayat");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal mengajukan peminjaman" };
  }
}

export async function updateStatusPeminjaman(id: number, status: "DIPINJAM" | "DITOLAK") {
  try {
    return await prisma.$transaction(async (tx: any) => {
      const peminjaman = await tx.peminjaman.findUnique({
        where: { id },
        include: { alat: true }
      });

      if (!peminjaman) throw new Error("Data tidak ditemukan");

      if (status === "DIPINJAM") {
        if (peminjaman.alat.stok < peminjaman.jumlah) throw new Error("Stok tidak cukup");
        
        await tx.alat.update({
          where: { id: peminjaman.id_alat },
          data: { stok: { decrement: peminjaman.jumlah } }
        });
      }

      await tx.peminjaman.update({
        where: { id },
        data: { status }
      });

      revalidatePath("/dashboard/admin/peminjaman");
      revalidatePath("/dashboard/petugas/peminjaman");
      return { success: true };
    });
  } catch (error: any) {
    return { error: error.message || "Gagal memperbarui status" };
  }
}

export async function autoRejectExpiredLoans() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  try {
    const expiredLoans = await prisma.peminjaman.findMany({
      where: {
        status: "PENDING",
        createdAt: { lt: thirtyMinutesAgo }
      }
    });

    if (expiredLoans.length > 0) {
      await prisma.peminjaman.updateMany({
        where: {
          id: { in: expiredLoans.map((l: any) => l.id) }
        },
        data: { status: "DITOLAK" }
      });
      revalidatePath("/dashboard/admin/peminjaman");
      revalidatePath("/dashboard/peminjam/riwayat");
    }
  } catch (error) {
    console.error("Auto-reject failed:", error);
  }
}

export async function kembalikanAlat(id: number, kondisi: "BAIK" | "RUSAK" | "HILANG" = "BAIK") {
  const peminjaman = await prisma.peminjaman.findUnique({
    where: { id },
    include: { alat: true }
  });

  if (!peminjaman || peminjaman.status !== "DIPINJAM") {
    return { error: "Data tidak valid" };
  }

  const now = new Date();
  let denda = 0;

  // Hitung denda telat: Kelipatan 5rb per jam jika telat > 1 jam
  const diffMs = now.getTime() - peminjaman.tanggal_kembali_rencana.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours > 1) {
    denda += Math.ceil(diffHours) * 5000;
  }

  // Hitung denda kondisi berdasarkan range harga
  const hargaAlat = Number(peminjaman.alat.harga) || 0;
  let dendaKondisi = 0;

  if (kondisi === "RUSAK") {
    // Misal: denda rusak = 50% dari harga * jumlah
    dendaKondisi = hargaAlat * 0.5 * peminjaman.jumlah;
  } else if (kondisi === "HILANG") {
    // Misal: denda hilang = 100% dari harga * jumlah
    dendaKondisi = hargaAlat * peminjaman.jumlah;
  }

  denda += dendaKondisi;

  try {
    await prisma.$transaction([
      // Update status peminjaman
      prisma.peminjaman.update({
        where: { id },
        data: { status: "DIKEMBALIKAN" }
      }),
      // Tambah data pengembalian
      prisma.pengembalian.create({
        data: {
          id_peminjaman: id,
          tanggal_kembali_aktual: now,
          kondisi: kondisi,
          denda: denda,
          status_pembayaran: denda > 0 ? "BELUM_BAYAR" : "LUNAS",
        }
      }),
      // Tambah stok alat jika kondisi BAIK atau RUSAK (asumsi barang rusak masih kembali tapi rusak, hilang tidak kembali)
      ...(kondisi !== "HILANG" ? [
        prisma.alat.update({
          where: { id: peminjaman.id_alat },
          data: { stok: { increment: peminjaman.jumlah } }
        })
      ] : [])
    ]);

    revalidatePath("/dashboard/peminjam/riwayat");
    revalidatePath("/dashboard/admin/pengembalian");
    return { success: true, denda };
  } catch (error) {
    return { error: "Gagal memproses pengembalian" };
  }
}

export async function bayarDenda(pengembalianId: number) {
  try {
    await prisma.pengembalian.update({
      where: { id: pengembalianId },
      data: { status_pembayaran: "LUNAS" }
    });
    revalidatePath("/dashboard/peminjam/riwayat");
    revalidatePath("/dashboard/admin/laporan");
    return { success: true };
  } catch (error) {
    return { error: "Gagal memproses pembayaran" };
  }
}
