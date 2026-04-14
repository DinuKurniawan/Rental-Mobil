import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { CarWithCategory } from "@/lib/types";

// Get all available cars with category, optionally filtered by category slug
export const getCars = cache(async (categorySlug?: string): Promise<CarWithCategory[]> => {
  const cars = await prisma.car.findMany({
    where: { 
      status: "AVAILABLE",
      ...(categorySlug && categorySlug !== 'all' ? { category: { slug: categorySlug } } : {})
    },
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  });
  return cars as CarWithCategory[];
});

// Get all categories
export const getCategories = cache(async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
});

// Get all cars (including non-available) with category
export const getAllCars = cache(async (): Promise<CarWithCategory[]> => {
  const cars = await prisma.car.findMany({
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  });
  return cars as CarWithCategory[];
});

// Get featured cars (top rated, available, limited)
export const getFeaturedCars = cache(async (limit = 4): Promise<CarWithCategory[]> => {
  const cars = await prisma.car.findMany({
    where: { status: "AVAILABLE" },
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return cars as CarWithCategory[];
});

// Get a car by slug
export const getCarBySlug = cache(async (slug: string): Promise<CarWithCategory | null> => {
  return prisma.car.findUnique({
    where: { slug },
    include: { category: true, images: true },
  });
});

// Get a car by ID
export const getCarById = cache(async (id: string): Promise<CarWithCategory | null> => {
  return prisma.car.findUnique({
    where: { id },
    include: { category: true, images: true },
  });
});

// Get current user profile
export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.email) return null;

  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });
});

// Get all reviews
export const getReviews = cache(async (limit = 10) => {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
});

// Get car count
export const getCarCount = cache(async () => {
  return prisma.car.count({
    where: { status: "AVAILABLE" },
  });
});

// Get total user count
export const getUserCount = cache(async () => {
  return prisma.user.count();
});

// Get today's booking count
export const getTodayBookingCount = cache(async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return prisma.booking.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });
});

// Get all unique brands from available cars
export const getUniqueBrands = cache(async () => {
  const brands = await prisma.car.findMany({
    where: { status: "AVAILABLE" },
    select: { brand: true },
    distinct: ['brand'],
  });
  return brands.map(b => b.brand).filter(Boolean) as string[];
});
