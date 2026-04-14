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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function PembayaranPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      booking: {
        include: {
          user: true,
          car: true,
        },
      },
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "settlement":
      case "capture":
        return <Badge className="bg-green-500">Berhasil</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Tertunda</Badge>;
      case "failed":
      case "deny":
      case "cancel":
        return <Badge variant="destructive">Gagal</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Pembayaran</h1>
          <p className="text-muted-foreground">Monitor semua transaksi yang masuk.</p>
        </div>
      </div>

      <div className="rounded-xl border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Mobil</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Belum ada transaksi.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs uppercase">{payment.orderId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{payment.booking.user.name}</span>
                      <span className="text-xs text-muted-foreground">{payment.booking.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{payment.booking.car.name}</TableCell>
                  <TableCell className="capitalize">{payment.method || "Midtrans"}</TableCell>
                  <TableCell className="font-semibold">
                    Rp {payment.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right text-xs">
                    {new Date(payment.createdAt).toLocaleString("id-ID")}
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
