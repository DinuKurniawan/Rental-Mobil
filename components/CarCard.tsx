import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Fuel,
  Settings,
  Star,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import { CarWithCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function CarCard({ car }: { car: CarWithCategory }) {
  const carImage = car.images && car.images[0] ? car.images[0].url : "/images/hero_premium.png";
  
  return (
    <Card className="group overflow-hidden border border-border bg-background transition-all duration-500 hover:border-foreground/20 rounded-2xl flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={carImage}
          alt={car.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
            {car.category?.name || "Premium"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 grow flex flex-col justify-between space-y-6">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
              {car.name}
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-black">
              <Star className="h-3 w-3 fill-foreground" />
              <span>{car.rating || "4.8"}</span>
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
            {car.brand || "DRIVEKITA"} • {car.year || "2024"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 border-y border-border/50 py-4">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Seats</span>
            <span className="text-xs font-bold">{car.capacity}</span>
          </div>
          <div className="flex flex-col gap-1 border-x border-border/50 px-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Transmission</span>
            <span className="text-xs font-bold">{car.transmission === "Manual" ? "MT" : "AT"}</span>
          </div>
          <div className="flex flex-col gap-1 items-end text-right">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Fuel</span>
            <span className="text-xs font-bold">{car.fuel}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-border/50 mt-auto bg-muted/20">
        <div className="py-4">
          <span className="text-2xl font-black">
            Rp {formatNumber(car.pricePerDay)}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/80 block mt-1">
            per day
          </span>
        </div>
        <Link
          href={`/mobil/${car.slug}`}
          className={cn(
            buttonVariants({ size: "icon", variant: "ghost" }),
            "h-12 w-12 rounded-full border border-border hover:bg-foreground hover:text-background transition-all"
          )}
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
