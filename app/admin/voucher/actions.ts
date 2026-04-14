"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVouchers() {
  return await prisma.voucher.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createVoucher(formData: FormData) {
  const code = formData.get("code") as string;
  const type = formData.get("type") as "PERCENTAGE" | "FIXED";
  const value = parseFloat(formData.get("value") as string);
  const usageLimit = parseInt(formData.get("usageLimit") as string);
  const expiryDateStr = formData.get("expiryDate") as string;
  const description = formData.get("description") as string;

  const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

  await prisma.voucher.create({
    data: {
      code: code.toUpperCase(),
      type,
      value,
      usageLimit,
      expiryDate,
      description,
    },
  });

  revalidatePath("/admin/voucher");
}

export async function updateVoucher(id: string, formData: FormData) {
  const code = formData.get("code") as string;
  const type = formData.get("type") as "PERCENTAGE" | "FIXED";
  const value = parseFloat(formData.get("value") as string);
  const usageLimit = parseInt(formData.get("usageLimit") as string);
  const expiryDateStr = formData.get("expiryDate") as string;
  const description = formData.get("description") as string;
  const isActive = formData.get("isActive") === "true";

  const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

  await prisma.voucher.update({
    where: { id },
    data: {
      code: code.toUpperCase(),
      type,
      value,
      usageLimit,
      expiryDate,
      description,
      isActive,
    },
  });

  revalidatePath("/admin/voucher");
}

export async function deleteVoucher(id: string) {
  await prisma.voucher.delete({
    where: { id },
  });
  revalidatePath("/admin/voucher");
}

export async function toggleVoucherStatus(id: string, currentStatus: boolean) {
  await prisma.voucher.update({
    where: { id },
    data: { isActive: !currentStatus },
  });
  revalidatePath("/admin/voucher");
}

// Client-side helper for validation
export async function validateVoucher(code: string) {
  const voucher = await prisma.voucher.findUnique({
    where: { 
      code: code.toUpperCase(),
      isActive: true,
    },
  });

  if (!voucher) {
    throw new Error("Voucher tidak ditemukan atau sudah tidak aktif");
  }

  if (voucher.expiryDate && new Date() > voucher.expiryDate) {
    throw new Error("Voucher sudah kadaluarsa");
  }

  if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
    throw new Error("Voucher sudah mencapai batas pemakaian");
  }

  return {
    code: voucher.code,
    type: voucher.type,
    value: voucher.value,
  };
}
