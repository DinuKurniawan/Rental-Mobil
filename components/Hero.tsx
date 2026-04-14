import { Button, buttonVariants } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { getCategories, getCarCount, getUserCount, getTodayBookingCount } from "@/lib/data";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function Hero() {
  const [categories, carCount, userCount, todayBookings] = await Promise.all([
    getCategories(),
    getCarCount(),
    getUserCount(),
    getTodayBookingCount(),
  ]);

  // Fallback for demo if counts are low
  const displayUserCount = userCount > 10 ? `${(userCount / 1000).toFixed(1)}K` : "1.2K";
  const displayBookingToday = todayBookings > 0 ? todayBookings : 12;

  return (
    <section className="relative w-full min-h-[85vh] flex items-center pt-20 pb-12 overflow-hidden bg-background">
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <span>Next Generation Rental</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.85] uppercase">
                Move <br />
                <span className="text-muted-foreground/40 italic">Beyond</span>
              </h1>
              <p className="max-w-[500px] text-lg text-muted-foreground md:text-xl font-medium leading-relaxed tracking-tight">
                Curated selection of premium mobility. Seamless experience, absolute freedom.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/mobil"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 px-10 rounded-full font-bold uppercase tracking-widest text-[13px] group"
                )}
              >
                Browse Fleet
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/tentang"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-14 px-10 rounded-full font-bold uppercase tracking-widest text-[13px]"
                )}
              >
                Our Story
              </Link>
            </div>

            <div className="flex items-center gap-12 pt-8">
              <div className="flex flex-col">
                <span className="text-4xl font-black">{carCount}+</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Models</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black">{displayUserCount}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Clients</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            {/* Glow Effect Behind Card */}
            <div className="absolute -inset-4 bg-primary/20 blur-[60px] rounded-[60px] -z-10 animate-pulse" />
            
            <div className="p-1 rounded-[44px] bg-gradient-to-br from-border/50 via-border/5 to-transparent backdrop-blur-3xl shadow-2xl">
              <div className="bg-background/95 rounded-[40px] p-8 lg:p-10 border border-border/50 relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <div className="space-y-8 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Fast Booking</h3>
                      </div>
                      <p className="text-[13px] text-muted-foreground font-medium">Find your perfect drive in seconds.</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/50">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <SearchBar categories={categories} />

                  <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        {displayBookingToday} people booking today
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle Background Element */}
      <div className="absolute top-1/4 right-0 w-1/3 h-1/2 bg-primary/5 blur-[120px] rounded-full -z-10" />
    </section>
  );
}
