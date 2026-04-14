"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteUser } from "./actions";
import { toast } from "sonner";

export function DeleteUserDialog({ 
  userId, 
  userName 
}: { 
  userId: string; 
  userName: string 
}) {
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    setLoading(true);
    const result = await deleteUser(userId);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Akun berhasil dihapus");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Akun?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus akun <strong>{userName}</strong>? 
            Tindakan ini permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
