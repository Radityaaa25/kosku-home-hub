import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { AppLayout } from "@/components/AppLayout";
import { OwnerDashboard } from "@/features/dashboard/OwnerDashboard";
import { PenghuniDashboard } from "@/features/dashboard/PenghuniDashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — KosKu" },
      { name: "description", content: "Ringkasan operasional kos: kamar, penghuni, tagihan, dan pengaduan." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { role } = useApp();
  return (
    <AppLayout>
      {role === "penghuni" ? <PenghuniDashboard /> : <OwnerDashboard />}
    </AppLayout>
  );
}
