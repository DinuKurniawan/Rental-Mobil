"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { z } from "zod";

async function saveImages(imageFiles: File[]): Promise<string[]> {
  const savedPaths: string[] = [];
  
  if (!imageFiles || imageFiles.length === 0) {
    return [];
  }
  
  try {
    const uploadDir = path.join(process.cwd(), "public/images/cars");
    await mkdir(uploadDir, { recursive: true });
    
    for (const imageFile of imageFiles) {
      if (!(imageFile instanceof File) || imageFile.size === 0) continue;
      
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      const ext = path.extname(imageFile.name) || ".png";
      const filename = `car-${uniqueSuffix}${ext}`;
      const filePath = path.join(uploadDir, filename);
      
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(filePath, buffer);
      
      savedPaths.push(`/images/cars/${filename}`);
    }
    
    return savedPaths;
  } catch (error) {
    console.error("Error saving images:", error);
    return savedPaths;
  }
}

const CarSchema = z.object({
  name: z.string().min(1, "Nama mobil wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  brand: z.string().optional(),
  description: z.string().optional(),
  pricePerDay: z.number().min(0),
  year: z.number().optional(),
  transmission: z.string(),
  capacity: z.number().min(1),
  fuel: z.string(),
  categoryId: z.string(),
  status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]),
});

export async function createCar(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    brand: formData.get("brand") as string,
    description: formData.get("description") as string,
    pricePerDay: parseFloat(formData.get("pricePerDay") as string),
    year: formData.get("year") ? parseInt(formData.get("year") as string) : undefined,
    transmission: formData.get("transmission") as string,
    capacity: parseInt(formData.get("capacity") as string),
    fuel: formData.get("fuel") as string,
    categoryId: formData.get("categoryId") as string,
    status: formData.get("status") as any,
  };

  const result = CarSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const imageFiles = formData.getAll("images") as File[];
  const imageUrls = await saveImages(imageFiles);

  try {
    await prisma.car.create({
      data: {
        ...result.data,
        images: {
          create: imageUrls.map(url => ({ url }))
        }
      },
    });
    revalidatePath("/admin/mobil");
    return { success: true };
  } catch (error: any) {
    console.error("Prisma Error:", error);
    return { error: "Gagal membuat mobil. Slug mungkin sudah digunakan." };
  }
}

export async function updateCar(id: string, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    brand: formData.get("brand") as string,
    description: formData.get("description") as string,
    pricePerDay: parseFloat(formData.get("pricePerDay") as string),
    year: formData.get("year") ? parseInt(formData.get("year") as string) : undefined,
    transmission: formData.get("transmission") as string,
    capacity: parseInt(formData.get("capacity") as string),
    fuel: formData.get("fuel") as string,
    categoryId: formData.get("categoryId") as string,
    status: formData.get("status") as any,
  };

  const result = CarSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const imageFiles = formData.getAll("images") as File[];
  const newImageUrls = await saveImages(imageFiles);

  try {
    await prisma.$transaction(async (tx) => {
      // Update basic info
      await tx.car.update({
        where: { id },
        data: result.data,
      });

      // Add new images if any
      if (newImageUrls.length > 0) {
        await tx.carImage.createMany({
          data: newImageUrls.map(url => ({
            url,
            carId: id
          }))
        });
      }
    });

    revalidatePath("/admin/mobil");
    return { success: true };
  } catch (error: any) {
    console.error("Prisma Error:", error);
    return { error: "Gagal memperbarui mobil." };
  }
}

export async function deleteCarImage(imageId: string) {
  try {
    await prisma.carImage.delete({
      where: { id: imageId }
    });
    revalidatePath("/admin/mobil");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus gambar." };
  }
}

export async function deleteCar(id: string) {
  try {
    await prisma.car.delete({
      where: { id },
    });
    revalidatePath("/admin/mobil");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menghapus mobil. Pastikan tidak ada data booking yang terkait." };
  }
}
