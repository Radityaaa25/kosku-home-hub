import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import type { Tenant } from "@/lib/types";
import { useApp } from "@/lib/app-context";
import { formatTanggal } from "@/lib/format";

const schema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  nik: z.string().min(8, "NIK minimal 8 digit"),
  hp: z.string().min(8, "Nomor HP tidak valid"),
  email: z.string().email("Email tidak valid"),
  alamat: z.string().min(3, "Alamat wajib diisi"),
  roomId: z.string().nullable(),
  tanggalMasuk: z.string().min(1, "Tanggal masuk wajib"),
  durasiBulan: z.coerce.number(),
  deposit: z.coerce.number().min(0),
  catatan: z.string(),
  status: z.enum(["Aktif", "Tidak Aktif"]),
});

type FormVals = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  initial?: Tenant | null;
  onSubmit: (data: FormVals & { tanggalBerakhir: string }) => void;
}

export function TenantFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const { rooms, tenants } = useApp();
  const form = useForm<FormVals>({
    resolver: zodResolver(schema),
    defaultValues: {
      nama: "", nik: "", hp: "", email: "", alamat: "", roomId: null,
      tanggalMasuk: new Date().toISOString().split("T")[0],
      durasiBulan: 12, deposit: 0, catatan: "", status: "Aktif",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(initial ? {
        nama: initial.nama, nik: initial.nik, hp: initial.hp, email: initial.email,
        alamat: initial.alamat, roomId: initial.roomId,
        tanggalMasuk: initial.tanggalMasuk.split("T")[0],
        durasiBulan: initial.durasiBulan, deposit: initial.deposit,
        catatan: initial.catatan, status: initial.status,
      } : {
        nama: "", nik: "", hp: "", email: "", alamat: "", roomId: null,
        tanggalMasuk: new Date().toISOString().split("T")[0],
        durasiBulan: 12, deposit: 0, catatan: "", status: "Aktif",
      });
    }
  }, [open, initial, form]);

  const tanggalMasuk = form.watch("tanggalMasuk");
  const durasi = form.watch("durasiBulan");
  const tanggalBerakhir = useMemo(() => {
    if (!tanggalMasuk) return "";
    const d = new Date(tanggalMasuk);
    d.setMonth(d.getMonth() + Number(durasi));
    return d.toISOString();
  }, [tanggalMasuk, durasi]);

  const availableRooms = rooms.filter((r) => {
    if (initial && r.id === initial.roomId) return true;
    if (r.status !== "Tersedia") return false;
    return !tenants.some((t) => t.roomId === r.id && t.status === "Aktif");
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Penghuni" : "Tambah Penghuni"}</DialogTitle>
          <DialogDescription>Lengkapi data penghuni dengan benar.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => onSubmit({ ...d, tanggalBerakhir }))} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Nama Lengkap</Label>
              <Input {...form.register("nama")} />
              {form.formState.errors.nama && <p className="mt-1 text-xs text-destructive">{form.formState.errors.nama.message}</p>}
            </div>
            <div>
              <Label>NIK / No. KTP</Label>
              <Input {...form.register("nik")} />
              {form.formState.errors.nik && <p className="mt-1 text-xs text-destructive">{form.formState.errors.nik.message}</p>}
            </div>
            <div>
              <Label>No. HP / WhatsApp</Label>
              <Input {...form.register("hp")} />
            </div>
            <div className="sm:col-span-2">
              <Label>Email</Label>
              <Input type="email" {...form.register("email")} />
              {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label>Alamat Asal</Label>
              <Textarea {...form.register("alamat")} rows={2} />
            </div>
            <div>
              <Label>Kamar</Label>
              <Select value={form.watch("roomId") ?? "none"} onValueChange={(v) => form.setValue("roomId", v === "none" ? null : v)}>
                <SelectTrigger><SelectValue placeholder="Pilih kamar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Belum ada kamar —</SelectItem>
                  {availableRooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.nomor} ({r.tipe})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.watch("status")} onValueChange={(v) => form.setValue("status", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tanggal Masuk</Label>
              <Input type="date" {...form.register("tanggalMasuk")} />
            </div>
            <div>
              <Label>Durasi Kontrak</Label>
              <Select value={String(form.watch("durasiBulan"))} onValueChange={(v) => form.setValue("durasiBulan", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 bulan</SelectItem>
                  <SelectItem value="3">3 bulan</SelectItem>
                  <SelectItem value="6">6 bulan</SelectItem>
                  <SelectItem value="12">12 bulan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Tanggal Berakhir Kontrak</Label>
              <Input value={tanggalBerakhir ? formatTanggal(tanggalBerakhir) : ""} readOnly className="bg-muted" />
            </div>
            <div>
              <Label>Foto KTP</Label>
              <Input type="file" accept="image/*" />
            </div>
            <div>
              <Label>Foto Penghuni</Label>
              <Input type="file" accept="image/*" />
            </div>
            <div className="sm:col-span-2">
              <Label>Uang Deposit (Rp)</Label>
              <Input type="number" {...form.register("deposit")} />
            </div>
            <div className="sm:col-span-2">
              <Label>Catatan Tambahan</Label>
              <Textarea {...form.register("catatan")} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
