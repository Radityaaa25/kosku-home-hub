import { useApp } from "@/lib/app-context";
import { Crown, Shield, User } from "lucide-react";
import type { Role } from "@/lib/types";

const ICONS: Record<Role, typeof Crown> = {
  owner: Crown,
  pengelola: Shield,
  penghuni: User,
};

const LABELS: Record<Role, string> = {
  owner: "Owner",
  pengelola: "Pengelola",
  penghuni: "Penghuni",
};

/**
 * Read-only role badge. Role is determined at login and cannot be changed
 * from the UI to prevent trivial client-side privilege escalation.
 */
export function RoleSwitcher() {
  const { role } = useApp();
  const Icon = ICONS[role];
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="text-sm font-medium">{LABELS[role]}</span>
    </div>
  );
}
