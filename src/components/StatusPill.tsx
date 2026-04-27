import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "danger" | "info" | "default" | "accent";

const variants: Record<Variant, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning-foreground border-warning/40",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  default: "bg-muted text-muted-foreground border-border",
  accent: "bg-accent/20 text-accent-foreground border-accent/40",
};

export function StatusPill({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-success": variant === "success",
        "bg-warning": variant === "warning",
        "bg-destructive": variant === "danger",
        "bg-info": variant === "info",
        "bg-accent": variant === "accent",
        "bg-muted-foreground": variant === "default",
      })} />
      {children}
    </span>
  );
}

import type { BillStatus, ComplaintStatus, Priority, RoomStatus } from "@/lib/types";

export function RoomStatusPill({ status }: { status: RoomStatus }) {
  const v: Variant = status === "Tersedia" ? "success" : status === "Terisi" ? "info" : "warning";
  return <StatusPill variant={v}>{status}</StatusPill>;
}
export function BillStatusPill({ status }: { status: BillStatus }) {
  const v: Variant = status === "Lunas" ? "success" : status === "Terlambat" ? "danger" : "warning";
  return <StatusPill variant={v}>{status}</StatusPill>;
}
export function ComplaintStatusPill({ status }: { status: ComplaintStatus }) {
  const v: Variant = status === "Selesai" ? "success" : status === "Diproses" ? "warning" : status === "Ditolak" ? "danger" : "info";
  return <StatusPill variant={v}>{status}</StatusPill>;
}
export function PriorityPill({ p }: { p: Priority }) {
  const v: Variant = p === "Tinggi" ? "danger" : p === "Sedang" ? "warning" : "success";
  return <StatusPill variant={v}>{p}</StatusPill>;
}
