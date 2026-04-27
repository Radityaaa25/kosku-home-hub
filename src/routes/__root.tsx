import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AppProvider } from "@/lib/app-context";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KosKu — Sistem Manajemen Kos" },
      { name: "description", content: "Kelola kos Anda dengan mudah dan efisien — kamar, penghuni, tagihan otomatis, dan pengaduan dalam satu sistem." },
      { name: "author", content: "KosKu" },
      { property: "og:title", content: "KosKu — Sistem Manajemen Kos" },
      { property: "og:description", content: "Kelola kos Anda dengan mudah dan efisien — kamar, penghuni, tagihan otomatis, dan pengaduan dalam satu sistem." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "KosKu — Sistem Manajemen Kos" },
      { name: "twitter:description", content: "Kelola kos Anda dengan mudah dan efisien — kamar, penghuni, tagihan otomatis, dan pengaduan dalam satu sistem." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/acd68828-76df-48cd-bcd2-d88dff7f3fc5/id-preview-80f1be6c--e3ed579d-08d9-4d1a-a47a-bbc05a299fec.lovable.app-1777292210821.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/acd68828-76df-48cd-bcd2-d88dff7f3fc5/id-preview-80f1be6c--e3ed579d-08d9-4d1a-a47a-bbc05a299fec.lovable.app-1777292210821.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AppProvider>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
    </AppProvider>
  );
}
