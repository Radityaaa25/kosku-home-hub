import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-context";
import { ComplaintStatusPill, PriorityPill } from "@/components/StatusPill";
import { formatTanggal } from "@/lib/format";
import { Plus, Search, Pencil, Trash2, Eye, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { ComplaintFormDialog } from "@/features/complaints/ComplaintFormDialog";
import { ComplaintDetailDialog } from "@/features/complaints/ComplaintDetailDialog";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Complaint } from "@/lib/types";

export const Route = createFileRoute("/pengaduan")({
  head: () => ({
    meta: [
      { title: "Manajemen Pengaduan — KosKu" },
      { name: "description", content: "Kelola pengaduan penghuni dengan timeline status dan prioritas." },
    ],
  }),
  component: PengaduanPage,
});

function PengaduanPage() {
  const { complaints, tenants, rooms, addComplaint, updateComplaint, deleteComplaint } = useApp();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [prioF, setPrioF] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Complaint | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Complaint | null>(null);

  const filtered = useMemo(() => complaints.filter((c) => {
    const t = tenants.find((x) => x.id === c.tenantId);
    const r = rooms.find((x) => x.id === t?.roomId);
    const q = search.toLowerCase();
    if (q && !t?.nama.toLowerCase().includes(q) && !r?.nomor.toLowerCase().includes(q)) return false;
    if (statusF !== "all" && c.status !== statusF) return false;
    if (prioF !== "all" && c.prioritas !== prioF) return false;
    return true;
  }).sort((a, b) => +new Date(b.tanggalLapor) - +new Date(a.tanggalLapor)), [complaints, tenants, rooms, search, statusF, prioF]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Manajemen Pengaduan" subtitle={`${complaints.length} pengaduan tercatat`} action={
          <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4 mr-1" />Buat Pengaduan</Button>
        } />

        <Card>
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari penghuni atau kamar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusF} onValueChange={setStatusF}>
              <SelectTrigger className="lg:w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Baru">Baru</SelectItem>
                <SelectItem value="Diproses">Diproses</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>
            <Select value={prioF} onValueChange={setPrioF}>
              <SelectTrigger className="lg:w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prioritas</SelectItem>
                <SelectItem value="Tinggi">Tinggi</SelectItem>
                <SelectItem value="Sedang">Sedang</SelectItem>
                <SelectItem value="Rendah">Rendah</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted"><Wrench className="h-7 w-7 text-muted-foreground" /></div>
                <div className="font-medium">Tidak ada pengaduan</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Penghuni</TableHead>
                      <TableHead>Kamar</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Judul</TableHead>
                      <TableHead>Prioritas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tgl Lapor</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((c) => {
                      const t = tenants.find((x) => x.id === c.tenantId);
                      const r = rooms.find((x) => x.id === t?.roomId);
                      return (
                        <TableRow key={c.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{t?.nama ?? "-"}</TableCell>
                          <TableCell>{r?.nomor ?? "-"}</TableCell>
                          <TableCell className="text-xs">{c.kategori}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{c.judul}</TableCell>
                          <TableCell><PriorityPill p={c.prioritas} /></TableCell>
                          <TableCell><ComplaintStatusPill status={c.status} /></TableCell>
                          <TableCell className="text-sm">{formatTanggal(c.tanggalLapor)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => setDetail(c)}><Eye className="h-3.5 w-3.5" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDelId(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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

      <ComplaintFormDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSubmit={(data) => {
          if (editing) {
            const newTimeline = [...editing.timeline];
            if (data.status !== editing.status) {
              newTimeline.push({ date: new Date().toISOString(), label: `Status diubah ke ${data.status}` });
            }
            updateComplaint(editing.id, {
              ...data,
              timeline: newTimeline,
              tanggalSelesai: data.status === "Selesai" ? new Date().toISOString() : editing.tanggalSelesai,
            });
            toast.success("Pengaduan diperbarui");
          } else {
            addComplaint({
              ...data,
              tanggalLapor: new Date().toISOString(),
              timeline: [{ date: new Date().toISOString(), label: "Laporan masuk" }],
            });
            toast.success("Pengaduan dibuat");
          }
          setOpen(false);
        }}
      />

      <ComplaintDetailDialog complaint={detail} open={!!detail} onOpenChange={(o) => !o && setDetail(null)} />

      <AlertDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengaduan?</AlertDialogTitle>
            <AlertDialogDescription>Pengaduan akan dihapus permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => {
              if (delId) { deleteComplaint(delId); toast.success("Pengaduan dihapus"); }
              setDelId(null);
            }}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
