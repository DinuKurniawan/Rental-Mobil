"use client";

import { useFilterStore } from "@/lib/store";
import CarCard from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  SlidersHorizontal, 
  X,
  Filter,
  Check
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { CarWithCategory } from "@/lib/types";
import { Category } from "@prisma/client";
import { formatNumber, cn } from "@/lib/utils";

interface CarListingClientProps {
  initialCars: CarWithCategory[];
  categories: Category[];
  availableBrands: string[];
  initialCategorySlug?: string;
}

const capacities = ["1-4", "5-6", "7+"];
const transmissions = ["Otomatis", "Manual"];
const fuelTypes = ["Bensin", "Solar", "Listrik", "Hybrid"];

export default function CarListingClient({ 
  initialCars, 
  categories, 
  availableBrands,
  initialCategorySlug
}: CarListingClientProps) {
  const { filters, setFilter, resetFilters } = useFilterStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialCategorySlug) {
      const category = categories.find(c => c.slug === initialCategorySlug);
      if (category) {
        setFilter("type", [category.id]);
      }
    }
  }, [initialCategorySlug, categories, setFilter]);

  const filteredCars = useMemo(() => {
    return initialCars.filter((car) => {
      // Search Box
      const matchSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (car.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      // Brand Filter
      const matchBrand = filters.brand.length === 0 || (car.brand && filters.brand.includes(car.brand));
      
      // Category (Type) Filter
      const matchType = filters.type.length === 0 || filters.type.includes(car.categoryId) || filters.type.includes(car.category.name);
      
      // Transmission Filter
      const matchTransmission = filters.transmission.length === 0 || filters.transmission.includes(car.transmission);
      
      // Fuel Filter
      const matchFuel = filters.fuel.length === 0 || filters.fuel.includes(car.fuel);
      
      // Price Range Filter
      const matchPrice = car.pricePerDay >= filters.priceRange[0] && car.pricePerDay <= filters.priceRange[1];

      // Capacity logic
      let matchCapacity = true;
      if (filters.capacity.length > 0) {
        matchCapacity = filters.capacity.some(range => {
          if (range === "1-4") return car.capacity >= 1 && car.capacity <= 4;
          if (range === "5-6") return car.capacity >= 5 && car.capacity <= 6;
          if (range === "7+") return car.capacity >= 7;
          return true;
        });
      }

      return matchSearch && matchBrand && matchType && matchTransmission && matchFuel && matchPrice && matchCapacity;
    });
  }, [filters, searchQuery, initialCars]);

  const toggleFilter = (key: keyof typeof filters, value: any) => {
    if (Array.isArray(filters[key])) {
      const current = [...(filters[key] as any[])];
      const index = current.indexOf(value);
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(value);
      }
      setFilter(key, current);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Header and Mobile Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Daftar <span className="text-primary">Mobil</span></h1>
            <p className="text-muted-foreground mt-1">Ditemukan {filteredCars.length} mobil yang tersedia</p>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative grow md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari model atau merek..." 
                className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {(filters.brand.length > 0 || filters.type.length > 0 || filters.transmission.length > 0) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-11 px-4 text-xs font-bold uppercase tracking-widest text-red-500 hidden sm:flex"
                onClick={resetFilters}
              >
                Clear
              </Button>
            )}

            <Button 
                variant="outline" 
                size="icon" 
                className="h-11 w-11 lg:hidden"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
                <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={cn(
            "w-full lg:w-72 shrink-0 space-y-6",
            isMobileFilterOpen ? "block" : "hidden lg:block"
          )}>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </h3>
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={resetFilters}>
                  Reset
                </Button>
              </div>

              <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
                {/* Brand Filter */}
                {availableBrands.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Merek</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {availableBrands.map((brand) => (
                        <div key={brand} className="flex items-center gap-3">
                          <Checkbox 
                            id={`brand-${brand}`} 
                            checked={filters.brand.includes(brand)}
                            onCheckedChange={() => toggleFilter("brand", brand)}
                          />
                          <label htmlFor={`brand-${brand}`} className="text-sm font-medium cursor-pointer">{brand}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Filter */}
                {categories.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Kategori</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-3">
                          <Checkbox 
                            id={`cat-${cat.id}`}
                            checked={filters.type.includes(cat.id)}
                            onCheckedChange={() => toggleFilter("type", cat.id)}
                          />
                          <label htmlFor={`cat-${cat.id}`} className="text-sm font-medium cursor-pointer">{cat.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transmission Filter */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Transmisi</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {transmissions.map((t) => (
                      <div key={t} className="flex items-center gap-3">
                        <Checkbox 
                          id={`trans-${t}`}
                          checked={filters.transmission.includes(t)}
                          onCheckedChange={() => toggleFilter("transmission", t)}
                        />
                        <label htmlFor={`trans-${t}`} className="text-sm font-medium cursor-pointer">{t}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fuel Filter */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Bahan Bakar</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {fuelTypes.map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <Checkbox 
                          id={`fuel-${f}`}
                          checked={filters.fuel.includes(f)}
                          onCheckedChange={() => toggleFilter("fuel", f)}
                        />
                        <label htmlFor={`fuel-${f}`} className="text-sm font-medium cursor-pointer">{f}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capacity Filter */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Kapasitas</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {capacities.map((cap) => (
                      <div key={cap} className="flex items-center gap-3">
                        <Checkbox 
                          id={`cap-${cap}`}
                          checked={filters.capacity.includes(cap)}
                          onCheckedChange={() => toggleFilter("capacity", cap)}
                        />
                        <label htmlFor={`cap-${cap}`} className="text-sm font-medium cursor-pointer">{cap} Penumpang</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Harga Maks</h4>
                  <div className="space-y-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="5000000" 
                      step="100000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilter("priceRange", [0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Rp 0</span>
                      <span className="text-primary font-bold">Rp {formatNumber(filters.priceRange[1])}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Car Grid */}
          <div className="grow">
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                  <X className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mobil Tidak Ditemukan</h3>
                <p className="text-muted-foreground">Coba ubah filter atau kata kunci pencarian Anda.</p>
                <Button variant="link" className="mt-2 text-primary" onClick={resetFilters}>Hapus Semua Filter</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
