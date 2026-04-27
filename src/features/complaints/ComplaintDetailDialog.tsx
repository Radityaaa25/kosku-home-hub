import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Complaint } from "@/lib/types";
import { useApp } from "@/lib/app-context";
import { ComplaintStatusPill, PriorityPill } from "@/components/StatusPill";
import { formatTanggal } from "@/lib/format";
import { CheckCircle2, Circle } from "lucide-react";

export function ComplaintDetailDialog({
  complaint, open, onOpenChange,
}: { complaint: Complaint | null; open: boolean; onOpenChange: (b: boolean) => void }) {
  const { tenants, rooms } = useApp();
  if (!complaint) return null;
  const t = tenants.find((x) => x.id === complaint.tenantId);
  const r = rooms.find((x) => x.id === t?.roomId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{complaint.judul}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ComplaintStatusPill status={complaint.status} />
            <PriorityPill p={complaint.prioritas} />
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{complaint.kategori}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><div className="text-xs text-muted-foreground">Penghuni</div><div className="font-medium">{t?.nama ?? "-"}</div></div>
            <div><div className="text-xs text-muted-foreground">Kamar</div><div className="font-medium">{r?.nomor ?? "-"}</div></div>
            <div><div className="text-xs text-muted-foreground">Tanggal Lapor</div><div className="font-medium">{formatTanggal(complaint.tanggalLapor)}</div></div>
            <div><div className="text-xs text-muted-foreground">Tanggal Selesai</div><div className="font-medium">{complaint.tanggalSelesai ? formatTanggal(complaint.tanggalSelesai) : "-"}</div></div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Deskripsi</div>
            <div className="rounded-lg bg-muted p-3 text-sm">{complaint.deskripsi}</div>
          </div>
          {complaint.catatan && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Catatan Pengelola</div>
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm">{complaint.catatan}</div>
            </div>
          )}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Timeline</div>
            <div className="space-y-2">
              {complaint.timeline.map((e, i) => (
                <div key={i} className="flex items-start gap-2">
                  {i === complaint.timeline.length - 1 && complaint.status === "Selesai"
                    ? <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    : <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />}
                  <div className="flex-1">
                    <div className="text-sm">{e.label}</div>
                    <div className="text-xs text-muted-foreground">{formatTanggal(e.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
