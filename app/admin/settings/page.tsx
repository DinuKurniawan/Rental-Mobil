import { getCurrentUser } from "@/lib/data";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";
import { AppearanceSettings } from "./AppearanceSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Palette, Settings, ShieldCheck, CreditCard, Bell } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | DriveKita Admin",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground font-medium">User tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl space-y-10 py-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      {/* Decorative background elements */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm shadow-primary/20">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">Settings</h1>
            <p className="text-lg text-muted-foreground/80">
              Kelola profil, keamanan, dan preferensi aplikasi DriveKita Anda.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col gap-8 md:flex-row">
        <div className="w-full md:w-72 shrink-0">
          <TabsList className="flex h-auto w-full flex-col items-start justify-start gap-1 bg-transparent p-0">
            <TabsTrigger 
              value="profile" 
              className="group flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 text-left data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-slate-200 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:ring-slate-800 transition-all duration-200"
            >
              <div className="rounded-lg bg-slate-100 p-1.5 group-data-[state=active]:bg-primary/10 dark:bg-slate-800 dark:group-data-[state=active]:bg-primary/20">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">Profil Akun</span>
                <span className="text-[10px] text-muted-foreground group-data-[state=active]:text-primary/70">Informasi pribadi Anda</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="security" 
              className="group flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 text-left data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-slate-200 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:ring-slate-800 transition-all duration-200"
            >
              <div className="rounded-lg bg-slate-100 p-1.5 group-data-[state=active]:bg-primary/10 dark:bg-slate-800 dark:group-data-[state=active]:bg-primary/20">
                <Lock className="h-4 w-4" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">Keamanan</span>
                <span className="text-[10px] text-muted-foreground group-data-[state=active]:text-primary/70">Password & autentikasi</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="appearance" 
              className="group flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 text-left data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-slate-200 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:ring-slate-800 transition-all duration-200"
            >
              <div className="rounded-lg bg-slate-100 p-1.5 group-data-[state=active]:bg-primary/10 dark:bg-slate-800 dark:group-data-[state=active]:bg-primary/20">
                <Palette className="h-4 w-4" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">Tampilan</span>
                <span className="text-[10px] text-muted-foreground group-data-[state=active]:text-primary/70">Tema & mode aplikasi</span>
              </div>
            </TabsTrigger>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 w-full px-2">
              <h3 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2 px-2">Segera Hadir</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-4 py-2.5 opacity-50 cursor-not-allowed">
                  <Bell className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">Notifikasi</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 opacity-50 cursor-not-allowed">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">Billing</span>
                </div>
              </div>
            </div>
          </TabsList>
        </div>
        
        <div className="flex-1 min-w-0">
          <TabsContent value="profile" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <ProfileForm user={user} />
          </TabsContent>
          
          <TabsContent value="security" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <PasswordForm />
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <AppearanceSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
