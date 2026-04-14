import Link from "next/link";
import { 
  LayoutDashboard, 
  Car, 
  Layers, 
  Users, 
  CreditCard, 
  Wallet,
  LogOut,
  Menu,
  ChevronRight,
  Settings,
  Ticket,
  Globe,
  ExternalLink
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { handleSignOut } from "@/lib/actions";
import { cn } from "@/lib/utils";


const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Mobil", href: "/admin/mobil", icon: Car },
  { name: "Kategori", href: "/admin/kategori", icon: Layers },
  { name: "Akun", href: "/admin/akun", icon: Users },
  { name: "Voucher", href: "/admin/voucher", icon: Ticket },
  { name: "Pembayaran", href: "/admin/pembayaran", icon: CreditCard },
  { name: "Metode Bayar", href: "/admin/metode-bayar", icon: Wallet },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <Car className="h-6 w-6" />
            <span>DriveKita Admin</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <div className="mb-6">
            <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Main Menu</p>
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary active:scale-95"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Website</p>
            <Link
              href="/"
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4" />
                Back to Site
              </div>
              <ExternalLink className="h-3 w-3 opacity-40" />
            </Link>
          </div>
        </nav>
        <div className="border-t p-4">
          <form action={handleSignOut}>
            <Button type="submit" variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-background px-4 lg:hidden">
          <Sheet>
            <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-lg")}>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-primary">
                  <Car className="h-6 w-6" />
                  <span>DriveKita Admin</span>
                </Link>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-0 w-full border-t p-4">
                 <form action={handleSignOut}>
                  <Button type="submit" variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600">
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </Button>
                </form>
              </div>
            </SheetContent>

          </Sheet>
          <div className="ml-4 font-bold text-primary">DriveKita</div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
