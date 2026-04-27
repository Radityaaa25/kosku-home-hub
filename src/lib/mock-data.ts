import type { Room, Tenant, Bill, Complaint } from "./types";

export const initialRooms: Room[] = [
  { id: "r1", nomor: "K101", tipe: "Standard", lantai: 1, harga: 800000, luas: 9, fasilitas: ["Lemari", "Kasur", "Meja Belajar"], status: "Tersedia", deskripsi: "Kamar standar nyaman, cocok untuk mahasiswa." },
  { id: "r2", nomor: "K102", tipe: "Standard", lantai: 1, harga: 800000, luas: 9, fasilitas: ["Lemari", "Kasur", "Meja Belajar", "WiFi"], status: "Tersedia", deskripsi: "Kamar standar dengan WiFi." },
  { id: "r3", nomor: "K103", tipe: "Standard", lantai: 1, harga: 800000, luas: 9, fasilitas: ["Lemari", "Kasur"], status: "Tersedia", deskripsi: "Kamar standar ekonomis." },
  { id: "r4", nomor: "K201", tipe: "Deluxe", lantai: 2, harga: 1200000, luas: 12, fasilitas: ["AC", "WiFi", "Kamar Mandi Dalam", "Lemari", "Kasur", "Meja Belajar"], status: "Terisi", deskripsi: "Kamar deluxe dengan AC dan kamar mandi dalam." },
  { id: "r5", nomor: "K202", tipe: "Deluxe", lantai: 2, harga: 1200000, luas: 12, fasilitas: ["AC", "WiFi", "Kamar Mandi Dalam", "Lemari", "Kasur"], status: "Terisi", deskripsi: "Kamar deluxe lantai 2." },
  { id: "r6", nomor: "K203", tipe: "Deluxe", lantai: 2, harga: 1200000, luas: 12, fasilitas: ["AC", "WiFi", "Kamar Mandi Dalam", "Kasur", "Meja Belajar"], status: "Terisi", deskripsi: "Kamar deluxe terang dan luas." },
  { id: "r7", nomor: "K204", tipe: "Deluxe", lantai: 2, harga: 1200000, luas: 12, fasilitas: ["AC", "WiFi", "Kamar Mandi Dalam", "Lemari", "Kasur"], status: "Terisi", deskripsi: "Kamar deluxe pojok." },
  { id: "r8", nomor: "K301", tipe: "VIP", lantai: 3, harga: 1800000, luas: 16, fasilitas: ["AC", "WiFi", "Kamar Mandi Dalam", "Lemari", "Kasur", "Meja Belajar", "Water Heater"], status: "Terisi", deskripsi: "Kamar VIP lengkap dengan water heater." },
  { id: "r9", nomor: "K302", tipe: "VIP", lantai: 3, harga: 1800000, luas: 16, fasilitas: ["AC", "WiFi", "Kamar Mandi Dalam", "Lemari", "Kasur", "Water Heater"], status: "Terisi", deskripsi: "Kamar VIP dengan view kota." },
  { id: "r10", nomor: "K303", tipe: "VIP", lantai: 3, harga: 1800000, luas: 16, fasilitas: ["AC", "WiFi", "Kamar Mandi Dalam", "Water Heater"], status: "Dalam Perawatan", deskripsi: "Sedang dalam renovasi cat & AC." },
];

function addMonths(date: Date, m: number): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + m);
  return d.toISOString();
}

export const initialTenants: Tenant[] = [
  { id: "t1", nama: "Budi Santoso", nik: "3271012345678901", hp: "081234567801", email: "budi@mail.com", alamat: "Jl. Merdeka No. 12, Bandung", roomId: "r4", tanggalMasuk: "2024-01-01", durasiBulan: 12, tanggalBerakhir: addMonths(new Date("2024-01-01"), 12), deposit: 1200000, catatan: "Mahasiswa", status: "Aktif" },
  { id: "t2", nama: "Siti Rahayu", nik: "3271012345678902", hp: "081234567802", email: "siti@mail.com", alamat: "Jl. Sudirman No. 5, Jakarta", roomId: "r5", tanggalMasuk: "2024-02-15", durasiBulan: 12, tanggalBerakhir: addMonths(new Date("2024-02-15"), 12), deposit: 1200000, catatan: "Karyawan swasta", status: "Aktif" },
  { id: "t3", nama: "Ahmad Fauzi", nik: "3271012345678903", hp: "081234567803", email: "ahmad@mail.com", alamat: "Jl. Ahmad Yani No. 23, Surabaya", roomId: "r6", tanggalMasuk: "2024-03-01", durasiBulan: 6, tanggalBerakhir: addMonths(new Date("2024-03-01"), 6), deposit: 1200000, catatan: "", status: "Aktif" },
  { id: "t4", nama: "Dewi Lestari", nik: "3271012345678904", hp: "081234567804", email: "dewi@mail.com", alamat: "Jl. Diponegoro No. 8, Yogyakarta", roomId: "r7", tanggalMasuk: "2024-03-20", durasiBulan: 12, tanggalBerakhir: addMonths(new Date("2024-03-20"), 12), deposit: 1200000, catatan: "Pekerja remote", status: "Aktif" },
  { id: "t5", nama: "Reza Pratama", nik: "3271012345678905", hp: "081234567805", email: "reza@mail.com", alamat: "Jl. Pahlawan No. 17, Semarang", roomId: "r8", tanggalMasuk: "2024-04-01", durasiBulan: 12, tanggalBerakhir: addMonths(new Date("2024-04-01"), 12), deposit: 1800000, catatan: "", status: "Aktif" },
  { id: "t6", nama: "Nurul Hidayah", nik: "3271012345678906", hp: "081234567806", email: "nurul@mail.com", alamat: "Jl. Gatot Subroto No. 3, Medan", roomId: "r9", tanggalMasuk: "2024-04-10", durasiBulan: 6, tanggalBerakhir: addMonths(new Date("2024-04-10"), 6), deposit: 1800000, catatan: "Karyawan BUMN", status: "Aktif" },
  { id: "t7", nama: "Eko Widodo", nik: "3271012345678907", hp: "081234567807", email: "eko@mail.com", alamat: "Jl. Veteran No. 9, Solo", roomId: null, tanggalMasuk: "2024-05-01", durasiBulan: 12, tanggalBerakhir: addMonths(new Date("2024-05-01"), 12), deposit: 0, catatan: "Waiting list untuk kamar VIP", status: "Tidak Aktif" },
];

