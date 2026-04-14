"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createVoucher, updateVoucher } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const voucherSchema = z.object({
  code: z.string().min(3, "Kode minimal 3 karakter").toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().min(1, "Nilai minimal 1"),
  usageLimit: z.coerce.number().min(0, "Minimal 0 (unlimited)"),
  expiryDate: z.string().optional().nullable(),
  description: z.string().optional(),
});

type VoucherFormValues = z.infer<typeof voucherSchema>;

interface VoucherDialogProps {
  voucher?: any;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function VoucherDialog({ voucher, trigger, onSuccess }: VoucherDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isEditing = !!voucher;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: voucher?.code || "",
      type: voucher?.type || "FIXED",
      value: voucher?.value || 0,
      usageLimit: voucher?.usageLimit || 0,
      expiryDate: voucher?.expiryDate ? new Date(voucher.expiryDate).toISOString().split('T')[0] : "",
      description: voucher?.description || "",
    },
  });

  const type = watch("type");

  const onSubmit = async (data: VoucherFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      if (isEditing) {
        await updateVoucher(voucher.id, formData);
        toast.success("Voucher berhasil diperbarui");
      } else {
        await createVoucher(formData);
        toast.success("Voucher berhasil dibuat");
      }
      
      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger render={trigger || <Button>Tambah Voucher</Button>} />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs animate-in fade-in duration-300" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background border border-border p-8 rounded-[32px] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-black uppercase tracking-tighter">
              {isEditing ? "Edit" : "Tambah"} <span className="text-muted-foreground/30">Voucher</span>
            </Dialog.Title>
            <Dialog.Close render={<button className="p-2 hover:bg-muted rounded-full transition-colors"><X className="h-5 w-5" /></button>} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Kode Voucher</Label>
              <Input 
                {...register("code")} 
                placeholder="CONTOH: DRIVEKITA" 
                className="h-12 rounded-xl bg-muted/30 border-border font-black uppercase tracking-widest"
              />
              {errors.code && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{errors.code.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Tipe</Label>
                <Select 
                  value={type} 
                  onValueChange={(val: any) => setValue("type", val)}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIXED">Potongan Tetap (Rp)</SelectItem>
                    <SelectItem value="PERCENTAGE">Persentase (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Nilai Diskon</Label>
                <Input 
                  {...register("value")} 
                  type="number"
                  placeholder={type === "FIXED" ? "100000" : "10"} 
                  className="h-12 rounded-xl bg-muted/30 border-border font-bold"
                />
                {errors.value && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{errors.value.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Limit Pemakaian</Label>
                <Input 
                  {...register("usageLimit")} 
                  type="number"
                  placeholder="0 = Unlimited" 
                  className="h-12 rounded-xl bg-muted/30 border-border font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Tanggal Kadaluarsa</Label>
                <Input 
                  {...register("expiryDate")} 
                  type="date"
                  className="h-12 rounded-xl bg-muted/30 border-border font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Deskripsi</Label>
              <textarea 
                {...register("description")}
                className="w-full min-h-[80px] p-4 rounded-xl bg-muted/30 border border-border font-medium text-sm focus:outline-none focus:ring-2 focus:ring-foreground/5 transition-all resize-none"
                placeholder="Opsional: Penjelasan voucher..."
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Dialog.Close render={<Button variant="outline" className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[11px]">Batal</Button>} />
              <Button 
                type="submit" 
                className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[11px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : isEditing ? "Update Voucher" : "Simpan Voucher"}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}