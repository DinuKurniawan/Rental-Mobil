"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "@/lib/actions";
import { Loader2, User, Mail, Camera, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileFormProps {
  user: {
    name: string | null;
    email: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setErrors({});
    
    const result = await updateProfile(formData);
    
    setLoading(false);
    
    if (result.error) {
      if (typeof result.error === "object") {
        setErrors(result.error);
      } else {
        toast.error(result.error);
      }
    } else if (result.success) {
      toast.success(result.success);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800">
        <div className="h-32 bg-linear-to-r from-primary/20 via-primary/5 to-transparent dark:from-primary/10" />
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6 flex items-end justify-between">
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg dark:bg-slate-950 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <User className="h-10 w-10 text-slate-400" />
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2 text-white shadow-lg hover:bg-primary/90 transition-transform active:scale-95">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none px-3 py-1">
                Akun Terverifikasi
              </Badge>
              <p className="text-xs text-muted-foreground">Terdaftar sejak April 2024</p>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{user.name || "User"}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </Card>

      <Card className="border-none bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-50 dark:border-slate-800/50">
          <CardTitle className="text-xl">Detail Profil</CardTitle>
          <CardDescription>
            Informasi ini akan ditampilkan di seluruh platform.
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    defaultValue={user.name || ""}
                    placeholder="Nama lengkap Anda"
                    className="pl-10 bg-slate-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:bg-slate-950/50 dark:focus:bg-slate-950"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs font-medium text-red-500">{errors.name[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Alamat Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    placeholder="email@example.com"
                    className="pl-10 bg-slate-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:bg-slate-950/50 dark:focus:bg-slate-950"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-red-500">{errors.email[0]}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-slate-50 bg-slate-50/30 px-6 py-4 dark:border-slate-800/50 dark:bg-slate-900/20">
            <Button disabled={loading} type="submit" className="flex items-center gap-2 px-6 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Perubahan
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
