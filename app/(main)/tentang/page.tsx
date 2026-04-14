import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Shield, Users, Clock, MapPin } from "lucide-react";

export const metadata = {
  title: "Tentang Kami | DriveKita",
  description: "Pelajari lebih lanjut tentang DriveKita, penyedia layanan sewa mobil terpercaya di Indonesia.",
};

const stats = [
  { label: "Pelanggan Puas", value: "10k+" },
  { label: "Armada Mobil", value: "500+" },
  { label: "Kota Layanan", value: "15+" },
  { label: "Tahun Beroperasi", value: "8+" },
];

const values = [
  {
    icon: Shield,
    title: "Keamanan Terjamin",
    description: "Semua armada kami melalui pengecekan rutin dan dilengkapi asuransi komprehensif.",
  },
  {
    icon: Users,
    title: "Pelayanan Prima",
    description: "Tim support kami siap membantu Anda 24/7 untuk memastikan perjalanan yang lancar.",
  },
  {
    icon: Clock,
    title: "Tepat Waktu",
    description: "Kami menghargai waktu Anda. Proses serah terima cepat dan armada selalu siap sesuai jadwal.",
  },
  {
    icon: MapPin,
    title: "Jangkauan Luas",
    description: "Tersedia di berbagai kota besar di Indonesia dengan ribuan titik penjemputan.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2000"
            alt="Driving"
            fill
            className="object-cover brightness-[0.4]"
            priority
            sizes="100vw"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Menghubungkan Anda dengan<br/>Perjalanan Impian</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80">
            DriveKita hadir untuk memberikan kebebasan bergerak dengan layanan sewa mobil yang transparan, aman, dan berkualitas.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>Sejak 2016</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Kisah Kami</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  DriveKita dimulai dari sebuah ide sederhana: mempermudah setiap orang untuk merental mobil tanpa ribet. Kami melihat tantangan dalam proses pemesanan yang konvensional dan memutuskan untuk membawa perubahan melalui teknologi.
                </p>
                <p>
                  Selama lebih dari 8 tahun, kami telah bertransformasi dari sebuah startup lokal kecil menjadi salah satu platform sewa mobil terkemuka di Indonesia. Fokus kami tetap sama: mengutamakan kepuasan pelanggan dan kualitas armada.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-6">
                {stats.map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square">
               <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                 <Image
                   src="/about_team_office_1776090220315.png"
                   alt="DriveKita Team"
                   fill
                   className="object-cover"
                   sizes="(max-width: 768px) 100vw, 50vw"
                 />
               </div>
               {/* Decorative floating card */}
               <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-[200px] border border-slate-100 dark:border-slate-700 hidden md:block">
                 <p className="text-sm font-semibold italic">&quot;Memberikan pelayanan terbaik adalah DNA kami.&quot;</p>
                 <p className="text-xs text-muted-foreground mt-2">— Founder DriveKita</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Nilai-Nilai Kami</h2>
            <p className="text-muted-foreground">Apa yang membedakan kami dari yang lain bukan hanya mobil kami, tapi komitmen kami kepada Anda.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-background p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[2rem] p-12 md:p-20 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 skew-x-12 translate-x-1/2" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Mari Menjelajah Bersama DriveKita</h2>
              <p className="text-primary-foreground/90 text-lg md:text-xl">
                Jadikan setiap perjalanan Anda lebih berkesan dengan armada terbaik dan layanan yang bisa Anda andalkan.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/mobil">
                  <Button size="lg" variant="secondary" className="px-8 font-bold text-primary hover:scale-105 transition-all">
                    Lihat Koleksi Mobil
                  </Button>
                </Link>
                <Link href="/masuk">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary transition-all">
                    Gabung Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
