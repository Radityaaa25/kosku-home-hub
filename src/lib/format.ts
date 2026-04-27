export function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function formatTanggal(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${date.getDate()} ${BULAN[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatBulanTahun(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${BULAN[date.getMonth()]} ${date.getFullYear()}`;
}

export function daysUntil(d: Date | string): number {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = date.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
