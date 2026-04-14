"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavLinks = [
  { name: "Beranda", href: "/" },
  { name: "Mobil", href: "/mobil" },
  { name: "Booking", href: "/booking" },
  { name: "Tentang", href: "/tentang" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled 
        ? "border-b bg-background/80 backdrop-blur-xl py-2" 
        : "bg-transparent py-4"
    )}>
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-xl font-black tracking-tight uppercase">
              Drive<span className="text-muted-foreground/50 group-hover:text-foreground transition-colors">Kita</span>
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {NavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-bold uppercase tracking-widest transition-all hover:opacity-100",
                pathname === link.href
                  ? "opacity-100"
                  : "opacity-40"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {status === "loading" ? (
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          ) : session ? (
            <>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="font-bold uppercase tracking-wider text-[11px] gap-2">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dash
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-[13px]">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-[11px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/masuk">
                <Button variant="ghost" className="font-bold uppercase tracking-wider text-[12px]">
                  Sign In
                </Button>
              </Link>
              <Link href="/daftar">
                <Button className="font-bold uppercase tracking-wider text-[12px] px-6">
                  Join
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          {!session && (
             <Link href="/masuk" className="sm:block hidden">
                <Button variant="ghost" size="sm" className="font-bold uppercase tracking-wider text-[10px]">
                  Sign In
                </Button>
             </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="rounded-full h-10 w-10"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b px-6 py-8 space-y-6 animate-in fade-in slide-in-from-top-4 overflow-y-auto max-h-[80vh]">
          {NavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block text-2xl font-black uppercase tracking-tighter transition-all",
                pathname === link.href
                  ? "opacity-100"
                  : "opacity-30"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-4 pt-8 border-t">
            {session ? (
              <>
                <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm opacity-40">
                  <User className="h-4 w-4" />
                  <span>{session.user?.name}</span>
                </div>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full font-bold uppercase tracking-widest text-xs">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full text-red-500 font-bold uppercase tracking-widest text-xs"
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/masuk" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full font-bold uppercase tracking-widest text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/daftar" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button className="w-full font-bold uppercase tracking-widest text-xs">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
