import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — KosKu" },
      { name: "description", content: "Masuk ke sistem manajemen kos KosKu." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { setRole } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@kosku.id");
  const [password, setPassword] = useState("demo1234");

  // Demo credential map — in a real app, role is resolved server-side from
  // the authenticated user, never selected by the client.
  const DEMO_USERS: Record<string, { password: string; role: Role; label: string }> = {
    "admin@kosku.id": { password: "demo1234", role: "owner", label: "Owner" },
    "pengelola@kosku.id": { password: "demo1234", role: "pengelola", label: "Pengelola" },
    "penghuni@kosku.id": { password: "demo1234", role: "penghuni", label: "Penghuni" },
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan password wajib diisi");
      return;
    }
    const user = DEMO_USERS[email.trim().toLowerCase()];
    if (!user || user.password !== password) {
      toast.error("Email atau password salah");
      return;
    }
    setRole(user.role);
    toast.success(`Berhasil masuk sebagai ${user.label}`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary to-[oklch(0.27_0.05_254)] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.78_0.16_75/0.15),transparent_50%)]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center text-primary-foreground">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/30">
            <Home className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">KosKu</h1>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Kelola kos Anda dengan mudah dan efisien
          </p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="nama@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="••••••••" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Masuk sebagai</Label>
                <Select value={role} onValueChange={(v) => setRoleLocal(v as Role)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="pengelola">Pengelola</SelectItem>
                    <SelectItem value="penghuni">Penghuni</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
                Masuk
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/50 p-3 text-xs text-muted-foreground">
              <div className="font-semibold text-foreground">Demo Credentials</div>
              <div className="mt-1">Email: <span className="font-mono">admin@kosku.id</span></div>
              <div>Password: <span className="font-mono">demo1234</span></div>
              <div className="mt-1 text-[11px]">Pilih peran apa pun untuk demo — tidak ada otentikasi nyata.</div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-primary-foreground/60">
          © 2024 KosKu. Sistem manajemen indekos modern.
        </p>
      </div>
    </div>
  );
}