// Generate bills: last 3 months for active tenants
function genBills(): Bill[] {
  const bills: Bill[] = [];
  const now = new Date();
  const tenants = initialTenants.filter((t) => t.status === "Aktif" && t.roomId);
  let id = 1;
  for (const t of tenants) {
    const room = initialRooms.find((r) => r.id === t.roomId)!;
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const listrik = 80000 + Math.floor(Math.random() * 60000);
      const air = 30000 + Math.floor(Math.random() * 20000);
      const total = room.harga + listrik + air;
      let status: Bill["status"] = "Lunas";
      if (i === 0) status = Math.random() > 0.5 ? "Belum Lunas" : "Lunas";
      else if (i === 1 && Math.random() > 0.7) status = "Terlambat";
      bills.push({
        id: `b${id++}`,
        tenantId: t.id,
        bulan: d.getMonth(),
        tahun: d.getFullYear(),
        sewa: room.harga,
        listrik,
        air,
        tambahan: 0,
        ketTambahan: "",
        total,
        jatuhTempo: new Date(d.getFullYear(), d.getMonth(), 10).toISOString(),
        status,
        tanggalBayar: status === "Lunas" ? new Date(d.getFullYear(), d.getMonth(), 5 + Math.floor(Math.random() * 10)).toISOString() : undefined,
        metode: status === "Lunas" ? "Transfer Bank" : undefined,
      });
    }
  }
  return bills;
}

export const initialBills: Bill[] = genBills();

export const initialComplaints: Complaint[] = [
  { id: "c1", tenantId: "t1", kategori: "Fasilitas Rusak", prioritas: "Sedang", judul: "AC tidak dingin", deskripsi: "AC kamar K201 sudah seminggu tidak dingin meski sudah dibersihkan.", status: "Selesai", tanggalLapor: "2024-09-10", tanggalSelesai: "2024-09-12", catatan: "Sudah diperbaiki teknisi, freon ditambah.", timeline: [
    { date: "2024-09-10", label: "Laporan masuk" },
    { date: "2024-09-11", label: "Diproses oleh pengelola" },
    { date: "2024-09-12", label: "Selesai diperbaiki" },
  ] },
  { id: "c2", tenantId: "t2", kategori: "Listrik & Air", prioritas: "Sedang", judul: "WiFi sangat lemot", deskripsi: "Koneksi WiFi di lantai 2 sangat lambat sejak 3 hari lalu.", status: "Diproses", tanggalLapor: "2024-10-18", catatan: "Sedang dicek oleh provider.", timeline: [
    { date: "2024-10-18", label: "Laporan masuk" },
    { date: "2024-10-19", label: "Tiket dibuat ke ISP" },
  ] },
  { id: "c3", tenantId: "t3", kategori: "Fasilitas Rusak", prioritas: "Tinggi", judul: "Kran kamar mandi bocor", deskripsi: "Kran wastafel bocor cukup deras sejak pagi, air menggenang.", status: "Baru", tanggalLapor: new Date().toISOString(), catatan: "", timeline: [
    { date: new Date().toISOString(), label: "Laporan masuk" },
  ] },
  { id: "c4", tenantId: "t4", kategori: "Listrik & Air", prioritas: "Rendah", judul: "Lampu kamar mati", deskripsi: "Lampu utama kamar mati, perlu diganti.", status: "Selesai", tanggalLapor: "2024-09-25", tanggalSelesai: "2024-09-26", catatan: "Lampu LED diganti baru.", timeline: [
    { date: "2024-09-25", label: "Laporan masuk" },
    { date: "2024-09-26", label: "Selesai diganti" },
  ] },
  { id: "c5", tenantId: "t6", kategori: "Fasilitas Rusak", prioritas: "Sedang", judul: "Pintu kamar macet", deskripsi: "Engsel pintu kendor, sulit dibuka tutup.", status: "Diproses", tanggalLapor: "2024-10-20", catatan: "Tukang kayu dijadwalkan besok.", timeline: [
    { date: "2024-10-20", label: "Laporan masuk" },
    { date: "2024-10-21", label: "Diproses" },
  ] },
];

// Demo logged-in penghuni
export const DEMO_PENGHUNI_ID = "t1";
