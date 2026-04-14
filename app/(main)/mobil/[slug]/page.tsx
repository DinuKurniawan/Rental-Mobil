import { getCarBySlug } from "@/lib/data";
import { serializeCar } from "@/lib/types";
import { notFound } from "next/navigation";
import ImageCarousel from "@/components/CarDetail/ImageCarousel";
import BookingButton from "@/components/CarDetail/BookingButton";
import { 
  Users, 
  Settings, 
  Fuel, 
  Calendar, 
  ChevronLeft, 
  Star,
  CheckCircle2,
  Info
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  
  if (!car) return { title: "Mobil Tidak Ditemukan" };
  
  return {
    title: `${car.name} - Sewa Mobil di DriveKita`,
    description: car.description,
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { slug } = await params;
  const carData = await getCarBySlug(slug);

  if (!carData) {
    notFound();
  }

  const car = serializeCar(carData);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      {/* Breadcrumbs / Back button */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/mobil">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-primary mb-6">
            <ChevronLeft className="h-4 w-4" />
            Kembali ke Daftar Mobil
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{car.brand || car.category.name}</span>
              <div className="flex items-center gap-1 text-sm font-bold">
                 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                 <span>{car.rating}</span>
                 <span className="text-slate-400 font-normal">(48 Ulasan)</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">{car.name}</h1>
          </div>
          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Model Tahun {car.year}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <ImageCarousel images={car.images.map(img => img.url)} name={car.name} />

            {/* Specifications */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Spesifikasi Utama</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "Kapasitas", val: `${car.capacity} Orang` },
                  { icon: Settings, label: "Transmisi", val: car.transmission },
                  { icon: Fuel, label: "Bahan Bakar", val: car.fuel },
                  { icon: Calendar, label: "Tahun", val: car.year },
                ].map((spec, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center gap-2 transition-transform hover:scale-105">
                    <spec.icon className="h-6 w-6 text-primary" />
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{spec.label}</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{spec.val}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Description */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold mb-4">Tentang Mobil</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic">
                &quot;{car.description}&quot;
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {car.parsedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Booking Button */}
          <div className="lg:col-span-1">
            <BookingButton car={car} />
          </div>
        </div>
      </div>
    </div>
  );
}
