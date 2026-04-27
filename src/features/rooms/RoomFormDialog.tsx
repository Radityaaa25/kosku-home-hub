import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { Room } from "@/lib/types";

const FASILITAS = ["AC", "WiFi", "Kamar Mandi Dalam", "Lemari", "Kasur", "Meja Belajar", "Water Heater"];

const schema = z.object({
  nomor: z.string().min(1, "Nomor kamar wajib diisi"),
  tipe: z.enum(["Standard", "Deluxe", "VIP"]),
  lantai: z.coerce.number().min(1, "Minimal lantai 1"),
  harga: z.coerce.number().min(1, "Harga wajib diisi"),
  luas: z.coerce.number().min(1, "Luas wajib diisi"),
  status: z.enum(["Tersedia", "Terisi", "Dalam Perawatan"]),
  fasilitas: z.array(z.string()),
  deskripsi: z.string(),
});

type FormVals = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  initial?: Room | null;
  onSubmit: (data: FormVals) => void;
}

export function RoomFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const form = useForm<FormVals>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomor: "", tipe: "Standard", lantai: 1, harga: 800000, luas: 9,
      status: "Tersedia", fasilitas: [], deskripsi: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(initial ? {
        nomor: initial.nomor, tipe: initial.tipe, lantai: initial.lantai,
        harga: initial.harga, luas: initial.luas, status: initial.status,
        fasilitas: initial.fasilitas, deskripsi: initial.deskripsi,
      } : {
        nomor: "", tipe: "Standard", lantai: 1, harga: 800000, luas: 9,
        status: "Tersedia", fasilitas: [], deskripsi: "",
      });
    }
  }, [open, initial, form]);

  const fasilitas = form.watch("fasilitas");
  const toggle = (f: string) => {
    const set = new Set(fasilitas);
    if (set.has(f)) set.delete(f); else set.add(f);
    form.setValue("fasilitas", Array.from(set));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Kamar" : "Tambah Kamar"}</DialogTitle>
          <DialogDescription>Lengkapi detail kamar di bawah ini.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Nomor Kamar</Label>
              <Input {...form.register("nomor")} placeholder="K101" />
              {form.formState.errors.nomor && <p className="mt-1 text-xs text-destructive">{form.formState.errors.nomor.message}</p>}
            </div>
            <div>
              <Label>Tipe Kamar</Label>
              <Select value={form.watch("tipe")} onValueChange={(v) => form.setValue("tipe", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lantai</Label>
              <Input type="number" {...form.register("lantai")} />
            </div>
            <div>
              <Label>Luas (m²)</Label>
              <Input type="number" {...form.register("luas")} />
            </div>
            <div>
              <Label>Harga Sewa / Bulan (Rp)</Label>
              <Input type="number" {...form.register("harga")} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.watch("status")} onValueChange={(v) => form.setValue("status", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tersedia">Tersedia</SelectItem>
                  <SelectItem value="Terisi">Terisi</SelectItem>
                  <SelectItem value="Dalam Perawatan">Dalam Perawatan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Fasilitas</Label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FASILITAS.map((f) => (
                <label key={f} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm cursor-pointer hover:bg-muted">
                  <Checkbox checked={fasilitas.includes(f)} onCheckedChange={() => toggle(f)} />
                  <span>{f}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label>Foto Kamar</Label>
            <Input type="file" accept="image/*" />
          </div>
          <div>
            <Label>Deskripsi</Label>
            <Textarea {...form.register("deskripsi")} rows={3} placeholder="Deskripsi singkat kamar..." />
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
