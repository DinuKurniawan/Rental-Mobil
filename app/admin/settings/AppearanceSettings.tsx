"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun, Check, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Card className="border-none bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Tema Aplikasi</CardTitle>
          </div>
          <CardDescription>
            Pilih bagaimana DriveKita terlihat untuk Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "group relative flex flex-col gap-4 rounded-2xl border-2 p-4 pt-6 text-left transition-all duration-200",
                theme === "light" 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/5" 
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  "rounded-xl p-2.5 transition-colors",
                  theme === "light" ? "bg-primary text-white" : "bg-white text-slate-400 shadow-sm dark:bg-slate-800"
                )}>
                  <Sun className="h-5 w-5" />
                </div>
                {theme === "light" && (
                  <div className="rounded-full bg-primary p-1 text-white shadow-sm shadow-primary/20">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold">Terang</p>
                <p className="text-xs text-muted-foreground">Mode cerah dan bersih.</p>
              </div>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "group relative flex flex-col gap-4 rounded-2xl border-2 p-4 pt-6 text-left transition-all duration-200",
                theme === "dark" 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/5" 
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  "rounded-xl p-2.5 transition-colors",
                  theme === "dark" ? "bg-primary text-white" : "bg-white text-slate-400 shadow-sm dark:bg-slate-800"
                )}>
                  <Moon className="h-5 w-5" />
                </div>
                {theme === "dark" && (
                  <div className="rounded-full bg-primary p-1 text-white shadow-sm shadow-primary/20">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold">Gelap</p>
                <p className="text-xs text-muted-foreground">Lebih nyaman di mata.</p>
              </div>
            </button>

            <button
              onClick={() => setTheme("system")}
              className={cn(
                "group relative flex flex-col gap-4 rounded-2xl border-2 p-4 pt-6 text-left transition-all duration-200",
                theme === "system" 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/5" 
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  "rounded-xl p-2.5 transition-colors",
                  theme === "system" ? "bg-primary text-white" : "bg-white text-slate-400 shadow-sm dark:bg-slate-800"
                )}>
                  <Monitor className="h-5 w-5" />
                </div>
                {theme === "system" && (
                  <div className="rounded-full bg-primary p-1 text-white shadow-sm shadow-primary/20">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold">Sistem</p>
                <p className="text-xs text-muted-foreground">Ikuti setelan perangkat.</p>
              </div>
            </button>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/30 px-6 py-4 dark:bg-slate-900/20">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Perubahan diterapkan secara instan
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
