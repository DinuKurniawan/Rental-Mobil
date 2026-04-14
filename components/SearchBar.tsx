"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, CarFront, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function SearchBar({ categories = [] }: { categories?: Category[] }) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    if (category && category !== "all") params.set("category", category);
    router.push(`/mobil?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {/* Location Field */}
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
              <MapPin className="h-4 w-4" />
            </div>
            <Input 
              placeholder="Pick-up Location" 
              className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:ring-primary/20 transition-all font-bold text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Date Field */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                <Calendar className="h-4 w-4" />
              </div>
              <Input 
                type="date"
                className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:ring-primary/20 transition-all font-bold text-xs"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Category Field */}
            <div className="group relative">
              <Select value={category} onValueChange={(val) => setCategory(val || "all")}>
                <SelectTrigger className="h-14 pl-4 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:ring-primary/20 transition-all font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <CarFront className="h-4 w-4 text-muted-foreground/40" />
                    <SelectValue placeholder="Fleet Type" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border">
                  <SelectItem value="all">All Types</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Find My Car
        </Button>
      </form>
    </div>
  );
}
