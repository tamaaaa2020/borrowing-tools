"use server";

import { prisma } from "@/lib/prisma";
import { login, logout } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerPeminjam(formData: FormData) {
  const nama = formData.get("nama") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!nama || !username || !password) {
    return { error: "Semua field harus diisi" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return { error: "Username sudah digunakan" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        nama,
        username,
        password: hashedPassword,
        role: "PEMINJAM",
        status: "PENDING", // Otomatis pending saat daftar
      },
    });
    // Jangan redirect ke login dulu, biarkan user tahu statusnya pending
    return { success: true, message: "Pendaftaran berhasil! Silahkan tunggu persetujuan Admin untuk login." };
  } catch (error) {
    return { error: "Gagal mendaftar" };
  }
}

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password wajib diisi" };
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Username atau password salah" };
  }

  // Cek Status Approval Admin
  if (user.status === "PENDING") {
    return { error: "Akun Anda masih dalam proses verifikasi oleh Admin. Silahkan coba lagi nanti." };
  }

  if (user.status === "REJECTED") {
    return { error: "Mohon maaf, pendaftaran akun Anda ditolak oleh Admin." };
  }

  // Create session payload
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.nama,
  };

  await login(payload);

  // Redirect based on role
  switch (user.role) {
    case "ADMIN":
      redirect("/dashboard/admin");
    case "PETUGAS":
      redirect("/dashboard/petugas");
    case "PEMINJAM":
      redirect("/dashboard/peminjam");
    default:
      redirect("/");
  }
}

export async function logoutUser() {
  await logout();
}
