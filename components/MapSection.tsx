"use client";

import React from "react";
import { MapPin, Navigation, Phone, Mail } from "lucide-react";

export default function MapSection() {
  // Koordinat Jakarta (Sudirman) sesuai data di footer
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2736780093864!2d106.82103527585507!3d-6.227606360989069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f982d1c951%3A0xf608e4213898687e!2sJl.%20Jend.%20Sudirman%2C%20RT.1%2FRW.3%2C%20Senayan%2C%20Kec.%20Kby.%20Baru%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1713100000000!5m2!1sid!2sid";

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                Kunjungi Kami
              </h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
                Lokasi <br />
                <span className="text-muted-foreground/20">Strategis.</span>
              </h3>
            </div>

            <p className="text-[15px] text-muted-foreground font-medium leading-relaxed max-w-sm">
              Kami berlokasi di pusat bisnis Jakarta untuk memastikan aksesibilitas terbaik bagi pelanggan premium kami.
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider mb-1">Showroom Utama</h4>
                  <p className="text-sm font-bold opacity-60">Jl. Sudirman No. 123, Jakarta Pusat</p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider mb-1">Akses</h4>
                  <p className="text-sm font-bold opacity-60">5 Menit dari Stasiun MRT Setiabudi Astra</p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider mb-1">Kontak Langsung</h4>
                  <p className="text-sm font-bold opacity-60">+62 812 3456 7890</p>
                </div>
              </div>
            </div>

            <a 
              href="https://www.google.com/maps/search/?api=1&query=Jl.+Sudirman+No.+123,+Jakarta+Pusat"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] pt-4 w-fit"
            >
              <span className="pb-1 border-b-2 border-foreground transition-all group-hover:pr-4">Buka di Google Maps</span>
              <Navigation className="h-3.5 w-3.5 rotate-45" />
            </a>
          </div>

          {/* Map Side */}
          <div className="lg:col-span-7 h-[500px] lg:h-[600px] rounded-3xl overflow-hidden border border-border/50 shadow-2xl relative">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DriveKita Location"
              className="w-full h-full"
            ></iframe>
            
            {/* Overlay for aesthetic */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-3xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
