"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini harus diisi"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
});

export async function submitReview(formData: {
  name: string;
  rating: number;
  content: string;
  role?: string;
}) {
  try {
    await prisma.review.create({
      data: {
        name: formData.name,
        rating: formData.rating,
        content: formData.content,
        role: formData.role || "Pelanggan",
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(formData.name)}`,
      },
    });

    revalidatePath("/");
    return ({ success: true });
  } catch (error) {
    console.error("Failed to submit review:", error);
    return ({ success: false, error: "Gagal mengirim ulasan" });
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/masuk" });
}

export async function updatePassword(formData: FormData) {
  const session = await auth();
  
  if (!session || !session.user) {
    return { error: "Anda harus login untuk melakukan ini" };
  }

  const userId = (session.user as any).id;

  if (!userId) {
    return { error: "ID User tidak ditemukan" };
  }

  const validatedFields = UpdatePasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return { error: "User tidak ditemukan" };
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return { error: { currentPassword: ["Password saat ini salah"] } };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: "Password berhasil diperbarui" };
  } catch (error) {
    console.error("Update password error:", error);
    return { error: "Gagal memperbarui password" };
  }
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  
  if (!session || !session.user) {
    return { error: "Anda harus login untuk melakukan ini" };
  }

  const userId = (session.user as any).id;

  if (!userId) {
    return { error: "ID User tidak ditemukan" };
  }

  const validatedFields = UpdateProfileSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email } = validatedFields.data;

  try {
    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return { error: { email: ["Email sudah digunakan oleh akun lain"] } };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    revalidatePath("/admin/settings");
    return { success: "Profil berhasil diperbarui" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Gagal memperbarui profil" };
  }
}

export async function createBooking(data: {
  carId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  location?: string;
  paymentMethod?: string;
}) {
  try {
    // 1. Find or create guest user
    const email = data.customerEmail || `${data.customerPhone}@guest.drivekita.com`;
    
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: data.customerName,
          role: "CUSTOMER",
        },
      });
    }

    // 2. Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        carId: data.carId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        totalAmount: data.totalAmount,
        status: "PENDING",
      },
    });

    // 3. Create initial payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: data.totalAmount,
        status: "pending",
        method: data.paymentMethod || "MANUAL",
        orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      },
    });

    revalidatePath("/admin");
    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error("Create booking error:", error);
    return { success: false, error: "Gagal membuat pesanan" };
  }
}
