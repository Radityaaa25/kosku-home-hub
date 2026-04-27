import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-context";
import { formatRupiah, formatTanggal, formatBulanTahun } from "@/lib/format";
import { BillStatusPill } from "@/components/StatusPill";
import { Download, TrendingUp, AlertCircle, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/laporan")({
  head: () => ({
    meta: [
      { title: "Laporan Keuangan — KosKu" },
      { name: "description", content: "Ringkasan keuangan kos: pemasukan, tunggakan, dan grafik tren bulanan." },
    ],
  }),
  component: LaporanPage,
});

function LaporanPage() {
  const { bills, tenants } = useApp();
  const now = new Date();
  const [tahun, setTahun] = useState(String(now.getFullYear()));

  const tahunOpts = Array.from(new Set(bills.map((b) => b.tahun))).sort();
  if (!tahunOpts.includes(now.getFullYear())) tahunOpts.push(now.getFullYear());

  const filtered = useMemo(() => bills.filter((b) => String(b.tahun) === tahun), [bills, tahun]);
  const totalPemasukan = filtered.filter((b) => b.status === "Lunas").reduce((s, b) => s + b.total, 0);
  const totalBelumLunas = filtered.filter((b) => b.status !== "Lunas").reduce((s, b) => s + b.total, 0);
  const aktif = tenants.filter((t) => t.status === "Aktif").length;

  const monthly = Array.from({ length: 12 }).map((_, i) => ({
    name: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][i],
    pendapatan: filtered.filter((b) => b.bulan === i && b.status === "Lunas").reduce((s, b) => s + b.total, 0),
  }));

  const statusData = [
    { name: "Lunas", value: filtered.filter((b) => b.status === "Lunas").length, color: "oklch(0.65 0.17 150)" },
    { name: "Belum Lunas", value: filtered.filter((b) => b.status === "Belum Lunas").length, color: "oklch(0.78 0.16 75)" },
    { name: "Terlambat", value: filtered.filter((b) => b.status === "Terlambat").length, color: "oklch(0.6 0.22 27)" },
  ];

  const late = bills.filter((b) => b.status === "Terlambat");

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Laporan Keuangan" subtitle="Analisis pemasukan dan tunggakan" action={
          <div className="flex gap-2">
            <Select value={tahun} onValueChange={setTahun}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>{tahunOpts.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { /* mock */ }}><Download className="h-4 w-4 mr-1" />Export</Button>
          </div>
        } />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success"><TrendingUp className="h-5 w-5" /></div>
            <div><div className="text-xs uppercase text-muted-foreground">Total Pemasukan</div><div className="text-xl font-bold">{formatRupiah(totalPemasukan)}</div></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/15 text-destructive"><AlertCircle className="h-5 w-5" /></div>
            <div><div className="text-xs uppercase text-muted-foreground">Belum Lunas</div><div className="text-xl font-bold">{formatRupiah(totalBelumLunas)}</div></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Users className="h-5 w-5" /></div>
            <div><div className="text-xs uppercase text-muted-foreground">Penghuni Aktif</div><div className="text-xl font-bold">{aktif}</div></div>
          </CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Pemasukan Bulanan {tahun}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`} />
                  <Tooltip formatter={(v: number) => formatRupiah(v)} />
                  <Bar dataKey="pendapatan" fill="oklch(0.34 0.06 254)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Status Pembayaran</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}>
                    {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Pembayaran Terlambat</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Penghuni</TableHead><TableHead>Periode</TableHead><TableHead>Total</TableHead><TableHead>Jatuh Tempo</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {late.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">Tidak ada keterlambatan 🎉</TableCell></TableRow>
                ) : late.map((b) => {
                  const t = tenants.find((x) => x.id === b.tenantId);
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{t?.nama ?? "-"}</TableCell>
                      <TableCell>{formatBulanTahun(new Date(b.tahun, b.bulan, 1))}</TableCell>
                      <TableCell>{formatRupiah(b.total)}</TableCell>
                      <TableCell>{formatTanggal(b.jatuhTempo)}</TableCell>
                      <TableCell><BillStatusPill status={b.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
