import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-context";
import { BillStatusPill } from "@/components/StatusPill";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/saya/tagihan")({
  head: () => ({
    meta: [
      { title: "Tagihan Saya — KosKu" },
      { name: "description", content: "Lihat dan bayar tagihan bulanan kos Anda." },
    ],
  }),
  component: SayaTagihan,
});

const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function SayaTagihan() {
  const { bills, currentPenghuniId } = useApp();
  const my = bills.filter((b) => b.tenantId === currentPenghuniId).sort((a, b) => b.tahun * 12 + b.bulan - (a.tahun * 12 + a.bulan));
  const now = new Date();
  const current = my.find((b) => b.bulan === now.getMonth() && b.tahun === now.getFullYear()) ?? my[0];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Tagihan Saya" subtitle="Detail dan riwayat pembayaran kos Anda" />
        {current && (
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Tagihan Bulan Ini</div>
                  <div className="mt-1 text-2xl font-bold">{BULAN[current.bulan]} {current.tahun}</div>
                  <div className="mt-1 text-sm text-muted-foreground">Jatuh tempo: {formatTanggal(current.jatuhTempo)}</div>
                </div>
                <BillStatusPill status={current.status} />
              </div>
              <div className="mt-5 grid gap-3 rounded-lg bg-muted/50 p-4 text-sm sm:grid-cols-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Sewa Kamar</span><span className="font-medium">{formatRupiah(current.sewa)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Listrik</span><span className="font-medium">{formatRupiah(current.listrik)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Air</span><span className="font-medium">{formatRupiah(current.air)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tambahan</span><span className="font-medium">{formatRupiah(current.tambahan)}</span></div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-primary p-4 text-primary-foreground">
                <span className="text-sm uppercase opacity-80">Total</span>
                <span className="text-2xl font-bold">{formatRupiah(current.total)}</span>
              </div>
              {current.status !== "Lunas" && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => toast.success("Bukti bayar diupload (demo)")}><Upload className="h-4 w-4 mr-1" />Upload Bukti Bayar</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Periode</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Tanggal Bayar</TableHead><TableHead>Metode</TableHead></TableRow></TableHeader>
              <TableBody>
                {my.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{BULAN[b.bulan]} {b.tahun}</TableCell>
                    <TableCell>{formatRupiah(b.total)}</TableCell>
                    <TableCell><BillStatusPill status={b.status} /></TableCell>
                    <TableCell>{b.tanggalBayar ? formatTanggal(b.tanggalBayar) : "-"}</TableCell>
                    <TableCell>{b.metode ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
