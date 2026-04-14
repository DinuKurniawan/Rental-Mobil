"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Loader2, X } from "lucide-react";
import { createCar, updateCar, deleteCarImage } from "./actions";
import { toast } from "sonner";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  brand: z.string().optional(),
  description: z.string().optional(),
  images: z.any().optional(),
  pricePerDay: z.string().min(1, "Harga wajib diisi"),
  year: z.string().optional(),
  transmission: z.string().min(1, "Transmisi wajib diisi"),
  capacity: z.string().min(1, "Kapasitas wajib diisi"),
  fuel: z.string().min(1, "BBM wajib diisi"),
  categoryId: z.string().min(1, "Kategori wajib diisi"),
  status: z.string().min(1, "Status wajib diisi"),
});

interface CarDialogProps {
  car?: any;
  categories: { id: string; name: string }[];
}

export function CarDialog({ car, categories }: CarDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: car?.name || "",
      slug: car?.slug || "",
      brand: car?.brand || "",
      description: car?.description || "",
      images: [],
      pricePerDay: car?.pricePerDay?.toString() || "",
      year: car?.year?.toString() || "",
      transmission: car?.transmission || "Otomatis",
      capacity: car?.capacity?.toString() || "5",
      fuel: car?.fuel || "Bensin",
      categoryId: car?.categoryId || (categories[0]?.id || ""),
      status: car?.status || "AVAILABLE",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const formData = new FormData();
    
    Object.entries(values).forEach(([key, value]) => {
      if (key === "images") {
        if (value && value.length > 0) {
          for (let i = 0; i < value.length; i++) {
            formData.append("images", value[i]);
          }
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const result = car 
      ? await updateCar(car.id, formData)
      : await createCar(formData);

    setLoading(false);

    if (result.error) {
      toast.error("Terjadi kesalahan sistem");
    } else {
      toast.success(car ? "Data mobil diperbarui" : "Mobil berhasil ditambahkan");
      setOpen(false);
      if (!car) form.reset();
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Hapus gambar ini?")) return;
    const result = await deleteCarImage(imageId);
    if (result.success) {
      toast.success("Gambar dihapus");
    } else {
      toast.error("Gagal menghapus gambar");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {car ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Mobil
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{car ? "Edit Mobil" : "Tambah Mobil Baru"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Mobil</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota Fortuner..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="toyota-fortuner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Merek</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota, Honda..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricePerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Per Hari (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmisi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Otomatis">Otomatis</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kapasitas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fuel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bahan Bakar</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bensin">Bensin</SelectItem>
                        <SelectItem value="Solar">Solar</SelectItem>
                        <SelectItem value="Listrik">Listrik</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="images"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Gambar Mobil (Bisa banyak)</FormLabel>
                    <FormControl>
                      <Input 
                        {...fieldProps}
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={(event) => {
                          const files = event.target.files;
                          if (files) {
                            onChange(Array.from(files));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {car?.images && car.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 border p-2 rounded-md">
                  {car.images.map((img: any) => (
                    <div key={img.id} className="relative aspect-video group">
                      <Image 
                        src={img.url} 
                        alt="Preview" 
                        fill 
                        className="object-cover rounded-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">Tersedia</SelectItem>
                      <SelectItem value="RENTED">Sedang Disewa</SelectItem>
                      <SelectItem value="MAINTENANCE">Dalam Perbaikan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detail mengenai mobil..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {car ? "Simpan Perubahan" : "Tambah Mobil"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
