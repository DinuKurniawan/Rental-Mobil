"use client";

import Link from "next/link";
import { 
  FacebookIcon as Facebook, 
  InstagramIcon as Instagram, 
  TwitterIcon as Twitter, 
  MailIcon as Mail, 
  PhoneIcon as Phone, 
  MapPinIcon as MapPin 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-8">
            <Link href="/" className="group">
              <span className="text-2xl font-black tracking-tight uppercase">
                Drive<span className="text-muted-foreground/40 group-hover:text-foreground transition-colors">Kita</span>
              </span>
            </Link>
            <p className="text-[13px] text-muted-foreground font-medium leading-relaxed max-w-xs">
              Redefining mobility with a focus on simplicity, quality, and seamless experience. Your journey, our commitment.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-muted-foreground/80">Services</h3>
            <ul className="space-y-3 text-[13px] font-bold">
               <li><Link href="/mobil" className="opacity-60 hover:opacity-100 transition-opacity">Fleet</Link></li>
               <li><Link href="/booking" className="opacity-60 hover:opacity-100 transition-opacity">Booking</Link></li>
               <li><Link href="/tentang" className="opacity-60 hover:opacity-100 transition-opacity">Company</Link></li>
               <li><Link href="#" className="opacity-60 hover:opacity-100 transition-opacity">Terms</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-muted-foreground/80">Support</h3>
            <ul className="space-y-3 text-[13px] font-bold">
               <li><Link href="#" className="opacity-60 hover:opacity-100 transition-opacity">FAQ</Link></li>
               <li><Link href="#" className="opacity-60 hover:opacity-100 transition-opacity">Help Center</Link></li>
               <li><Link href="#" className="opacity-60 hover:opacity-100 transition-opacity">Privacy</Link></li>
               <li><Link href="#" className="opacity-60 hover:opacity-100 transition-opacity">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-muted-foreground/80">Location</h3>
            <ul className="space-y-4 text-[13px] font-bold">
               <li className="flex gap-3">
                 <MapPin className="h-4 w-4 shrink-0 opacity-40" />
                 <span className="opacity-80">Jl. Sudirman No. 123, Jakarta Pusat</span>
               </li>
               <li className="flex gap-3">
                 <Phone className="h-4 w-4 shrink-0 opacity-40" />
                 <span className="opacity-80">+62 812 3456 7890</span>
               </li>
               <li className="flex gap-3">
                 <Mail className="h-4 w-4 shrink-0 opacity-40" />
                 <span className="opacity-80">info@drivekita.com</span>
               </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          <p>© 2024 DRIVEKITA — ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Data Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
