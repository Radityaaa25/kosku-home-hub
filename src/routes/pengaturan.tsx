import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { toast } from "sonner";

export const Route = createFileRoute("/pengaturan")({
  head: () => ({
    meta: [
      { title: "Pengaturan — KosKu" },
      { name: "description", content: "Pengaturan profil kos, tagihan otomatis, dan manajemen user." },
    ],
  }),
  component: PengaturanPage,
});

function PengaturanPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Pengaturan" subtitle="Konfigurasi sistem dan profil kos" />
        <Tabs defaultValue="profil">
          <TabsList>
            <TabsTrigger value="profil">Profil Kos</TabsTrigger>
            <TabsTrigger value="tagihan">Pengaturan Tagihan</TabsTrigger>
            <TabsTrigger value="user">Manajemen User</TabsTrigger>
          </TabsList>

          <TabsContent value="profil">
            <Card><CardContent className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Nama Kos</Label><Input defaultValue="Kos KosKu Sentral" /></div>
                <div><Label>No. HP</Label><Input defaultValue="081234567890" /></div>
                <div className="sm:col-span-2"><Label>Alamat Lengkap</Label><Textarea defaultValue="Jl. Merdeka No. 100, Bandung, Jawa Barat" /></div>
                <div><Label>Email</Label><Input type="email" defaultValue="info@kosku.id" /></div>
                <div><Label>Logo</Label><Input type="file" accept="image/*" /></div>
                <div className="sm:col-span-2"><Label>Deskripsi</Label><Textarea rows={3} defaultValue="Kos modern dan nyaman di pusat kota." /></div>
              </div>
              <div className="flex justify-end"><Button onClick={() => toast.success("Profil kos disimpan")}>Simpan</Button></div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="tagihan">
            <Card><CardContent className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Tanggal Generate Tagihan Otomatis</Label><Input type="number" min={1} max={28} defaultValue={1} /></div>
                <div><Label>Jatuh Tempo Default (tanggal)</Label><Input type="number" min={1} max={28} defaultValue={10} /></div>
                <div><Label>Denda Keterlambatan (% per hari)</Label><Input type="number" defaultValue={1} /></div>
                <div><Label>Atau Denda Flat (Rp)</Label><Input type="number" defaultValue={10000} /></div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div><div className="font-medium">Pengingat Tagihan Otomatis</div><div className="text-xs text-muted-foreground">Kirim pengingat 3 hari sebelum jatuh tempo</div></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div><div className="font-medium">Notifikasi WhatsApp</div><div className="text-xs text-muted-foreground">Kirim notifikasi via WhatsApp</div></div>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-end"><Button onClick={() => toast.success("Pengaturan tagihan disimpan")}>Simpan</Button></div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="user">
            <Card><CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-medium">Pak Joko</TableCell><TableCell>joko@kosku.id</TableCell><TableCell>Owner</TableCell><TableCell><StatusPill variant="success">Aktif</StatusPill></TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Mbak Sari</TableCell><TableCell>sari@kosku.id</TableCell><TableCell>Pengelola</TableCell><TableCell><StatusPill variant="success">Aktif</StatusPill></TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Pak Budi</TableCell><TableCell>budi@kosku.id</TableCell><TableCell>Pengelola</TableCell><TableCell><StatusPill variant="default">Nonaktif</StatusPill></TableCell></TableRow>
                </TableBody>
              </Table>
              <div className="p-4 border-t border-border">
                <Button onClick={() => toast.info("Form tambah user")}>+ Tambah User</Button>
              </div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
