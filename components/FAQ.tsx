import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apa saja syarat untuk menyewa mobil lepas kunci?",
    answer: "Untuk sewa lepas kunci, Anda perlu menyiapkan: E-KTP (Asli), SIM A (Asli), NPWP, dan akun media sosial yang aktif. Tim kami akan melakukan verifikasi dokumen sebelum pengambilan mobil."
  },
  {
    question: "Apakah ada biaya tambahan untuk pengantaran mobil?",
    answer: "Kami memberikan gratis biaya antar-jemput untuk radius 10km dari titik operasional kami di pusat kota. Di luar radius tersebut, akan dikenakan biaya tambahan mulai dari Rp 50.000 tergantung jarak."
  },
  {
    question: "Bagaimana jika terjadi kecelakaan atau kerusakan selama sewa?",
    answer: "Seluruh armada kami telah dilindungi asuransi All-Risk. Penyewa hanya dikenakan biaya klaim asuransi (own risk) mulai dari Rp 300.000 per kejadian, kecuali ada unsur kelalaian berat seperti mabuk atau tidak memiliki SIM."
  },
  {
    question: "Apakah bisa memperpanjang waktu sewa di tengah jalan?",
    answer: "Bisa, asalkan mobil yang bersangkutan belum di-booking oleh pelanggan lain di jadwal berikutnya. Mohon informasikan kepada admin minimal 6 jam sebelum waktu sewa berakhir."
  },
  {
    question: "Apa kebijakan pembatalan (refund)?",
    answer: "Pembatalan minimal 48 jam sebelum jadwal akan dikembalikan 100%. Pembatalan 24-48 jam dikenakan biaya 50%. Di bawah 24 jam tidak ada pengembalian dana."
  }
];

export default function FAQ() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-xl mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Common <span className="text-muted-foreground/30">Queries</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            Quick answers to frequently asked questions about our premium mobility services.
          </p>
        </div>

        <div className="max-w-4xl">
          <Accordion type="single" className="w-full space-y-0 divide-y divide-border border-y border-border">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-none py-2 px-0">
                <AccordionTrigger className="text-left font-black uppercase tracking-tighter text-xl py-6 hover:no-underline hover:opacity-50 transition-all">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-medium pb-8 leading-relaxed text-base max-w-2xl">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
