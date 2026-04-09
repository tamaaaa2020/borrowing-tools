const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const peminjamPassword = await bcrypt.hash('peminjam123', 10);
  
  // Create Admin
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { status: 'APPROVED' },
    create: {
      nama: 'Administrator',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'APPROVED',
    },
  });

  // Create Petugas
  await prisma.user.upsert({
    where: { username: 'petugas' },
    update: { status: 'APPROVED' },
    create: {
      nama: 'Petugas Toko',
      username: 'petugas',
      password: hashedPassword,
      role: 'PETUGAS',
      status: 'APPROVED',
    },
  });

  // Create Peminjam
  await prisma.user.upsert({
    where: { username: 'peminjam' },
    update: { status: 'APPROVED' },
    create: {
      nama: 'Budi Peminjam',
      username: 'peminjam',
      password: peminjamPassword,
      role: 'PEMINJAM',
      status: 'APPROVED',
    },
  });

  // Create Categories
  const cat1 = await prisma.kategori.upsert({
    where: { id: 1 },
    update: {},
    create: { nama: 'Elektronik' },
  });
  const cat2 = await prisma.kategori.upsert({
    where: { id: 2 },
    update: {},
    create: { nama: 'Pertukangan' },
  });

  // Create Tools
  await prisma.alat.create({
    data: {
      nama: 'Laptop ASUS',
      deskripsi: 'Laptop untuk programming',
      stok: 5,
      id_kategori: cat1.id,
    },
  });

  await prisma.alat.create({
    data: {
      nama: 'Bor Listrik',
      deskripsi: 'Bor tembok makita',
      stok: 3,
      id_kategori: cat2.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
