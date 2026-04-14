"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, ArrowLeft, Mail, Lock, User, Phone, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Right Column - Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-2 rounded-xl">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary">DriveKita</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Buat Akun Baru</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Bergabunglah dengan ribuan pengguna lainnya dan nikmati kemudahan merental mobil.
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-5" action="#" method="POST">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100">
                    Nama Depan
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      required
                      placeholder="John"
                      className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:ring-slate-700 dark:text-white sm:text-sm sm:leading-6 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100">
                    Nama Belakang
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      required
                      placeholder="Doe"
                      className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:ring-slate-700 dark:text-white sm:text-sm sm:leading-6 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100">
                  Email
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="nama@email.com"
                    className="block w-full rounded-xl border-0 py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:ring-slate-700 dark:text-white sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100">
                  Nomor Telepon (WhatsApp)
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="081234567890"
                    className="block w-full rounded-xl border-0 py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:ring-slate-700 dark:text-white sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100">
                  Kata Sandi
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Minimal 8 karakter"
                    className="block w-full rounded-xl border-0 py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:ring-slate-700 dark:text-white sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="terms" className="ml-3 block text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Saya setuju dengan{" "}
                  <Link href="#" className="font-semibold text-primary">Syarat & Ketentuan</Link> serta{" "}
                  <Link href="#" className="font-semibold text-primary">Kebijakan Privasi</Link> DriveKita.
                </label>
              </div>

              <div>
                <Button className="w-full rounded-xl py-6 font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  Daftar Sekarang
                </Button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/masuk" className="font-semibold leading-6 text-primary hover:text-primary/80">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Left Column - Benefits */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/register_background_car_1776090297084.png"
          alt="Car Interior"
          fill
          priority
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-center p-20 text-white">
          <div className="max-w-md space-y-8">
            <h3 className="text-4xl font-bold tracking-tight">Nikmati Keuntungan Member</h3>
            <ul className="space-y-6">
              {[
                "Diskon 10% untuk penyewaan pertama Anda",
                "Akses ke armada eksklusif dan terbatas",
                "Layanan pelanggan prioritas 24 jam",
                "Proses verifikasi dokumen lebih cepat",
                "Kumpulkan poin untuk gratis sewa di masa depan"
              ].map((benefit, i) => (
                <li key={i} className="flex gap-4 items-center">
                  <div className="bg-primary/20 p-1.5 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
