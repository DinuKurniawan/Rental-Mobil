"use client";

import React from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface RevenueData {
  month: string;
  amount: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  totalRevenue: number;
  percentageChange: number;
}

export function RevenueChart({ data, totalRevenue, percentageChange }: RevenueChartProps) {
  const chartHeight = 200;
  const chartWidth = 600;
  
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.amount), 1) : 1;
  
  // Menghasilkan titik-titik untuk polyline SVG
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = chartHeight - (val.amount / maxValue) * (chartHeight - 40);
    return `${x},${y}`;
  }).join(" ");

  // Menghasilkan area bawah kurva untuk gradient fill
  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val.toString();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight">Revenue Analytics</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Real-time performance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-primary">Rp {totalRevenue.toLocaleString('id-ID')}</p>
          <div className={`flex items-center gap-1 text-[10px] font-black uppercase justify-end ${percentageChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {percentageChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} 
            {Math.abs(percentageChange).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="relative h-[200px] w-full group">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-full overflow-visible drop-shadow-[0_10px_15px_rgba(99,102,241,0.2)]"
          preserveAspectRatio="none"
        >
          {/* Grid Lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line 
              key={i}
              x1="0" 
              y1={(i / 4) * chartHeight} 
              x2={chartWidth} 
              y2={(i / 4) * chartHeight} 
              className="stroke-muted/30 stroke-[0.5]" 
            />
          ))}

          {/* Area Fill */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#chartGradient)" className="animate-in fade-in duration-1000" />

          {/* Line Path */}
          <polyline
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="animate-in slide-in-from-left-full duration-1000"
          />

          {/* Interactive Points */}
          {data.map((val, i) => {
            const x = (i / (data.length - 1)) * chartWidth;
            const y = chartHeight - (val.amount / maxValue) * (chartHeight - 40);
            return (
              <g key={i} className="group/point cursor-pointer">
                <circle 
                  cx={x} 
                  cy={y} 
                  r="6" 
                  fill="var(--color-primary)" 
                  className="opacity-0 group-hover/point:opacity-100 transition-opacity"
                />
                <circle 
                  cx={x} 
                  cy={y} 
                  r="12" 
                  fill="var(--color-primary)" 
                  className="opacity-0 group-hover/point:opacity-20 transition-opacity"
                />
              </g>
            );
          })}
        </svg>

        {/* Labels */}
        <div className="flex justify-between mt-4">
          {data.map((d) => (
            <span key={d.month} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
              {d.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface CategoryData {
  name: string;
  count: number;
  percentage: number;
}

interface RentalStatsChartProps {
  data: CategoryData[];
}

export function RentalStatsChart({ data }: RentalStatsChartProps) {
  const colors = ["bg-primary", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-pink-500"];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Fleet Distribution</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">Live Categories</span>
      </div>

      <div className="flex gap-2 h-12 w-full rounded-2xl overflow-hidden border border-border/50 p-1 bg-muted/20">
        {data.map((cat, i) => (
          <div 
            key={cat.name} 
            className={`${colors[i % colors.length]} h-full rounded-xl transition-all hover:scale-[1.02] cursor-help relative group`}
            style={{ width: `${cat.percentage}%` }}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background border border-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              <p className="text-[10px] font-black uppercase tracking-widest">{cat.name}: {cat.count} Cars ({cat.percentage.toFixed(1)}%)</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data.map((cat, i) => (
          <div key={cat.name} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/50">
            <div className={`h-3 w-3 rounded-full ${colors[i % colors.length]}`} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 truncate max-w-[80px]">{cat.name}</p>
              <p className="text-sm font-black">{cat.percentage.toFixed(0)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
