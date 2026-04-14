"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createPaymentMethod, updatePaymentMethod } from "./actions";
import { toast } from "sonner";

export function MethodDialog({ method }: { method?: any }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!method;

  const [type, setType] = useState(method?.type || "BANK_TRANSFER");
  const [isActive, setIsActive] = useState<boolean>(method ? method.isActive : true);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.set("type", type);
    formData.set("isActive", isActive.toString());

    let result;
    if (isEditing) {
      result = await updatePaymentMethod(method.id, formData);
    } else {
      result = await createPaymentMethod(formData);
    }

    if (result?.error) {
      toast.error(result.error as string);
    } else {
      toast.success(isEditing ? "Metode berhasil diperbarui" : "Metode berhasil ditambahkan");
      setOpen(false);
    }
    
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Metode
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Metode" : "Tambah Metode"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Ubah detail metode pembayaran." : "Tambahkan rekening atau QRIS baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Bank/Metode</Label>
            <Input id="name" name="name" defaultValue={method?.name} placeholder="BCA / Mandiri / QRIS" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipe</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK_TRANSFER">Transfer Bank</SelectItem>
                <SelectItem value="QRIS">QRIS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "BANK_TRANSFER" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Nomor Rekening</Label>
                <Input id="accountNumber" name="accountNumber" defaultValue={method?.accountNumber || ""} placeholder="1234567890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Atas Nama</Label>
                <Input id="accountName" name="accountName" defaultValue={method?.accountName || ""} placeholder="PT DriveKita" />
              </div>
            </>
          )}

          {type === "QRIS" && (
            <div className="space-y-2">
              <Label htmlFor="image">Gambar QRIS</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
              {method?.image && (
                <p className="text-xs text-muted-foreground">
                  Kosongkan jika tidak ingin mengubah gambar saat ini.
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi / Instruksi</Label>
            <Textarea id="description" name="description" defaultValue={method?.description || ""} placeholder="Instruksi tambahan jika ada" />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="isActive" checked={isActive} onCheckedChange={(checked) => setIsActive(checked as boolean)} />
            <Label htmlFor="isActive">Metode Aktif</Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
