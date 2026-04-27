import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { Complaint } from "@/lib/types";
import { useApp } from "@/lib/app-context";

const schema = z.object({
  tenantId: z.string().min(1, "Pilih penghuni"),
  kategori: z.enum(["Fasilitas Rusak", "Kebersihan", "Keamanan", "Kebisingan", "Listrik & Air", "Lainnya"]),
  prioritas: z.enum(["Tinggi", "Sedang", "Rendah"]),
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  deskripsi: z.string().min(5, "Deskripsi minimal 5 karakter"),
  status: z.enum(["Baru", "Diproses", "Selesai", "Ditolak"]),
  catatan: z.string(),
  targetSelesai: z.string().optional(),
});

type FormVals = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  initial?: Complaint | null;
  onSubmit: (data: FormVals) => void;
  hideTenant?: boolean;
  forcedTenantId?: string;
}

export function ComplaintFormDialog({ open, onOpenChange, initial, onSubmit, hideTenant, forcedTenantId }: Props) {
  const { tenants } = useApp();
  const form = useForm<FormVals>({
    resolver: zodResolver(schema),
    defaultValues: {
      tenantId: forcedTenantId ?? "", kategori: "Fasilitas Rusak", prioritas: "Sedang",
      judul: "", deskripsi: "", status: "Baru", catatan: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(initial ? {
        tenantId: initial.tenantId, kategori: initial.kategori, prioritas: initial.prioritas,
        judul: initial.judul, deskripsi: initial.deskripsi, status: initial.status,
        catatan: initial.catatan, targetSelesai: initial.targetSelesai?.split("T")[0],
      } : {
        tenantId: forcedTenantId ?? "", kategori: "Fasilitas Rusak", prioritas: "Sedang",
        judul: "", deskripsi: "", status: "Baru", catatan: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial, forcedTenantId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Pengaduan" : "Buat Pengaduan"}</DialogTitle>
          <DialogDescription>Lengkapi detail pengaduan dengan jelas.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!hideTenant && (
            <div>
              <Label>Penghuni</Label>
              <Select value={form.watch("tenantId")} onValueChange={(v) => form.setValue("tenantId", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih penghuni..." /></SelectTrigger>
                <SelectContent>
                  {tenants.filter((t) => t.status === "Aktif").map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.tenantId && <p className="mt-1 text-xs text-destructive">{form.formState.errors.tenantId.message}</p>}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Kategori</Label>
              <Select value={form.watch("kategori")} onValueChange={(v) => form.setValue("kategori", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fasilitas Rusak">Fasilitas Rusak</SelectItem>
                  <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                  <SelectItem value="Keamanan">Keamanan</SelectItem>
                  <SelectItem value="Kebisingan">Kebisingan</SelectItem>
                  <SelectItem value="Listrik & Air">Listrik & Air</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioritas</Label>
              <Select value={form.watch("prioritas")} onValueChange={(v) => form.setValue("prioritas", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tinggi">Tinggi</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Rendah">Rendah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Judul Pengaduan</Label>
            <Input {...form.register("judul")} placeholder="Singkat dan jelas" />
            {form.formState.errors.judul && <p className="mt-1 text-xs text-destructive">{form.formState.errors.judul.message}</p>}
          </div>
          <div>
            <Label>Deskripsi Lengkap</Label>
            <Textarea {...form.register("deskripsi")} rows={4} placeholder="Jelaskan masalah secara detail..." />
            {form.formState.errors.deskripsi && <p className="mt-1 text-xs text-destructive">{form.formState.errors.deskripsi.message}</p>}
          </div>
          <div>
            <Label>Foto Bukti</Label>
            <Input type="file" accept="image/*" multiple />
          </div>
          {!hideTenant && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Status</Label>
                  <Select value={form.watch("status")} onValueChange={(v) => form.setValue("status", v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baru">Baru</SelectItem>
                      <SelectItem value="Diproses">Diproses</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                      <SelectItem value="Ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Selesai</Label>
                  <Input type="date" {...form.register("targetSelesai")} />
                </div>
              </div>
              <div>
                <Label>Catatan / Tindakan</Label>
                <Textarea {...form.register("catatan")} rows={2} />
              </div>
            </>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
