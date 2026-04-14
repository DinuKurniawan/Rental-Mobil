import { getFeaturedCars } from "@/lib/data";
import CarCard from "./CarCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function FeaturedCars() {
  const featured = await getFeaturedCars(4);

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Featured <span className="text-muted-foreground/30">Fleet</span>
            </h2>
            <p className="text-muted-foreground font-medium max-w-xl text-lg leading-relaxed">
              Carefully curated selection of high-performance vehicles for your journey.
            </p>
          </div>
          <Link 
            href="/mobil" 
            className={cn(buttonVariants({ variant: "ghost" }), "group font-black uppercase tracking-widest text-[11px] h-auto p-0 hover:bg-transparent")}
          >
            Explore All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((car) => (
            <CarCard key={car.id} car={car as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
