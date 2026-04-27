import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/lib/app-context";
import { RoomStatusPill } from "@/components/StatusPill";
import { formatRupiah } from "@/lib/format";
import { Plus, Search, Pencil, Trash2, Bed, Wifi, Snowflake } from "lucide-react";
import { useMemo, useState } from "react";
import { RoomFormDialog } from "@/features/rooms/RoomFormDialog";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Room } from "@/lib/types";

export const Route = createFileRoute("/kamar")({
  head: () => ({
    meta: [
      { title: "Manajemen Kamar — KosKu" },
      { name: "description", content: "Kelola data kamar kos: tipe, fasilitas, harga, dan ketersediaan." },
    ],
  }),
  component: KamarPage,
});

function KamarPage() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useApp();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<string>("all");
  const [tipeF, setTipeF] = useState<string>("all");
  const [lantaiF, setLantaiF] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [delId, setDelId] = useState<string | null>(null);

  const filtered = useMemo(() => rooms.filter((r) => {
    if (search && !r.nomor.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusF !== "all" && r.status !== statusF) return false;
    if (tipeF !== "all" && r.tipe !== tipeF) return false;
    if (lantaiF !== "all" && String(r.lantai) !== lantaiF) return false;
    return true;
  }), [rooms, search, statusF, tipeF, lantaiF]);

  const lantaiOpts = Array.from(new Set(rooms.map((r) => r.lantai))).sort();

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Manajemen Kamar" subtitle={`${rooms.length} kamar terdaftar`} action={
          <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4 mr-1" />Tambah Kamar</Button>
        } />

        <Card>
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari nomor kamar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusF} onValueChange={setStatusF}>
              <SelectTrigger className="lg:w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Tersedia">Tersedia</SelectItem>
                <SelectItem value="Terisi">Terisi</SelectItem>
                <SelectItem value="Dalam Perawatan">Dalam Perawatan</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipeF} onValueChange={setTipeF}>
              <SelectTrigger className="lg:w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Deluxe">Deluxe</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={lantaiF} onValueChange={setLantaiF}>
              <SelectTrigger className="lg:w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Lantai</SelectItem>
                {lantaiOpts.map((l) => <SelectItem key={l} value={String(l)}>Lantai {l}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {filtered.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted"><Bed className="h-7 w-7 text-muted-foreground" /></div>
            <div>
              <div className="font-medium">Tidak ada kamar</div>
              <div className="text-sm text-muted-foreground">Belum ada kamar sesuai filter.</div>
            </div>
          </CardContent></Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => (
              <Card key={r.id} className="overflow-hidden transition hover:shadow-md">
                <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                  <Bed className="h-12 w-12 text-primary/50" />
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-lg">{r.nomor}</div>
                      <div className="text-xs text-muted-foreground">{r.tipe} • Lantai {r.lantai}</div>
                    </div>
                    <RoomStatusPill status={r.status} />
                  </div>
                  <div className="text-xl font-bold text-primary">{formatRupiah(r.harga)}<span className="text-xs font-normal text-muted-foreground">/bln</span></div>
                  <div className="flex flex-wrap gap-1">
                    {r.fasilitas.slice(0, 3).map((f) => (
                      <span key={f} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {f === "AC" && <Snowflake className="h-2.5 w-2.5" />}
                        {f === "WiFi" && <Wifi className="h-2.5 w-2.5" />}
                        {f}
                      </span>
                    ))}
                    {r.fasilitas.length > 3 && <span className="text-[10px] text-muted-foreground">+{r.fasilitas.length - 3}</span>}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditing(r); setOpen(true); }}>
                      <Pencil className="h-3 w-3 mr-1" />Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setDelId(r.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <RoomFormDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSubmit={(data) => {
          if (editing) {
            updateRoom(editing.id, data);
            toast.success("Kamar berhasil diperbarui");
          } else {
            addRoom(data);
            toast.success("Kamar berhasil ditambahkan");
          }
          setOpen(false);
        }}
      />

      <AlertDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kamar?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Data kamar akan dihapus permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => {
              if (delId) { deleteRoom(delId); toast.success("Kamar dihapus"); }
              setDelId(null);
            }}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
