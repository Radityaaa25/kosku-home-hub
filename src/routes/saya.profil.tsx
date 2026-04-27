import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/lib/app-context";
import { formatTanggal, formatRupiah, daysUntil } from "@/lib/format";
import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/saya/profil")({
  head: () => ({
    meta: [
      { title: "Profil Saya — KosKu" },
      { name: "description", content: "Lihat dan kelola data profil serta kontrak kos Anda." },
    ],
  }),
  component: SayaProfil,
});

function SayaProfil() {
  const { tenants, rooms, currentPenghuniId, updateTenant } = useApp();
  const me = tenants.find((t) => t.id === currentPenghuniId)!;
  const room = rooms.find((r) => r.id === me.roomId);
  const [edit, setEdit] = useState(false);
  const [hp, setHp] = useState(me.hp);
  const [email, setEmail] = useState(me.email);

  const sisa = daysUntil(me.tanggalBerakhir);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Profil Saya" subtitle="Informasi pribadi dan kontrak" action={
          edit ? (
            <Button onClick={() => { updateTenant(me.id, { hp, email }); setEdit(false); toast.success("Profil diperbarui"); }}>
              <Save className="h-4 w-4 mr-1" />Simpan
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setEdit(true)}><Pencil className="h-4 w-4 mr-1" />Edit Profil</Button>
          )
        } />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <Avatar className="h-24 w-24"><AvatarFallback className="bg-primary text-primary-foreground text-2xl">{me.nama.split(" ").map(s=>s[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
              <div>
                <div className="text-xl font-bold">{me.nama}</div>
                <div className="text-sm text-muted-foreground">{me.email}</div>
              </div>
              <div className="w-full mt-2 rounded-lg border border-border p-3 text-left text-sm space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">NIK</span><span className="font-mono text-xs">{me.nik}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium">{me.status}</span></div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="text-sm font-semibold uppercase text-muted-foreground">Kontak</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>No. HP / WhatsApp</Label>
                    <Input value={hp} onChange={(e) => setHp(e.target.value)} disabled={!edit} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!edit} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Alamat Asal</Label>
                    <Input value={me.alamat} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-6">
                <div className="text-sm font-semibold uppercase text-muted-foreground">Kamar & Kontrak</div>
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div><div className="text-muted-foreground text-xs">Kamar</div><div className="font-medium">{room?.nomor ?? "-"} ({room?.tipe})</div></div>
                  <div><div className="text-muted-foreground text-xs">Harga / Bulan</div><div className="font-medium">{room ? formatRupiah(room.harga) : "-"}</div></div>
                  <div><div className="text-muted-foreground text-xs">Tanggal Masuk</div><div className="font-medium">{formatTanggal(me.tanggalMasuk)}</div></div>
                  <div><div className="text-muted-foreground text-xs">Tanggal Berakhir</div><div className="font-medium">{formatTanggal(me.tanggalBerakhir)}</div></div>
                  <div><div className="text-muted-foreground text-xs">Durasi Kontrak</div><div className="font-medium">{me.durasiBulan} bulan</div></div>
                  <div><div className="text-muted-foreground text-xs">Sisa Hari</div><div className="font-bold text-primary">{sisa} hari</div></div>
                  <div><div className="text-muted-foreground text-xs">Deposit</div><div className="font-medium">{formatRupiah(me.deposit)}</div></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
