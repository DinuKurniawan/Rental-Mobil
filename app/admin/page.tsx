import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Car, Layers, CreditCard, TrendingUp, ArrowUpRight, Clock, ShieldCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevenueChart, RentalStatsChart } from "@/components/DashboardCharts";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminDashboard() {
  // Fetch Basic Stats
  const [userCount, carCount, categoryCount, paymentCount, recentBookings, categoriesWithCounts, allPayments] = await Promise.all([
    prisma.user.count(),
    prisma.car.count(),
    prisma.category.count(),
    prisma.payment.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true, car: true }
    }),
    prisma.category.findMany({
      include: { _count: { select: { cars: true } } }
    }),
    prisma.payment.findMany({
      where: { status: "success" },
      orderBy: { createdAt: 'asc' }
    })
  ]);

  // Process Revenue Data for Chart (Last 6 Months)
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return format(date, "MMM");
  });

  const revenueByMonth = last6Months.map(month => {
    const amount = allPayments
      .filter(p => format(new Date(p.createdAt), "MMM") === month)
      .reduce((sum, p) => sum + p.amount, 0);
    return { month, amount };
  });

  const totalRevenueValue = allPayments.reduce((sum, p) => sum + p.amount, 0);
  
  // Simple calculation for percentage change (last month vs month before)
  const currentMonth = format(new Date(), "MMM");
  const prevMonth = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), "MMM");
  const currentMonthRevenue = revenueByMonth.find(r => r.month === currentMonth)?.amount || 0;
  const prevMonthRevenue = revenueByMonth.find(r => r.month === prevMonth)?.amount || 0;
  const revenueChange = prevMonthRevenue === 0 ? 100 : ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;

  // Process Category Distribution
  const totalCars = categoriesWithCounts.reduce((sum, c) => sum + c._count.cars, 0);
  const categoryChartData = categoriesWithCounts.map(c => ({
    name: c.name,
    count: c._count.cars,
    percentage: totalCars === 0 ? 0 : (c._count.cars / totalCars) * 100
  })).sort((a, b) => b.count - a.count);

  const stats = [
    { 
      name: "Total Akun", 
      value: userCount, 
      icon: Users, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      change: "+12.5%", // Simplified for now, but could be calculated similarly
      trend: "up"
    },
    { 
      name: "Total Mobil", 
      value: carCount, 
      icon: Car, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10",
      change: "Stable",
      trend: "up"
    },
    { 
      name: "Total Kategori", 
      value: categoryCount, 
      icon: Layers, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      change: "New",
      trend: "up"
    },
    { 
      name: "Total Order", 
      value: paymentCount, 
      icon: CreditCard, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10",
      change: `${revenueChange.toFixed(1)}%`,
      trend: revenueChange >= 0 ? "up" : "down"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Dashboard <span className="text-primary italic">Overview</span></h1>
          <p className="text-muted-foreground font-medium text-lg">Pantau performa bisnis DriveKita Anda secara real-time.</p>
        </div>
        <Link href="/api/admin/report">
          <Button className="h-12 px-6 rounded-2xl font-bold bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none text-white">
             Download Report <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[32px] overflow-hidden group hover:scale-[1.02] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">{stat.name}</CardTitle>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:rotate-12`}>
                 <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight">{stat.value}</div>
              <p className={cn(
                "text-xs font-bold mt-2 flex items-center gap-1",
                stat.trend === "up" ? "text-emerald-500" : "text-rose-500"
              )}>
                 <TrendingUp className={cn("h-3 w-3", stat.trend === "down" && "rotate-180")} /> 
                 {stat.change} dibanding bulan lalu
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden p-8">
           <RevenueChart 
             data={revenueByMonth} 
             totalRevenue={totalRevenueValue} 
             percentageChange={revenueChange} 
           />
        </Card>
        
        <Card className="col-span-3 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden p-8">
           <RentalStatsChart data={categoryChartData} />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-7 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-center">
               <div>
                  <CardTitle className="text-2xl font-black">Aktivitas Rental Terbaru</CardTitle>
                  <CardDescription className="text-slate-400 font-medium pt-1">Pantau status penyewaan mobil yang sedang berjalan.</CardDescription>
               </div>
               <Button variant="ghost" className="rounded-xl font-bold">Lihat Semua</Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentBookings.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground italic bg-muted/20 rounded-3xl">
                    Belum ada aktivitas rental terbaru.
                  </div>
                ) : (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-primary/20 transition-all">
                       <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center shrink-0">
                          <Car className="h-6 w-6 text-primary" />
                       </div>
                       <div className="grow">
                          <p className="font-bold text-lg truncate max-w-[150px]">{booking.car.name}</p>
                          <p className="text-xs text-slate-500 font-medium truncate max-w-[150px]">Customer: {booking.user.name}</p>
                       </div>
                       <div className="text-right">
                          <div className={`flex items-center gap-2 justify-end font-bold text-xs ${
                            booking.status === 'CONFIRMED' ? 'text-emerald-500' : 
                            booking.status === 'PENDING' ? 'text-amber-500' : 'text-slate-400'
                          }`}>
                             <ShieldCheck className="h-4 w-4" />
                             {booking.status}
                          </div>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
