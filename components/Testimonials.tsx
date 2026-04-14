"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface Review {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  avatar: string | null;
}

export default function Testimonials({ reviews = [] }: { reviews?: Review[] }) {
  return (
    <section className="py-32 bg-background overflow-hidden border-t border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-xl mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Global <span className="text-muted-foreground/30">Feedback</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            Real stories from our community of premium travelers.
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-8">
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="pl-8 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full flex flex-col justify-between space-y-10 p-10 border border-border rounded-2xl bg-muted/10 hover:bg-muted/30 transition-colors duration-500">
                    <div className="space-y-6">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? 'fill-foreground text-foreground' : 'text-muted-foreground/20'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-lg font-medium leading-relaxed tracking-tight">
                        &quot;{review.content}&quot;
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden grayscale opacity-80">
                        <Image 
                          src={review.avatar || `https://i.pravatar.cc/150?u=${review.id}`} 
                          alt={review.name} 
                          fill 
                          sizes="40px"
                          className="object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-black uppercase tracking-tighter text-sm leading-none">{review.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mt-1">{review.role || 'Member'}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-12">
              <CarouselPrevious className="relative inset-0 translate-y-0 h-12 w-12 rounded-full border-border bg-transparent hover:bg-foreground hover:text-background" />
              <CarouselNext className="relative inset-0 translate-y-0 h-12 w-12 rounded-full border-border bg-transparent hover:bg-foreground hover:text-background" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
