import type { Car as PrismaCar, Category, CarImage } from "@prisma/client";

// Car with its category and images relation included
export type CarWithCategory = PrismaCar & {
  category: Category;
  images: CarImage[];
};

// Serializable version of CarWithCategory for passing to client components
// (Date objects become strings when serialized)
export type SerializedCar = Omit<CarWithCategory, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  parsedFeatures: string[];
};

// Helper to serialize a CarWithCategory for client components
export function serializeCar(car: CarWithCategory): SerializedCar {
  return {
    ...car,
    createdAt: car.createdAt.toISOString(),
    updatedAt: car.updatedAt.toISOString(),
    parsedFeatures: parseFeatures(car.features),
  };
}

// Parse features from JSON string
export function parseFeatures(features: string | null): string[] {
  if (!features) return [];
  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Fallback: treat as comma-separated
    return features.split(",").map((f) => f.trim()).filter(Boolean);
  }
}
