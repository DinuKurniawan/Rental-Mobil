import Hero from "@/components/Hero";
import FeaturedCars from "@/components/FeaturedCars";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import ReviewForm from "@/components/ReviewForm";
import FAQ from "@/components/FAQ";
import MapSection from "@/components/MapSection";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { getReviews } from "@/lib/data";

export default async function Home() {
  const reviews = await getReviews(6);

  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedCars />
      <HowItWorks />
      <Testimonials reviews={reviews as any} />
      <ReviewForm />
      <FAQ />
      <MapSection />

      {/* CTA Banner */}
      <section className="py-40 bg-background overflow-hidden relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="border border-border rounded-[40px] p-12 md:p-24 text-center space-y-12 relative bg-muted/20">
            <div className="space-y-6 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                Start Your <br />
                <span className="text-muted-foreground/20">Journey</span>
              </h2>
              <p className="text-muted-foreground font-medium md:text-xl tracking-tight max-w-2xl mx-auto leading-relaxed">
                Join thousands of satisfied travelers. Curated fleet, absolute freedom, zero compromises.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="/mobil"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-16 px-12 rounded-full font-black uppercase tracking-widest text-[13px]"
                )}
              >
                Join Now
              </Link>
              <Link 
                href="/tentang"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-16 px-12 rounded-full font-black uppercase tracking-widest text-[13px] border-border bg-transparent hover:bg-foreground hover:text-background"
                )}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full -z-10" />
      </section>
    </div>
  );
}
