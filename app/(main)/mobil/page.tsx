import { getCars, getCategories, getUniqueBrands } from "@/lib/data";
import CarListingClient from "./CarListingClient";

export const metadata = {
  title: "Daftar Mobil - DriveKita",
  description: "Temukan armada mobil terbaik untuk perjalanan Anda.",
};

export default async function CarListingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  
  // Fetch all available cars instead of pre-filtering, 
  // so all categories are available in the client-side filter
  const [cars, categories, brands] = await Promise.all([
    getCars("all"), 
    getCategories(),
    getUniqueBrands(),
  ]);
  
  return (
    <CarListingClient 
      initialCars={cars} 
      categories={categories} 
      availableBrands={brands}
      initialCategorySlug={categorySlug}
    />
  );
}
