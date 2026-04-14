import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Fuel, Users, Settings2 } from "lucide-react";
import Image from "next/image";
import { CarDialog } from "./car-dialog";
import { DeleteCarDialog } from "./delete-dialog";

export default async function CarPage() {
  const [cars, categories] = await Promise.all([
    prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany(),
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge className="bg-green-500 hover:bg-green-600">Tersedia</Badge>;
      case "RENTED":
        return <Badge variant="secondary">Disewa</Badge>;
      case "MAINTENANCE":
        return <Badge variant="destructive">Servis</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Mobil</h1>
          <p className="text-muted-foreground">Kelola armada mobil DriveKita.</p>
        </div>
        <CarDialog categories={categories} />
      </div>

      <div className="rounded-xl border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mobil</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Spesifikasi</TableHead>
              <TableHead>Harga/Hari</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Belum ada armada mobil.
                </TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 relative rounded-md overflow-hidden bg-slate-100">
                        {car.images && car.images[0] ? (
                          <Image
                            src={car.images[0].url}
                            alt={car.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="font-medium">{car.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{car.category.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Settings2 className="h-3 w-3" /> {car.transmission}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {car.capacity} Kursi
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-3 w-3" /> {car.fuel}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    Rp {car.pricePerDay.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>{getStatusBadge(car.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <CarDialog car={car} categories={categories} />
                      <DeleteCarDialog carId={car.id} carName={car.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
