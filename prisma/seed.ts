require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning and seeding Supabase database...");

  // Delete existing data in correct order
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.carImage.deleteMany({});
  await prisma.car.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.paymentMethod.deleteMany({});
  await prisma.voucher.deleteMany({});
  
  // Upsert Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@drivekita.com" },
    update: { password: hashedPassword },
    create: {
      email: "admin@drivekita.com",
      name: "Admin DriveKita",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "City Car", slug: "city-car", description: "Compact and fuel-efficient for urban adventures." } }),
    prisma.category.create({ data: { name: "SUV", slug: "suv", description: "Spacious and powerful for family trips and off-road." } }),
    prisma.category.create({ data: { name: "Luxury", slug: "luxury", description: "Premium comfort and high-end performance." } }),
    prisma.category.create({ data: { name: "MPV", slug: "mpv", description: "Maximum capacity for your group travels." } }),
  ]);

  // Create Cars
  const carsData = [
    {
      name: "Honda Brio RS",
      slug: "honda-brio-rs",
      brand: "Honda",
      description: "Small but mighty. Perfect for navigating tight city streets with style.",
      pricePerDay: 350000,
      year: 2023,
      transmission: "Automatic",
      capacity: 5,
      fuel: "Petrol",
      rating: 4.8,
      categoryId: categories[0].id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=800" },
        ]
      }
    },
    {
      name: "Toyota Avanza",
      slug: "toyota-avanza-2024",
      brand: "Toyota",
      description: "The ultimate family choice. Reliable, spacious, and comfortable.",
      pricePerDay: 450000,
      year: 2024,
      transmission: "Automatic",
      capacity: 7,
      fuel: "Petrol",
      rating: 4.7,
      categoryId: categories[3].id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800" },
        ]
      }
    },
    {
      name: "Mitsubishi Pajero Sport",
      slug: "mitsubishi-pajero-sport",
      brand: "Mitsubishi",
      description: "Conquer any terrain with confidence and power.",
      pricePerDay: 1200000,
      year: 2023,
      transmission: "Automatic",
      capacity: 7,
      fuel: "Diesel",
      rating: 4.9,
      categoryId: categories[1].id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" },
        ]
      }
    },
    {
      name: "BMW 3 Series",
      slug: "bmw-3-series",
      brand: "BMW",
      description: "Elegance meets performance. Experience true luxury on the road.",
      pricePerDay: 2500000,
      year: 2022,
      transmission: "Automatic",
      capacity: 5,
      fuel: "Petrol",
      rating: 5.0,
      categoryId: categories[2].id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800" },
        ]
      }
    }
  ];

  for (const car of carsData) {
    await prisma.car.create({ data: car });
  }

  // Create Reviews
  const reviews = [
    { name: "Andi Saputra", role: "Business Traveler", content: "Layanan sangat memuaskan, mobil dalam kondisi prima. Proses booking sangat cepat!", rating: 5 },
    { name: "Siti Aminah", role: "Family Trip", content: "Pajero Sport-nya sangat nyaman untuk perjalanan jauh keluarga kami. Terima kasih DriveKita!", rating: 5 },
    { name: "Budi Santoso", role: "Urban Explorer", content: "Sangat suka dengan Honda Brio-nya, irit dan lincah di kemacetan Jakarta.", rating: 4 },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  // Create Payment Methods
  await prisma.paymentMethod.createMany({
    data: [
      { name: "Bank Central Asia (BCA)", type: "BANK_TRANSFER", accountNumber: "1234567890", accountName: "PT DRIVEKITA MOBILINDO" },
      { name: "QRIS", type: "QRIS", description: "Scan QR Code untuk pembayaran instan." },
    ]
  });

  console.log("Seeding completed successfully!");
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  });
