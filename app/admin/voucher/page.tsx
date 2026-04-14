import { getVouchers } from "./actions";
import { formatNumber } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Ticket, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Calendar,
  Zap,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VoucherDialog from "./voucher-dialog";
import DeleteDialog from "./delete-dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default async function VoucherAdminPage() {
  const vouchers = await getVouchers();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            Voucher <span className="text-muted-foreground/30">Management</span>
          </h1>
          <p className="text-muted-foreground font-medium">Create and manage discount codes for your customers.</p>
        </div>
        <VoucherDialog 
          trigger={
            <Button className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[11px] gap-2">
              <Plus className="h-4 w-4" />
              New Voucher
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12">
          <div className="bg-background border border-border rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border flex items-center gap-4 bg-muted/10">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Search vouchers..." 
                className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-muted-foreground/40"
                suppressHydrationWarning
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/5">
                    <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Voucher</th>
                    <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Type</th>
                    <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Value</th>
                    <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Usage</th>
                    <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Status</th>
                    <th className="text-right p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vouchers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center space-y-4">
                        <div className="h-20 w-20 bg-muted/30 rounded-[32px] flex items-center justify-center mx-auto">
                          <Ticket className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                        <p className="text-muted-foreground font-medium italic">No vouchers found.</p>
                      </td>
                    </tr>
                  ) : (
                    vouchers.map((voucher) => (
                      <tr key={voucher.id} className="hover:bg-muted/5 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center border border-border group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                              <Tag className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-black uppercase tracking-widest text-sm">{voucher.code}</p>
                              {voucher.expiryDate && (
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Exp: {format(new Date(voucher.expiryDate), "dd MMM yyyy")}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-muted rounded-full">
                            {voucher.type}
                          </span>
                        </td>
                        <td className="p-6">
                          <p className="font-black text-sm">
                            {voucher.type === "PERCENTAGE" ? `${voucher.value}%` : `Rp ${formatNumber(voucher.value)}`}
                          </p>
                        </td>
                        <td className="p-6">
                          <div className="space-y-1">
                            <p className="text-xs font-bold">
                              {voucher.usedCount} / {voucher.usageLimit === 0 ? "∞" : voucher.usageLimit}
                            </p>
                            <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-foreground transition-all" 
                                style={{ width: `${voucher.usageLimit === 0 ? 0 : (voucher.usedCount / voucher.usageLimit) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <Badge variant={voucher.isActive ? "default" : "secondary"} className="font-black uppercase tracking-widest text-[9px]">
                            {voucher.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted">
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-border">
                              <VoucherDialog 
                                voucher={voucher}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-xl gap-3 font-bold uppercase tracking-widest text-[10px] p-3 cursor-pointer">
                                    <Edit2 className="h-4 w-4" />
                                    Edit Details
                                  </DropdownMenuItem>
                                }
                              />
                              <DeleteDialog 
                                id={voucher.id}
                                name={voucher.code}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-xl gap-3 font-bold uppercase tracking-widest text-[10px] p-3 cursor-pointer text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                    Delete Voucher
                                  </DropdownMenuItem>
                                }
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}