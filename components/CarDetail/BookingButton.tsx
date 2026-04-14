"use client";

import { useBookingStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight } from "lucide-react";
import { SerializedCar } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export default function BookingButton({ car }: { car: SerializedCar }) {
  const router = useRouter();
  const setBooking = useBookingStore((state) => state.setBooking);
  const setStep = useBookingStore((state) => state.setStep);

  const handleBooking = () => {
    // Pre-fill booking with car data
    setBooking({
      carId: car.id,
      totalPrice: car.pricePerDay, // Initial price for 1 day
    });
    setStep(1);
    router.push("/booking");
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl sticky top-24">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">Harga Sewa</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary">Rp {formatNumber(car.pricePerDay)}</span>
            <span className="text-slate-500 font-medium">/hari</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
           <CalendarDays className="h-5 w-5 text-primary shrink-0" />
           <div className="text-sm">
             <p className="font-semibold">Konfirmasi Ketersediaan</p>
             <p className="text-slate-500 text-xs">Mobil tersedia untuk disewa hari ini</p>
           </div>
        </div>
      </div>

      <Button size="lg" className="w-full h-14 text-lg font-bold rounded-2xl gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" onClick={handleBooking}>
        Pesan Sekarang
        <ArrowRight className="h-5 w-5" />
      </Button>

      <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
        * Harga belum termasuk bensin, tol, dan biaya parkir. <br />
        * Termasuk Asuransi All-Risk & Layanan Darurat 24 Jam.
      </p>
    </div>
  );
}
