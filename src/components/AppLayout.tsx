import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, DoorClosed, Users, Wallet, Wrench, BarChart3, Settings,
  CreditCard, Megaphone, UserCircle, Home, Menu, X,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RoleSwitcher } from "./RoleSwitcher";

const ownerNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/kamar", label: "Manajemen Kamar", icon: DoorClosed },
  { to: "/penghuni", label: "Manajemen Penghuni", icon: Users },
  { to: "/tagihan", label: "Manajemen Tagihan", icon: Wallet },
  { to: "/pengaduan", label: "Manajemen Pengaduan", icon: Wrench },
  { to: "/laporan", label: "Laporan Keuangan", icon: BarChart3, ownerOnly: true },
  { to: "/pengaturan", label: "Pengaturan", icon: Settings, ownerOnly: true },
];

const penghuniNav = [
  { to: "/dashboard", label: "Dashboard Saya", icon: LayoutDashboard },
  { to: "/saya/tagihan", label: "Tagihan Saya", icon: CreditCard },
  { to: "/saya/pengaduan", label: "Pengaduan Saya", icon: Megaphone },
  { to: "/saya/profil", label: "Profil Saya", icon: UserCircle },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { role } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const items = role === "penghuni"
    ? penghuniNav
    : ownerNav.filter((i) => !i.ownerOnly || role === "owner");

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar text-sidebar-foreground transition-transform lg:relative lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold leading-tight">KosKu</div>
            <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Manajemen Kos</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent/50 p-3 text-xs text-sidebar-foreground/70">
            <div className="font-semibold text-sidebar-foreground">KosKu v1.0</div>
            <div className="mt-0.5">Sistem Manajemen Indekos</div>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/80 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="text-sm text-muted-foreground hidden sm:block">
              Selamat datang kembali 👋
            </div>
          </div>
          <RoleSwitcher />
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
