export type Role = "owner" | "pengelola" | "penghuni";

export type RoomType = "Standard" | "Deluxe" | "VIP";
export type RoomStatus = "Tersedia" | "Terisi" | "Dalam Perawatan";

export interface Room {
  id: string;
  nomor: string;
  tipe: RoomType;
  lantai: number;
  harga: number;
  luas: number;
  fasilitas: string[];
  status: RoomStatus;
  deskripsi: string;
  foto?: string;
}

export interface Tenant {
  id: string;
  nama: string;
  nik: string;
  hp: string;
  email: string;
  alamat: string;
  roomId: string | null;
  tanggalMasuk: string;
  durasiBulan: number;
  tanggalBerakhir: string;
  deposit: number;
  catatan: string;
  status: "Aktif" | "Tidak Aktif";
  foto?: string;
}

export type BillStatus = "Lunas" | "Belum Lunas" | "Terlambat";

export interface Bill {
  id: string;
  tenantId: string;
  bulan: number; // 0-11
  tahun: number;
  sewa: number;
  listrik: number;
  air: number;
  tambahan: number;
  ketTambahan: string;
  total: number;
  jatuhTempo: string;
  status: BillStatus;
  tanggalBayar?: string;
  metode?: "Transfer Bank" | "Cash" | "QRIS";
}

export type ComplaintStatus = "Baru" | "Diproses" | "Selesai" | "Ditolak";
export type Priority = "Tinggi" | "Sedang" | "Rendah";
export type ComplaintCategory =
  | "Fasilitas Rusak"
  | "Kebersihan"
  | "Keamanan"
  | "Kebisingan"
  | "Listrik & Air"
  | "Lainnya";

export interface ComplaintEvent {
  date: string;
  label: string;
}

export interface Complaint {
  id: string;
  tenantId: string;
  kategori: ComplaintCategory;
  prioritas: Priority;
  judul: string;
  deskripsi: string;
  status: ComplaintStatus;
  tanggalLapor: string;
  tanggalSelesai?: string;
  targetSelesai?: string;
  catatan: string;
  timeline: ComplaintEvent[];
}
