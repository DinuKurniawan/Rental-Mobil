"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePassword } from "@/lib/actions";
import { Loader2, Lock, ShieldCheck, KeyRound, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setErrors({});
    
    const result = await updatePassword(formData);
    
    setLoading(false);
    
    if (result.error) {
      if (typeof result.error === "object") {
        setErrors(result.error);
      } else {
        toast.error(result.error);
      }
    } else if (result.success) {
      toast.success(result.success);
      formRef.current?.reset();
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="border-none bg-blue-50/50 text-blue-900 shadow-sm dark:bg-blue-900/20 dark:text-blue-100 ring-1 ring-blue-100 dark:ring-blue-800">
        <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="font-bold">Keamanan Akun</AlertTitle>
        <AlertDescription className="text-sm opacity-90">
          Gunakan minimal 8 karakter dengan kombinasi huruf, angka, dan simbol untuk keamanan maksimal.
        </AlertDescription>
      </Alert>

      <Card className="border-none bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Ubah Password</CardTitle>
          </div>
          <CardDescription>
            Pastikan Anda menggunakan password yang unik dan kuat.
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" d-flex items-center gap-2 className="text-sm font-semibold">
                Password Saat Ini
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="pl-10 bg-slate-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:bg-slate-950/50 dark:focus:bg-slate-950"
                  placeholder="••••••••"
                />
              </div>
              {errors.currentPassword && (
                <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.currentPassword[0]}</span>
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword" d-flex items-center gap-2 className="text-sm font-semibold">
                  Password Baru
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="pl-10 bg-slate-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:bg-slate-950/50 dark:focus:bg-slate-950"
                    placeholder="••••••••"
                  />
                </div>
                {errors.newPassword && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.newPassword[0]}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" d-flex items-center gap-2 className="text-sm font-semibold">
                  Konfirmasi Password Baru
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="pl-10 bg-slate-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:bg-slate-950/50 dark:focus:bg-slate-950"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.confirmPassword[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-slate-50 bg-slate-50/30 px-6 py-4 dark:border-slate-800/50 dark:bg-slate-900/20">
            <Button disabled={loading} type="submit" className="flex items-center gap-2 px-6 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Perbarui Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
