"use client";

declare global {
  interface Window {
    snap: any;
  }
}

import { useBookingStore } from "@/lib/store";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
  Car as CarIcon,
  ShieldCheck,
  QrCode,
  Building2,
  Copy,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { cn, formatNumber } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { validateVoucher } from "@/app/admin/voucher/actions";
import { createBooking } from "@/lib/actions";

const customerSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone: z.string().min(10, "Nomor hp minimal 10 digit"),
});

type CustomerForm = z.infer<typeof customerSchema>;

export default function BookingFlow() {
  const router = useRouter();
  const { booking, setBooking, currentStep, setStep, resetBooking } =
    useBookingStore();
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<
    "MIDTRANS" | "QRIS" | "BANK"
  >("MIDTRANS");
  const [showManualDetails, setShowManualDetails] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars");
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };
    fetchCars();
  }, []);

  const car = useMemo(
    () => cars.find((c) => c.id === booking.carId),
    [booking.carId, cars],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: booking.customerName || "",
      phone: booking.customerPhone || "",
    },
  });

  const nextStep = () => setStep(currentStep + 1);
  const prevStep = () => setStep(currentStep - 1);

  const onCustomerSubmit = (data: CustomerForm) => {
    setBooking({
      customerName: data.name,
      customerPhone: data.phone,
    });
    nextStep();
  };

  const calculateDays = () => {
    if (!booking.startDate || !booking.endDate) return 1;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const days = differenceInDays(end, start);
    return days > 0 ? days : 1;
  };

  const totalDays = calculateDays();
  const basePrice = car ? car.pricePerDay * totalDays : 0;
  const discount = booking.discountAmount || 0;
  const totalPrice = basePrice - discount;

  const [voucherInput, setVoucherInput] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const applyVoucher = async () => {
    if (!voucherInput) return;
    setIsApplying(true);

    try {
      const voucher = await validateVoucher(voucherInput);
      let discountValue = 0;

      if (voucher.type === "PERCENTAGE") {
        discountValue = Math.floor(basePrice * (voucher.value / 100));
      } else {
        discountValue = voucher.value;
      }

      setBooking({
        voucherCode: voucher.code,
        discountAmount: discountValue,
      });
      toast.success(`Voucher ${voucher.code} berhasil dipasang!`);
    } catch (error: any) {
      toast.error(error.message || "Kode voucher tidak valid");
    } finally {
      setIsApplying(false);
    }
  };

  const removeVoucher = () => {
    setBooking({
      voucherCode: "",
      discountAmount: 0,
    });
    setVoucherInput("");
    toast.info("Voucher removed");
  };

  const handlePayment = async () => {
    if (!car || !booking.startDate || !booking.endDate) return;

    setLoading(true);
    try {
      // 1. Create booking in DB
      const result = await createBooking({
        carId: car.id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: totalPrice,
        customerName: booking.customerName || "",
        customerPhone: booking.customerPhone || "",
        customerEmail: booking.customerEmail,
        location: booking.location,
        paymentMethod: paymentMethod,
      });

      if (!result.success) {
        toast.error(result.error || "Gagal membuat pesanan");
        return;
      }

      if (paymentMethod === "MIDTRANS") {
        const response = await fetch("/api/tokenizer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: car?.id,
            name: car?.name,
            price: car?.pricePerDay,
            quantity: totalDays,
            customerDetails: {
              name: booking.customerName,
              email: booking.customerEmail || "customer@guest.drivekita.com",
              phone: booking.customerPhone,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Tokenizer Error:", data);
          toast.error(`Pembayaran Gagal: ${data.details || "Gagal membuat transaksi"}`);
          return;
        }

        if (data.token) {
          window.snap.pay(data.token, {
            onSuccess: (result: any) => {
              console.log("success", result);
              nextStep();
            },
            onPending: (result: any) => {
              console.log("pending", result);
              nextStep();
            },
            onError: (result: any) => {
              console.log("error", result);
              toast.error("Pembayaran gagal");
            },
            onClose: () => {
              console.log(
                "customer closed the popup without finishing the payment",
              );
            },
          });
        }
      } else {
        setShowManualDetails(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin`);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12 gap-2 md:gap-4 overflow-x-auto py-2">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500",
              currentStep === step
                ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30"
                : currentStep > step
                  ? "bg-green-500 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500",
            )}
          >
            {currentStep > step ? <Check className="h-5 w-5" /> : step}
          </div>
          {step < 4 && (
            <div
              className={cn(
                "h-1 w-8 md:w-16 rounded",
                currentStep > step
                  ? "bg-green-500"
                  : "bg-slate-200 dark:bg-slate-800",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 md:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-12 space-y-2">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Selesaikan <span className="text-primary italic">Booking</span> Anda
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Hanya beberapa langkah lagi sebelum Anda bisa menikmati armada
            pilihan kami. Let's hit the road!
          </p>
        </div>

        <StepIndicator />

        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-8 border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-[32px]">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <span className="p-2 bg-primary/10 rounded-xl">
                    <Calendar className="h-5 w-5 text-primary" />
                  </span>
                  Pengaturan Jadwal & Lokasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-foreground font-black uppercase tracking-widest text-[10px] px-1">
                      Tanggal Mulai Sewa
                    </Label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
                      <Input
                        type="date"
                        className="h-14 pl-12 rounded-2xl bg-muted/30 border-border focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5 transition-all text-foreground font-medium"
                        value={booking.startDate || ""}
                        onChange={(e) =>
                          setBooking({ startDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-foreground font-black uppercase tracking-widest text-[10px] px-1">
                      Tanggal Selesai Sewa
                    </Label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
                      <Input
                        type="date"
                        className="h-14 pl-12 rounded-2xl bg-muted/30 border-border focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5 transition-all text-foreground font-medium"
                        value={booking.endDate || ""}
                        onChange={(e) =>
                          setBooking({ endDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-foreground font-black uppercase tracking-widest text-[10px] px-1">
                      Lokasi Penjemputan
                    </Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
                      <textarea
                        placeholder="Masukkan alamat lengkap atau nama gedung penjemputan..."
                        className="w-full min-h-[120px] p-4 pl-12 rounded-2xl bg-muted/30 border border-border text-foreground font-medium placeholder:text-muted-foreground/30 focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5 transition-all resize-none outline-0"
                        value={booking.location || ""}
                        onChange={(e) =>
                          setBooking({ location: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {car && (
                <Card className="p-1 items-center border-none shadow-xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent rounded-[32px] overflow-hidden group">
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-[31px] flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative w-48 h-32 rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={
                          car.image ||
                          (car.images && car.images[0]?.url) ||
                          "/images/hero_premium.png"
                        }
                        alt={car.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center md:text-left space-y-1">
                      <h4 className="text-xl font-black">{car.name}</h4>
                      <p className="text-slate-500">
                        {car.brand || car.category?.name} • {car.transmission} •{" "}
                        {car.capacity} Seat
                      </p>
                      <div className="pt-2">
                        <span className="text-primary font-black text-lg">
                          Rp {formatNumber(car.pricePerDay)}
                        </span>
                        <span className="text-slate-400 text-sm font-medium ml-1">
                          / hari
                        </span>
                      </div>
                    </div>
                    <div className="grow" />
                    <Button
                      variant="ghost"
                      className="rounded-2xl h-12 px-6 group"
                      onClick={() => router.push("/mobil")}
                    >
                      Ganti Mobil{" "}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              )}

              <div className="flex justify-end">
                <Button
                  size="lg"
                  className="px-10 rounded-2xl h-14 gap-2 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  disabled={
                    !booking.startDate || !booking.endDate || !booking.location
                  }
                  onClick={() => {
                    setBooking({ totalPrice: totalPrice });
                    nextStep();
                  }}
                >
                  Lanjut ke Data Diri <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="relative space-y-6">
              <Card className="p-8 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[32px] space-y-6">
                <div className="space-y-4">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    Voucher Code
                  </h4>
                  {!booking.voucherCode ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter Code (e.g. DRIVEKITA)"
                        className="h-12 rounded-xl bg-muted/30 border-border text-[11px] font-black uppercase tracking-widest"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        className="h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-border"
                        onClick={applyVoucher}
                        disabled={isApplying || !voucherInput}
                      >
                        {isApplying ? "..." : "Apply"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-green-500">
                          {booking.voucherCode} Applied
                        </span>
                      </div>
                      <button
                        className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:opacity-50 transition-opacity"
                        onClick={removeVoucher}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <Separator className="bg-border/50" />

                <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  Summary
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">
                      Rental Duration
                    </span>
                    <span className="font-black text-[11px] uppercase p-2 bg-muted rounded-lg tracking-widest">
                      {totalDays} Days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">
                      Base Price
                    </span>
                    <span className="font-bold">
                      Rp {formatNumber(basePrice)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-500 animate-in fade-in slide-in-from-top-2">
                      <span className="font-medium">Discount</span>
                      <span className="font-bold">
                        - Rp {formatNumber(discount)}
                      </span>
                    </div>
                  )}

                  <Separator className="bg-border/50" />
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] text-muted-foreground/50 uppercase font-black tracking-widest">
                      Total Payment
                    </p>
                    <div className="text-4xl font-black">
                      Rp {formatNumber(totalPrice)}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-foreground/40 shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    Includes Basic Insurance & 24/7 Roadside Assist
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Card className="p-10 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[40px]">
              <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                <span className="p-3 bg-primary/10 rounded-2xl">
                  <User className="h-6 w-6 text-primary" />
                </span>
                Informasi Penyewa
              </h3>
              <form
                onSubmit={handleSubmit(onCustomerSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <Label className="text-slate-600 font-semibold px-1">
                      Nama Lengkap (Sesuai KTP)
                    </Label>
                    <Input
                      {...register("name")}
                      placeholder="Contoh: Budi Santoso"
                      className={cn(
                        "h-14 rounded-2xl text-lg",
                        errors.name && "border-red-500 focus:ring-red-500/10",
                      )}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 pl-1 font-medium">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label className="text-slate-600 font-semibold px-1">
                      Nomor WhatsApp
                    </Label>
                    <Input
                      {...register("phone")}
                      placeholder="Contoh: 081234567890"
                      className={cn(
                        "h-14 rounded-2xl text-lg",
                        errors.phone && "border-red-500",
                      )}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 pl-1 font-medium">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    className="h-14 px-8 rounded-2xl font-bold"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" /> Kembali
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 px-12 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
                  >
                    Lanjut ke Pembayaran{" "}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            {!showManualDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-3 space-y-6">
                  <Card className="p-8 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[40px]">
                    <h3 className="text-2xl font-black mb-8">
                      Pilih Metode Pembayaran
                    </h3>

                    <div className="space-y-4">
                      <div
                        className={cn(
                          "p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-6 group relative overflow-hidden",
                          paymentMethod === "MIDTRANS"
                            ? "border-primary bg-primary/5"
                            : "border-slate-100 hover:border-slate-300",
                        )}
                        onClick={() => setPaymentMethod("MIDTRANS")}
                      >
                        <div
                          className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                            paymentMethod === "MIDTRANS"
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-400 group-hover:bg-slate-200",
                          )}
                        >
                          <CreditCard className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-lg">
                            Pembayaran Otomatis
                          </h4>
                          <p className="text-sm text-slate-500">
                            ATM, Kartu Kredit, GOPAY, ShopeePay, dll via
                            Midtrans
                          </p>
                        </div>
                        {paymentMethod === "MIDTRANS" && (
                          <div className="absolute top-4 right-4 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div
                        className={cn(
                          "p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-6 group relative overflow-hidden",
                          paymentMethod === "QRIS"
                            ? "border-primary bg-primary/5"
                            : "border-slate-100 hover:border-slate-300",
                        )}
                        onClick={() => setPaymentMethod("QRIS")}
                      >
                        <div
                          className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                            paymentMethod === "QRIS"
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-400 group-hover:bg-slate-200",
                          )}
                        >
                          <QrCode className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-lg">QRIS E-Wallet</h4>
                          <p className="text-sm text-slate-500">
                            Scan kode QR untuk pembayaran instan via OVO, DANA,
                            LinkAja
                          </p>
                        </div>
                        {paymentMethod === "QRIS" && (
                          <div className="absolute top-4 right-4 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div
                        className={cn(
                          "p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-6 group relative overflow-hidden",
                          paymentMethod === "BANK"
                            ? "border-primary bg-primary/5"
                            : "border-slate-100 hover:border-slate-300",
                        )}
                        onClick={() => setPaymentMethod("BANK")}
                      >
                        <div
                          className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                            paymentMethod === "BANK"
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-400 group-hover:bg-slate-200",
                          )}
                        >
                          <Building2 className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-lg">
                            Transfer Bank Manual
                          </h4>
                          <p className="text-sm text-slate-500">
                            Transfer manual ke rekening BCA, Mandiri, atau BNI
                            kami
                          </p>
                        </div>
                        {paymentMethod === "BANK" && (
                          <div className="absolute top-4 right-4 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-8 flex flex-col gap-4">
                      <Button
                        size="lg"
                        className="h-16 rounded-[24px] font-black text-xl shadow-2xl shadow-primary/30"
                        onClick={handlePayment}
                        disabled={loading}
                      >
                        {loading
                          ? "Memproses..."
                          : paymentMethod === "MIDTRANS"
                            ? "Bayar Sekarang"
                            : "Lihat Detail Bayar"}
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-12 text-slate-400"
                        onClick={prevStep}
                      >
                        Ganti Data Diri
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <Card className="p-8 border-none shadow-2xl bg-slate-900 text-white rounded-[40px]">
                    <h4 className="text-slate-400 uppercase tracking-widest font-black text-sm mb-6">
                      Konfirmasi Pesanan
                    </h4>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <CarIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-black">
                            Mobil
                          </p>
                          <p className="font-bold">{car?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-black">
                            Durasi
                          </p>
                          <p className="font-bold">{totalDays} Hari</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <User className="h-6 w-6" />
                        </div>
                        <div className="truncate pr-4">
                          <p className="text-xs text-slate-500 uppercase font-black">
                            Penyewa
                          </p>
                          <p className="font-bold truncate">
                            {booking.customerName}
                          </p>
                        </div>
                      </div>

                      <Separator className="bg-white/10" />

                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 uppercase font-black">
                          Total Tagihan
                        </p>
                        <div className="text-4xl font-black text-primary">
                          Rp {formatNumber(totalPrice)}
                        </div>
                      </div>

                      <div className="p-4 bg-primary/10 rounded-2xl flex gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                        <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-black">
                          Transaksi Dijamin Aman & Terenkripsi 256-bit SSL
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-500">
                <Card className="p-10 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[40px] text-center">
                  <h3 className="text-2xl font-black mb-2">
                    Instruksi Pembayaran
                  </h3>
                  <p className="text-slate-500 mb-8">
                    Silakan selesaikan pembayaran agar pesanan dapat
                    dikonfirmasi.
                  </p>

                  {paymentMethod === "QRIS" ? (
                    <div className="space-y-8">
                      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[32px] border-2 border-slate-100 dark:border-slate-700 relative group overflow-hidden">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 rounded-full border shadow-sm z-10 font-black text-[10px] uppercase">
                          Scan & Bayar
                        </div>
                        <div className="relative aspect-square w-64 mx-auto rounded-2xl overflow-hidden mt-4">
                          <Image
                            src="/images/qris.png"
                            alt="QRIS"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="mt-6 space-y-2">
                          <p className="text-sm font-black uppercase text-slate-400 tracking-wider">
                            Total yang harus dibayar
                          </p>
                          <p className="text-4xl font-black text-primary">
                            Rp {formatNumber(totalPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex gap-4 text-left border border-blue-100 dark:border-blue-800">
                        <Info className="h-6 w-6 text-blue-500 shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Harap kirimkan <strong>tepat sasaran</strong> sesuai
                          nominal di atas. Sistem kami mendeteksi pembayaran
                          secara otomatis setelah 2-5 menit.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl text-left flex justify-between items-center group">
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase mb-1">
                              Bank BCA
                            </p>
                            <p className="text-2xl font-black tracking-widest font-mono">
                              123 - 4567 - 890
                            </p>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                              A/N PT DRIVEKITA TRANS INDONESIA
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full h-12 w-12"
                            onClick={() =>
                              copyToClipboard("1234567890", "Nomor Rekening")
                            }
                          >
                            <Copy className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl text-left flex justify-between items-center">
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase mb-1">
                              Bank MANDIRI
                            </p>
                            <p className="text-2xl font-black tracking-widest font-mono">
                              008 - 987 - 654321
                            </p>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                              A/N PT DRIVEKITA TRANS INDONESIA
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full h-12 w-12"
                            onClick={() =>
                              copyToClipboard("008987654321", "Nomor Rekening")
                            }
                          >
                            <Copy className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-primary/5 rounded-3xl p-6 border-2 border-primary/10">
                        <p className="text-xs font-black text-slate-400 uppercase mb-1">
                          Total Transfer
                        </p>
                        <div className="text-4xl font-black text-primary flex items-center justify-center gap-3">
                          Rp {formatNumber(totalPrice)}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-primary/50"
                            onClick={() =>
                              copyToClipboard(totalPrice.toString(), "Nominal")
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 mt-10">
                    <Button
                      size="lg"
                      className="h-16 rounded-2xl font-black text-xl shadow-xl shadow-primary/20"
                      onClick={() => {
                        toast.success("Sedang memverifikasi pembayaran...");
                        setTimeout(() => {
                          nextStep();
                        }, 3000);
                      }}
                    >
                      Sudah Transfer - Konfirmasi
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-12"
                      onClick={() => setShowManualDetails(false)}
                    >
                      Pilih Metode Lain
                    </Button>
                  </div>
                </Card>

                <div className="text-center space-y-4">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Butuh Bantuan?
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full px-8 h-12 border-slate-200"
                    onClick={() => window.open("https://wa.me/628123456789")}
                  >
                    Hubungi Support via WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto text-center space-y-10 animate-in zoom-in-95 duration-700">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-[60px] opacity-20 scale-150 animate-pulse" />
              <div className="relative bg-green-500 text-white p-8 rounded-[40px] inline-block shadow-2xl shadow-green-500/30">
                <Check className="h-16 w-16 stroke-3" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tight leading-tight">
                Booking <span className="text-green-500">Berhasil!</span>
              </h2>
              <p className="text-slate-500 text-xl max-w-lg mx-auto leading-relaxed">
                Selamat! Pembayaran Anda telah kami verifikasi. Mesin sedang
                dipanaskan untuk Anda.
              </p>
            </div>

            <Card className="p-1 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[32px] text-left">
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      Booking ID
                    </p>
                    <p className="font-mono text-lg font-bold">
                      #DK-{Math.floor(Math.random() * 90000) + 10000}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      Metode
                    </p>
                    <p className="font-bold underline">
                      {paymentMethod === "MIDTRANS"
                        ? "Otomatis"
                        : paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <div className="flex items-center gap-2 text-green-500">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-bold uppercase text-sm">
                        Pembayaran Lunas
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      Tanggal
                    </p>
                    <p className="font-bold">
                      {format(new Date(), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    E-Tiket dan Invoice telah dikirimkan ke <br />
                    <span className="text-slate-900 dark:text-white font-bold">
                      {booking.customerEmail}
                    </span>
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                className="flex-1 h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                onClick={() => {
                  resetBooking();
                  router.push("/");
                }}
              >
                Kembali ke Beranda
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-16 rounded-2xl font-black text-lg border-2 hover:bg-slate-50"
              >
                Lihat Riwayat Sewa
              </Button>
            </div>

            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Abaikan jika ini bukan Anda. Laporkan masalah ke cs@drivekita.com
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
