import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import type { Bill } from "@/lib/types";
import { useApp } from "@/lib/app-context";
import { formatRupiah } from "@/lib/format";

const schema = z.object({
  tenantId: z.string().min(1, "Pilih penghuni"),
  bulan: z.coerce.number().min(0).max(11),
  tahun: z.coerce.number().min(2020),
  sewa: z.coerce.number().min(0),
  listrik: z.coerce.number().min(0),
  air: z.coerce.number().min(0),
  tambahan: z.coerce.number().min(0),
  ketTambahan: z.string(),
  jatuhTempo: z.string().min(1),
  status: z.enum(["Lunas", "Belum Lunas", "Terlambat"]),
  tanggalBayar: z.string().optional(),
  metode: z.enum(["Transfer Bank", "Cash", "QRIS"]).optional(),
});

type FormVals = z.infer<typeof schema>;

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

interface Props {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  initial?: Bill | null;
  onSubmit: (data: FormVals & { total: number }) => void;
}

export function BillFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const { tenants, rooms } = useApp();
  const now = new Date();

  const form = useForm<FormVals>({
    resolver: zodResolver(schema),
    defaultValues: {
      tenantId: "", bulan: now.getMonth(), tahun: now.getFullYear(),
      sewa: 0, listrik: 0, air: 0, tambahan: 0, ketTambahan: "",
      jatuhTempo: new Date(now.getFullYear(), now.getMonth(), 10).toISOString().split("T")[0],
      status: "Belum Lunas",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(initial ? {
        tenantId: initial.tenantId, bulan: initial.bulan, tahun: initial.tahun,
        sewa: initial.sewa, listrik: initial.listrik, air: initial.air,
        tambahan: initial.tambahan, ketTambahan: initial.ketTambahan,
        jatuhTempo: initial.jatuhTempo.split("T")[0],
        status: initial.status,
        tanggalBayar: initial.tanggalBayar?.split("T")[0],
        metode: initial.metode,
      } : {
        tenantId: "", bulan: now.getMonth(), tahun: now.getFullYear(),
        sewa: 0, listrik: 0, air: 0, tambahan: 0, ketTambahan: "",
        jatuhTempo: new Date(now.getFullYear(), now.getMonth(), 10).toISOString().split("T")[0],
        status: "Belum Lunas",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  const tenantId = form.watch("tenantId");
  useEffect(() => {
    if (!tenantId || initial) return;
    const t = tenants.find((x) => x.id === tenantId);
    const r = rooms.find((x) => x.id === t?.roomId);
    if (r) form.setValue("sewa", r.harga);
  }, [tenantId, tenants, rooms, initial, form]);

  const sewa = Number(form.watch("sewa")) || 0;
  const listrik = Number(form.watch("listrik")) || 0;
  const air = Number(form.watch("air")) || 0;
  const tambahan = Number(form.watch("tambahan")) || 0;
  const total = useMemo(() => sewa + listrik + air + tambahan, [sewa, listrik, air, tambahan]);

  const status = form.watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Tagihan" : "Buat Tagihan Manual"}</DialogTitle>
          <DialogDescription>Isi rincian tagihan dengan teliti.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => onSubmit({ ...d, total }))} className="space-y-4">
          <div>
            <Label>Pilih Penghuni</Label>
            <Select value={form.watch("tenantId")} onValueChange={(v) => form.setValue("tenantId", v)}>
              <SelectTrigger><SelectValue placeholder="Pilih penghuni..." /></SelectTrigger>
              <SelectContent>
                {tenants.filter((t) => t.status === "Aktif").map((t) => {
                  const r = rooms.find((x) => x.id === t.roomId);
                  return <SelectItem key={t.id} value={t.id}>{t.nama} {r ? `(${r.nomor})` : ""}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            {form.formState.errors.tenantId && <p className="mt-1 text-xs text-destructive">{form.formState.errors.tenantId.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Bulan</Label>
              <Select value={String(form.watch("bulan"))} onValueChange={(v) => form.setValue("bulan", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BULAN.map((b, i) => <SelectItem key={i} value={String(i)}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tahun</Label>
              <Input type="number" {...form.register("tahun")} />
            </div>
            <div>
              <Label>Harga Sewa (Rp)</Label>
              <Input type="number" {...form.register("sewa")} />
            </div>
            <div>
              <Label>Tagihan Listrik (Rp)</Label>
              <Input type="number" {...form.register("listrik")} />
            </div>
            <div>
              <Label>Tagihan Air (Rp)</Label>
              <Input type="number" {...form.register("air")} />
            </div>
            <div>
              <Label>Biaya Tambahan (Rp)</Label>
              <Input type="number" {...form.register("tambahan")} />
            </div>
            <div className="sm:col-span-2">
              <Label>Keterangan Tambahan</Label>
              <Input {...form.register("ketTambahan")} placeholder="Misal: denda, perbaikan, dll" />
            </div>
          </div>

          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
            <div className="text-xs uppercase text-muted-foreground">Total Tagihan</div>
            <div className="mt-1 text-3xl font-bold text-primary">{formatRupiah(total)}</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Tanggal Jatuh Tempo</Label>
              <Input type="date" {...form.register("jatuhTempo")} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => form.setValue("status", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                  <SelectItem value="Lunas">Lunas</SelectItem>
                  <SelectItem value="Terlambat">Terlambat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "Lunas" && (
              <>
                <div>
                  <Label>Tanggal Bayar</Label>
                  <Input type="date" {...form.register("tanggalBayar")} />
                </div>
                <div>
                  <Label>Metode Pembayaran</Label>
                  <Select value={form.watch("metode") ?? ""} onValueChange={(v) => form.setValue("metode", v as any)}>
                    <SelectTrigger><SelectValue placeholder="Pilih metode" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transfer Bank">Transfer Bank</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="QRIS">QRIS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label>Bukti Bayar</Label>
                  <Input type="file" accept="image/*" />
                </div>
              </>
            )}
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
