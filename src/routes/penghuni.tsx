import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/lib/app-context";
import { StatusPill } from "@/components/StatusPill";
import { formatTanggal } from "@/lib/format";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { TenantFormDialog } from "@/features/tenants/TenantFormDialog";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Tenant } from "@/lib/types";

export const Route = createFileRoute("/penghuni")({
  head: () => ({
    meta: [
      { title: "Manajemen Penghuni — KosKu" },
      { name: "description", content: "Kelola data penghuni kos beserta kontrak dan informasi pribadi." },
    ],
  }),
  component: PenghuniPage,
});

function initials(n: string) { return n.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase(); }

function PenghuniPage() {
  const { tenants, rooms, addTenant, updateTenant, deleteTenant } = useApp();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [delId, setDelId] = useState<string | null>(null);

  const filtered = useMemo(() => tenants.filter((t) => {
    const q = search.toLowerCase();
    const room = rooms.find((r) => r.id === t.roomId);
    if (q && !t.nama.toLowerCase().includes(q) && !(room?.nomor.toLowerCase().includes(q))) return false;
    if (statusF !== "all" && t.status !== statusF) return false;
    return true;
  }), [tenants, rooms, search, statusF]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Manajemen Penghuni" subtitle={`${tenants.length} penghuni terdaftar`} action={
          <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4 mr-1" />Tambah Penghuni</Button>
        } />

        <Card>
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari nama atau kamar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusF} onValueChange={setStatusF}>
              <SelectTrigger className="lg:w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted"><Users className="h-7 w-7 text-muted-foreground" /></div>
                <div className="font-medium">Belum ada penghuni</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Penghuni</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>HP</TableHead>
                      <TableHead>Kamar</TableHead>
                      <TableHead>Masuk</TableHead>
                      <TableHead>Berakhir</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((t) => {
                      const room = rooms.find((r) => r.id === t.roomId);
                      return (
                        <TableRow key={t.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials(t.nama)}</AvatarFallback></Avatar>
                              <div>
                                <div className="font-medium">{t.nama}</div>
                                <div className="text-xs text-muted-foreground">{t.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{t.nik}</TableCell>
                          <TableCell>{t.hp}</TableCell>
                          <TableCell><span className="font-medium">{room?.nomor ?? "—"}</span></TableCell>
                          <TableCell className="text-sm">{formatTanggal(t.tanggalMasuk)}</TableCell>
                          <TableCell className="text-sm">{formatTanggal(t.tanggalBerakhir)}</TableCell>
                          <TableCell><StatusPill variant={t.status === "Aktif" ? "success" : "default"}>{t.status}</StatusPill></TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => { setEditing(t); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDelId(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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

      <TenantFormDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSubmit={(data) => {
          if (editing) {
            updateTenant(editing.id, data);
            toast.success("Penghuni diperbarui");
          } else {
            addTenant(data);
            toast.success("Penghuni ditambahkan");
          }
          setOpen(false);
        }}
      />

      <AlertDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus penghuni?</AlertDialogTitle>
            <AlertDialogDescription>Data penghuni akan dihapus permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => {
              if (delId) { deleteTenant(delId); toast.success("Penghuni dihapus"); }
              setDelId(null);
            }}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
