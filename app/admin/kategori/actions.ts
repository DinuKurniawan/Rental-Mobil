"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional(),
});

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  const result = CategorySchema.safeParse({ name, slug, description });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.category.create({
      data: result.data,
    });
    revalidatePath("/admin/kategori");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal membuat kategori. Slug mungkin sudah digunakan." };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  const result = CategorySchema.safeParse({ name, slug, description });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: result.data,
    });
    revalidatePath("/admin/kategori");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal memperbarui kategori." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/admin/kategori");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menghapus kategori. Pastikan tidak ada mobil yang menggunakan kategori ini." };
  }
}
