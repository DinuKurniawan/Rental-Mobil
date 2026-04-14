"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function saveImage(imageFile: File | null): Promise<string | null> {
  if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
    return null;
  }
  
  try {
    const uploadDir = path.join(process.cwd(), "public/images/qris");
    await mkdir(uploadDir, { recursive: true });
    
    // Create unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(imageFile.name) || ".png";
    const filename = `qris-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);
    
    // Write file
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);
    
    return `/images/qris/${filename}`;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
}

export async function createPaymentMethod(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const accountNumber = (formData.get("accountNumber") as string) || null;
  const accountName = (formData.get("accountName") as string) || null;
  const description = (formData.get("description") as string) || null;
  const isActive = formData.get("isActive") === "true";

  const imageFile = formData.get("image") as File | null;
  const image = await saveImage(imageFile);

  try {
    await prisma.paymentMethod.create({
      data: { name, type, accountNumber, accountName, image, description, isActive },
    });
    revalidatePath("/admin/metode-bayar");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal membuat metode pembayaran." };
  }
}

export async function updatePaymentMethod(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const accountNumber = (formData.get("accountNumber") as string) || null;
  const accountName = (formData.get("accountName") as string) || null;
  const description = (formData.get("description") as string) || null;
  const isActive = formData.get("isActive") === "true";

  const imageFile = formData.get("image") as File | null;
  let image = undefined;

  // If a new file was uploaded, save it and update the image path
  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    const savedImagePath = await saveImage(imageFile);
    if (savedImagePath) {
      image = savedImagePath;
    }
  }

  const dataToUpdate: any = { name, type, accountNumber, accountName, description, isActive };
  if (image !== undefined) {
    dataToUpdate.image = image;
  }

  try {
    await prisma.paymentMethod.update({
      where: { id },
      data: dataToUpdate,
    });
    revalidatePath("/admin/metode-bayar");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal memperbarui metode pembayaran." };
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    await prisma.paymentMethod.delete({
      where: { id },
    });
    revalidatePath("/admin/metode-bayar");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menghapus metode pembayaran." };
  }
}
