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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CategoryDialog } from "./category-dialog";
import { DeleteCategoryDialog } from "./delete-dialog";

export default async function CategoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { cars: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori Mobil</h1>
          <p className="text-muted-foreground">Kelola kategori mobil yang tersedia.</p>
        </div>
        <CategoryDialog />
      </div>

      <div className="rounded-xl border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-center">Jumlah Mobil</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Belum ada kategori.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-slate-500">{category.slug}</TableCell>
                  <TableCell className="max-w-xs truncate">{category.description || "-"}</TableCell>
                  <TableCell className="text-center">{category._count.cars}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <CategoryDialog category={category} />
                      <DeleteCategoryDialog categoryId={category.id} categoryName={category.name} />
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
