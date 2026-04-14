"use client";

import Image from "next/image";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

export default function ImageCarousel({ images, name }: { images: string[], name: string }) {
  // Use actual images from database, or fallback to placeholder if empty
  const displayImages = images.length > 0 ? images : ["/images/hero_premium.png"];

  return (
    <div className="relative group">
      <Carousel className="w-full">
        <CarouselContent>
          {displayImages.map((src, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden border-none shadow-none bg-muted rounded-[32px] aspect-video relative">
                <Image 
                  src={src} 
                  alt={`${name} image ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority={index === 0}
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {displayImages.length > 1 && (
          <>
            <CarouselPrevious className="left-6 h-12 w-12 rounded-full border-border bg-background/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-foreground hover:text-background" />
            <CarouselNext className="right-6 h-12 w-12 rounded-full border-border bg-background/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-foreground hover:text-background" />
          </>
        )}
      </Carousel>
      
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-6">
          {displayImages.map((src, index) => (
            <div key={index} className="aspect-video relative rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer bg-muted group/thumb">
              <Image 
                src={src} 
                alt={`${name} thumb ${index + 1}`} 
                fill 
                sizes="200px" 
                className="object-cover transition-transform group-hover/thumb:scale-110" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
