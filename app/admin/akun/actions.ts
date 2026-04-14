"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  role: z.enum(["ADMIN", "CUSTOMER"]),
});

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as any;

  const result = UserSchema.safeParse({ name, email, password, role });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : "";
    await prisma.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
        role: result.data.role,
      },
    });
    revalidatePath("/admin/akun");
    return { success: true };
  } catch (error: any) {
    return { error: "Email sudah digunakan." };
  }
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as any;

  const result = UserSchema.safeParse({ name, email, password, role });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const data: any = {
      name: result.data.name,
      email: result.data.email,
      role: result.data.role,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/akun");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal memperbarui akun." };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/admin/akun");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menghapus akun." };
  }
}
