import { useApp } from "@/lib/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { BillStatusPill, ComplaintStatusPill } from "@/components/StatusPill";
import { formatRupiah, formatTanggal, formatBulanTahun } from "@/lib/format";
import { DoorOpen, DoorClosed, Users, Wallet, Wrench, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: "primary" | "accent" | "success" | "danger" }) {
  const accentClass = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/20 text-accent-foreground",
    success: "bg-success/15 text-success",
    danger: "bg-destructive/15 text-destructive",
  }[accent ?? "primary"];
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1 truncate text-2xl font-bold text-foreground">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OwnerDashboard() {
  const { rooms, tenants, bills, complaints } = useApp();
  const total = rooms.length;
  const terisi = rooms.filter((r) => r.status === "Terisi").length;
  const kosong = rooms.filter((r) => r.status === "Tersedia").length;
  const perawatan = rooms.filter((r) => r.status === "Dalam Perawatan").length;

  const belumLunasTotal = bills
    .filter((b) => b.status !== "Lunas")
    .reduce((s, b) => s + b.total, 0);

  const pengaduanAktif = complaints.filter((c) => c.status === "Baru" || c.status === "Diproses").length;

  const now = new Date();
  const pendapatanBulanIni = bills
    .filter((b) => b.status === "Lunas" && b.bulan === now.getMonth() && b.tahun === now.getFullYear())
    .reduce((s, b) => s + b.total, 0);

  // Last 6 months income
  const incomeData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const total = bills
      .filter((b) => b.status === "Lunas" && b.bulan === d.getMonth() && b.tahun === d.getFullYear())
      .reduce((s, b) => s + b.total, 0);
    return { name: formatBulanTahun(d).split(" ")[0].slice(0, 3), pendapatan: total };
  });

  const occupancyData = [
    { name: "Terisi", value: terisi, color: "oklch(0.34 0.06 254)" },
    { name: "Kosong", value: kosong, color: "oklch(0.65 0.17 150)" },
    { name: "Perawatan", value: perawatan, color: "oklch(0.78 0.16 75)" },
  ];

  const recentBills = [...bills].sort((a, b) => b.tahun * 12 + b.bulan - (a.tahun * 12 + a.bulan)).slice(0, 5);
  const recentComplaints = [...complaints].sort((a, b) => +new Date(b.tanggalLapor) - +new Date(a.tanggalLapor)).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle={`Ringkasan operasional kos — ${formatTanggal(new Date())}`} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={DoorClosed} label="Total Kamar" value={String(total)} accent="primary" />
        <StatCard icon={Users} label="Kamar Terisi" value={String(terisi)} accent="primary" />
        <StatCard icon={DoorOpen} label="Kamar Kosong" value={String(kosong)} accent="success" />
        <StatCard icon={Wallet} label="Belum Lunas" value={formatRupiah(belumLunasTotal)} accent="danger" />
        <StatCard icon={Wrench} label="Pengaduan Aktif" value={String(pengaduanAktif)} accent="accent" />
        <StatCard icon={TrendingUp} label="Pendapatan Bln Ini" value={formatRupiah(pendapatanBulanIni)} accent="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Pendapatan 6 Bulan Terakhir</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 250)" />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.03 250)" tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`} />
                <Tooltip formatter={(v: number) => formatRupiah(v)} contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.01 250)" }} />
                <Bar dataKey="pendapatan" fill="oklch(0.34 0.06 254)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Status Kamar</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={occupancyData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {occupancyData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Pembayaran Terbaru</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Penghuni</TableHead>
                  <TableHead>Kamar</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBills.map((b) => {
                  const t = tenants.find((x) => x.id === b.tenantId);
                  const r = rooms.find((x) => x.id === t?.roomId);
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{t?.nama ?? "-"}</TableCell>
                      <TableCell>{r?.nomor ?? "-"}</TableCell>
                      <TableCell>{formatRupiah(b.total)}</TableCell>
                      <TableCell><BillStatusPill status={b.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Pengaduan Terbaru</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Penghuni</TableHead>
                  <TableHead>Kamar</TableHead>
                  <TableHead>Masalah</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentComplaints.map((c) => {
                  const t = tenants.find((x) => x.id === c.tenantId);
                  const r = rooms.find((x) => x.id === t?.roomId);
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{t?.nama ?? "-"}</TableCell>
                      <TableCell>{r?.nomor ?? "-"}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{c.judul}</TableCell>
                      <TableCell><ComplaintStatusPill status={c.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
