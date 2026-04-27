import { useApp } from "@/lib/app-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export function RoleSwitcher() {
  const { role, setRole } = useApp();
  const Icon = ICONS[role];
  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <Select value={role} onValueChange={(v) => setRole(v as Role)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(LABELS) as Role[]).map((r) => {
            const I = ICONS[r];
            return (
              <SelectItem key={r} value={r}>
                <div className="flex items-center gap-2">
                  <I className="h-4 w-4" />
                  <span>{LABELS[r]}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
