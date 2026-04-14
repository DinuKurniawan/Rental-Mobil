import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MethodDialog } from "./method-dialog";
import { DeleteMethodDialog } from "./delete-dialog";

export default async function MetodeBayarPage() {
  const methods = await prisma.paymentMethod.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metode Pembayaran</h1>
          <p className="text-muted-foreground">Kelola rekening bank (ATM) dan QRIS untuk pembayaran manual.</p>
        </div>
        <MethodDialog />
      </div>

      <div className="rounded-xl border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Belum ada metode pembayaran.
                </TableCell>
              </TableRow>
            ) : (
              methods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell>
                    {method.type === "BANK_TRANSFER" ? "Transfer Bank" : "QRIS"}
                  </TableCell>
                  <TableCell>
                    {method.type === "BANK_TRANSFER" ? (
                      <div className="text-sm">
                        <div>{method.accountNumber}</div>
                        <div className="text-muted-foreground text-xs">{method.accountName}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {method.image ? "QRIS Image tersedia" : "-"}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {method.isActive ? (
                      <Badge className="bg-green-500">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary">Nonaktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <MethodDialog method={method} />
                      <DeleteMethodDialog methodId={method.id} methodName={method.name} />
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
