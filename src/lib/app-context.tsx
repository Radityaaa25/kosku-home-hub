import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Room, Tenant, Bill, Complaint, Role } from "./types";
import {
  initialRooms,
  initialTenants,
  initialBills,
  initialComplaints,
  DEMO_PENGHUNI_ID,
} from "./mock-data";

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  currentPenghuniId: string;

  rooms: Room[];
  addRoom: (r: Omit<Room, "id">) => void;
  updateRoom: (id: string, r: Partial<Room>) => void;
  deleteRoom: (id: string) => void;

  tenants: Tenant[];
  addTenant: (t: Omit<Tenant, "id">) => void;
  updateTenant: (id: string, t: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;

  bills: Bill[];
  addBill: (b: Omit<Bill, "id">) => void;
  updateBill: (id: string, b: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  generateMonthlyBills: () => number;

  complaints: Complaint[];
  addComplaint: (c: Omit<Complaint, "id">) => void;
  updateComplaint: (id: string, c: Partial<Complaint>) => void;
  deleteComplaint: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

let _id = 1000;
const nid = (p: string) => `${p}${++_id}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("owner");
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  const addRoom = useCallback((r: Omit<Room, "id">) => setRooms((p) => [...p, { ...r, id: nid("r") }]), []);
  const updateRoom = useCallback((id: string, r: Partial<Room>) => setRooms((p) => p.map((x) => (x.id === id ? { ...x, ...r } : x))), []);
  const deleteRoom = useCallback((id: string) => setRooms((p) => p.filter((x) => x.id !== id)), []);

  const addTenant = useCallback((t: Omit<Tenant, "id">) => setTenants((p) => [...p, { ...t, id: nid("t") }]), []);
  const updateTenant = useCallback((id: string, t: Partial<Tenant>) => setTenants((p) => p.map((x) => (x.id === id ? { ...x, ...t } : x))), []);
  const deleteTenant = useCallback((id: string) => setTenants((p) => p.filter((x) => x.id !== id)), []);

  const addBill = useCallback((b: Omit<Bill, "id">) => setBills((p) => [...p, { ...b, id: nid("b") }]), []);
  const updateBill = useCallback((id: string, b: Partial<Bill>) => setBills((p) => p.map((x) => (x.id === id ? { ...x, ...b } : x))), []);
  const deleteBill = useCallback((id: string) => setBills((p) => p.filter((x) => x.id !== id)), []);

  const generateMonthlyBills = useCallback(() => {
    const now = new Date();
    const bulan = now.getMonth();
    const tahun = now.getFullYear();
    let count = 0;
    setBills((prev) => {
      const next = [...prev];
      for (const t of tenants) {
        if (t.status !== "Aktif" || !t.roomId) continue;
        const exists = next.some((b) => b.tenantId === t.id && b.bulan === bulan && b.tahun === tahun);
        if (exists) continue;
        const room = rooms.find((r) => r.id === t.roomId);
        if (!room) continue;
        const listrik = 100000;
        const air = 35000;
        next.push({
          id: nid("b"),
          tenantId: t.id,
          bulan,
          tahun,
          sewa: room.harga,
          listrik,
          air,
          tambahan: 0,
          ketTambahan: "",
          total: room.harga + listrik + air,
          jatuhTempo: new Date(tahun, bulan, 10).toISOString(),
          status: "Belum Lunas",
        });
        count++;
      }
      return next;
    });
    return count;
  }, [tenants, rooms]);

  const addComplaint = useCallback((c: Omit<Complaint, "id">) => setComplaints((p) => [...p, { ...c, id: nid("c") }]), []);
  const updateComplaint = useCallback((id: string, c: Partial<Complaint>) => setComplaints((p) => p.map((x) => (x.id === id ? { ...x, ...c } : x))), []);
  const deleteComplaint = useCallback((id: string) => setComplaints((p) => p.filter((x) => x.id !== id)), []);

  return (
    <AppContext.Provider
      value={{
        role, setRole, currentPenghuniId: DEMO_PENGHUNI_ID,
        rooms, addRoom, updateRoom, deleteRoom,
        tenants, addTenant, updateTenant, deleteTenant,
        bills, addBill, updateBill, deleteBill, generateMonthlyBills,
        complaints, addComplaint, updateComplaint, deleteComplaint,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
