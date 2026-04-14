"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { deleteVoucher } from "./actions";
import { toast } from "sonner";
import { X, AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
  id: string;
  name: string;
  trigger?: React.ReactNode;
}

export default function DeleteDialog({ id, name, trigger }: DeleteDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteVoucher(id);
      toast.success("Voucher berhasil dihapus");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus voucher");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger render={trigger || <Button variant="destructive">Hapus</Button>} />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs animate-in fade-in duration-300" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background border border-border p-8 rounded-[32px] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <Dialog.Close render={<button className="p-2 hover:bg-muted rounded-full transition-colors"><X className="h-5 w-5" /></button>} />
          </div>

          <Dialog.Title className="text-2xl font-black uppercase tracking-tighter mb-2">
            Delete <span className="text-red-500">Voucher</span>
          </Dialog.Title>
          <Dialog.Description className="text-muted-foreground font-medium mb-8">
            Apakah Anda yakin ingin menghapus voucher <span className="font-black text-foreground">{name}</span>? Tindakan ini tidak dapat dibatalkan.
          </Dialog.Description>

          <div className="flex gap-3">
            <Dialog.Close render={<Button variant="outline" className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[11px]">Batal</Button>} />
            <Button 
              variant="destructive"
              className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[11px] bg-red-500 hover:bg-red-600 text-white border-none"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}