import { useApp } from "@/lib/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { BillStatusPill, ComplaintStatusPill } from "@/components/StatusPill";
import { formatRupiah, formatTanggal, daysUntil } from "@/lib/format";
import { CreditCard, Megaphone, FileText, CalendarDays, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PenghuniDashboard() {
  const { tenants, rooms, bills, complaints, currentPenghuniId } = useApp();
  const me = tenants.find((t) => t.id === currentPenghuniId)!;
  const room = rooms.find((r) => r.id === me.roomId);
  const myBills = bills.filter((b) => b.tenantId === me.id).sort((a, b) => b.tahun * 12 + b.bulan - (a.tahun * 12 + a.bulan));
  const myComplaints = complaints.filter((c) => c.tenantId === me.id);
  const now = new Date();
  const currentBill = myBills.find((b) => b.bulan === now.getMonth() && b.tahun === now.getFullYear()) ?? myBills[0];
  const sisaHari = daysUntil(me.tanggalBerakhir);

  return (
    <div className="space-y-6">
      <PageHeader title={`Halo, ${me.nama.split(" ")[0]} 👋`} subtitle="Ringkasan kos dan tagihan Anda" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Kamar</div>
                <div className="text-2xl font-bold">{room?.nomor ?? "-"}</div>
                <div className="text-xs text-muted-foreground">{room?.tipe} • Lantai {room?.lantai}</div>
              </div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Masuk</span><span className="font-medium">{formatTanggal(me.tanggalMasuk)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Berakhir</span><span className="font-medium">{formatTanggal(me.tanggalBerakhir)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Sisa Kontrak</span><span className="font-semibold text-primary">{sisaHari} hari</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-gradient-to-br from-primary to-[oklch(0.27_0.05_254)] text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider opacity-80">Tagihan Bulan Ini</div>
                <div className="mt-1 text-3xl font-bold">{currentBill ? formatRupiah(currentBill.total) : "-"}</div>
                {currentBill && (
                  <div className="mt-2 text-sm opacity-90">
                    Jatuh tempo: {formatTanggal(currentBill.jatuhTempo)}
                  </div>
                )}
              </div>
              {currentBill && <BillStatusPill status={currentBill.status} />}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button asChild variant="secondary" className="bg-white/15 text-primary-foreground hover:bg-white/25 border-0">
                <Link to="/saya/tagihan"><CreditCard className="h-4 w-4 mr-1" />Bayar</Link>
              </Button>
              <Button asChild variant="secondary" className="bg-white/15 text-primary-foreground hover:bg-white/25 border-0">
                <Link to="/saya/pengaduan"><Megaphone className="h-4 w-4 mr-1" />Pengaduan</Link>
              </Button>
              <Button asChild variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90 border-0">
                <Link to="/saya/profil"><FileText className="h-4 w-4 mr-1" />Kontrak</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" />Riwayat Pembayaran</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Bulan</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Tanggal Bayar</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {myBills.slice(0, 6).map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][b.bulan]} {b.tahun}</TableCell>
                  <TableCell>{formatRupiah(b.total)}</TableCell>
                  <TableCell><BillStatusPill status={b.status} /></TableCell>
                  <TableCell>{b.tanggalBayar ? formatTanggal(b.tanggalBayar) : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Pengaduan Aktif</CardTitle></CardHeader>
        <CardContent>
          {myComplaints.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Belum ada pengaduan.</div>
          ) : (
            <div className="space-y-3">
              {myComplaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="font-medium">{c.judul}</div>
                    <div className="text-xs text-muted-foreground">{c.kategori} • {formatTanggal(c.tanggalLapor)}</div>
                  </div>
                  <ComplaintStatusPill status={c.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
