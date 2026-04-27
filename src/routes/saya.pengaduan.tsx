import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { ComplaintStatusPill, PriorityPill } from "@/components/StatusPill";
import { formatTanggal } from "@/lib/format";
import { Plus, Eye, Megaphone } from "lucide-react";
import { useState } from "react";
import { ComplaintFormDialog } from "@/features/complaints/ComplaintFormDialog";
import { ComplaintDetailDialog } from "@/features/complaints/ComplaintDetailDialog";
import { toast } from "sonner";
import type { Complaint } from "@/lib/types";

export const Route = createFileRoute("/saya/pengaduan")({
  head: () => ({
    meta: [
      { title: "Pengaduan Saya — KosKu" },
      { name: "description", content: "Buat pengaduan baru dan lacak status laporan Anda." },
    ],
  }),
  component: SayaPengaduan,
});

function SayaPengaduan() {
  const { complaints, addComplaint, currentPenghuniId } = useApp();
  const my = complaints.filter((c) => c.tenantId === currentPenghuniId).sort((a, b) => +new Date(b.tanggalLapor) - +new Date(a.tanggalLapor));
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Complaint | null>(null);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Pengaduan Saya" subtitle="Daftar dan status pengaduan Anda" action={
          <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" />Buat Pengaduan</Button>
        } />

        {my.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted"><Megaphone className="h-7 w-7 text-muted-foreground" /></div>
            <div className="font-medium">Belum ada pengaduan</div>
            <div className="text-sm text-muted-foreground">Klik "Buat Pengaduan" untuk melaporkan masalah</div>
          </CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {my.map((c) => (
              <Card key={c.id} className="transition hover:shadow-md">
                <CardContent className="flex items-start justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{c.judul}</span>
                      <PriorityPill p={c.prioritas} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{c.kategori} • {formatTanggal(c.tanggalLapor)}</div>
                    <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{c.deskripsi}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ComplaintStatusPill status={c.status} />
                    <Button size="sm" variant="ghost" onClick={() => setDetail(c)}><Eye className="h-3.5 w-3.5 mr-1" />Detail</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ComplaintFormDialog
        open={open}
        onOpenChange={setOpen}
        hideTenant
        forcedTenantId={currentPenghuniId}
        onSubmit={(data) => {
          addComplaint({
            ...data,
            tenantId: currentPenghuniId,
            status: "Baru",
            tanggalLapor: new Date().toISOString(),
            timeline: [{ date: new Date().toISOString(), label: "Laporan masuk" }],
          });
          toast.success("Pengaduan terkirim");
          setOpen(false);
        }}
      />

      <ComplaintDetailDialog complaint={detail} open={!!detail} onOpenChange={(o) => !o && setDetail(null)} />
    </AppLayout>
  );
}
