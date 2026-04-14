"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { submitReview } from "@/lib/actions";
import { toast } from "sonner";

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsLoading(true);
    const result = await submitReview({
      name,
      rating,
      content: comment,
    });
    
    setIsLoading(false);
    if (result.success) {
      setSubmitted(true);
      toast.success("Ulasan berhasil dikirim!");
    } else {
      toast.error(result.error || "Gagal mengirim ulasan");
    }
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-lg mx-auto border-none shadow-xl bg-primary/5 text-center py-12">
        <CardContent className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
            <Star className="w-8 h-8 fill-current" />
          </div>
          <CardTitle className="text-2xl font-bold">Terima Kasih!</CardTitle>
          <CardDescription className="text-base text-slate-600">
            Ulasan Anda telah kami terima. Feedback Anda sangat berharga bagi kami untuk meningkatkan kualitas layanan.
          </CardDescription>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => {
              setSubmitted(false);
              setRating(0);
            }}
          >
            Kirim Ulasan Lain
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden" id="form-review">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-96 w-96 rounded-full bg-slate-900/5 blur-3xl -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Bagikan <span className="text-primary">Pengalaman Anda</span></h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Setiap ulasan sangat berarti bagi kami. Bantu kami memberikan layanan terbaik dan dapatkan promo eksklusif untuk penyewaan berikutnya.
          </p>
        </div>

        <Card className="max-w-xl mx-auto border-white/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
          <CardHeader className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800 py-8 text-center ring-1 ring-inset ring-white/10">
            <CardTitle className="text-2xl font-bold">Formulir Ulasan</CardTitle>
            <CardDescription className="text-base text-slate-500">Berikan feedback jujur Anda di bawah ini</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 pt-10 px-8 pb-10">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-semibold uppercase tracking-wider text-slate-500">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  placeholder="Contoh: Budi Santoso" 
                  required 
                  className="h-12 text-base px-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus:ring-primary/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold uppercase tracking-wider text-slate-500">Rating Pengalaman</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        suppressHydrationWarning
                        className="transition-all active:scale-90 hover:scale-125 duration-300"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star
                          className={cn(
                            "w-10 h-10 transition-all duration-300",
                            (hoverRating || rating) >= star
                              ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                              : "text-slate-200 dark:text-slate-800"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <p className={cn(
                    "text-sm font-bold transition-all duration-300 h-5",
                    rating > 0 ? "text-primary opacity-100" : "text-transparent opacity-0"
                  )}>
                    {rating === 5 && "Sangat Puas! ⭐⭐⭐⭐⭐"}
                    {rating === 4 && "Puas ⭐⭐⭐⭐"}
                    {rating === 3 && "Cukup ⭐⭐⭐"}
                    {rating === 2 && "Kurang ⭐⭐"}
                    {rating === 1 && "Sangat Kurang ⭐"}
                  </p>
                </div>
                <input type="hidden" name="rating" value={rating} required min={1} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="comment" className="text-sm font-semibold uppercase tracking-wider text-slate-500">Komentar / Pengalaman</Label>
                <Textarea 
                  id="comment" 
                  placeholder="Ceritakan apa yang paling Anda sukai atau hal yang perlu kami perbaiki..." 
                  className="min-h-[140px] text-base px-4 py-3 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus:ring-primary/20 resize-none"
                  required 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 py-6 px-8 flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full font-bold h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={isLoading || rating === 0}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : "Kirim Ulasan Sekarang"}
              </Button>
              <p className="text-xs text-center text-slate-400">
                Dengan menekan tombol, Anda setuju dengan Syarat & Ketentuan kami.
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
}
