import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-context";
import { BillStatusPill } from "@/components/StatusPill";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { Plus, Search, Pencil, Trash2, Wallet, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { BillFormDialog } from "@/features/bills/BillFormDialog";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Bill } from "@/lib/types";

export const Route = createFileRoute("/tagihan")({
  head: () => ({
    meta: [
      { title: "Manajemen Tagihan — KosKu" },
      { name: "description", content: "Kelola tagihan bulanan, status pembayaran, dan generate tagihan otomatis." },
    ],
  }),
  component: TagihanPage,
});

const BULAN_S = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

function TagihanPage() {
  const { bills, tenants, rooms, addBill, updateBill, deleteBill, generateMonthlyBills } = useApp();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [bulanF, setBulanF] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Bill | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [genOpen, setGenOpen] = useState(false);

  const filtered = useMemo(() => bills.filter((b) => {
    const t = tenants.find((x) => x.id === b.tenantId);
    if (search && !t?.nama.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusF !== "all" && b.status !== statusF) return false;
    if (bulanF !== "all" && String(b.bulan) !== bulanF) return false;
    return true;
  }).sort((a, b) => b.tahun * 12 + b.bulan - (a.tahun * 12 + a.bulan)), [bills, tenants, search, statusF, bulanF]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Manajemen Tagihan" subtitle={`${bills.length} tagihan terdaftar`} action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setGenOpen(true)}><Zap className="h-4 w-4 mr-1" />Generate Bulanan</Button>
            <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4 mr-1" />Buat Tagihan</Button>
          </div>
        } />

        <Card>
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari nama penghuni..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusF} onValueChange={setStatusF}>
              <SelectTrigger className="lg:w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Lunas">Lunas</SelectItem>
                <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                <SelectItem value="Terlambat">Terlambat</SelectItem>
              </SelectContent>
            </Select>
            <Select value={bulanF} onValueChange={setBulanF}>
              <SelectTrigger className="lg:w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Bulan</SelectItem>
                {BULAN_S.map((b, i) => <SelectItem key={i} value={String(i)}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted"><Wallet className="h-7 w-7 text-muted-foreground" /></div>
                <div className="font-medium">Belum ada tagihan</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Penghuni</TableHead>
                      <TableHead>Kamar</TableHead>
                      <TableHead>Periode</TableHead>
                      <TableHead>Rincian</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Jatuh Tempo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((b) => {
                      const t = tenants.find((x) => x.id === b.tenantId);
                      const r = rooms.find((x) => x.id === t?.roomId);
                      return (
                        <TableRow key={b.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{t?.nama ?? "-"}</TableCell>
                          <TableCell>{r?.nomor ?? "-"}</TableCell>
                          <TableCell>{BULAN_S[b.bulan]} {b.tahun}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            Sewa {formatRupiah(b.sewa)}<br/>+ L {formatRupiah(b.listrik)} • A {formatRupiah(b.air)}
                          </TableCell>
                          <TableCell className="font-bold">{formatRupiah(b.total)}</TableCell>
                          <TableCell className="text-sm">{formatTanggal(b.jatuhTempo)}</TableCell>
                          <TableCell><BillStatusPill status={b.status} /></TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => { setEditing(b); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDelId(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BillFormDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSubmit={(data) => {
          if (editing) {
            updateBill(editing.id, data);
            toast.success("Tagihan diperbarui");
          } else {
            addBill(data);
            toast.success("Tagihan dibuat");
          }
          setOpen(false);
        }}
      />

      <AlertDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus tagihan?</AlertDialogTitle>
            <AlertDialogDescription>Tagihan ini akan dihapus permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => {
              if (delId) { deleteBill(delId); toast.success("Tagihan dihapus"); }
              setDelId(null);
            }}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={genOpen} onOpenChange={setGenOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Tagihan Bulan Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Sistem akan membuat tagihan otomatis untuk semua penghuni aktif yang belum memiliki tagihan bulan ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              const n = generateMonthlyBills();
              toast.success(n > 0 ? `${n} tagihan berhasil dibuat` : "Semua penghuni sudah memiliki tagihan bulan ini");
              setGenOpen(false);
            }}>Generate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
