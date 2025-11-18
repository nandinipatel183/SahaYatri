// src/components/VolunteerDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import VolunteerNavbar from "./VolunteerNavbar";
import { Users, Package, MapPin, Trash2, Clock } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

/**
 * VolunteerDashboard.tsx
 * - Two new tabs: Lost Reports (Lost People + Lost Items) and Found Reports (Found People + Found Items)
 * - Keeps original features: Overview, Verify, Map, Stats
 *
 * NOTE: update API_BASE if your backend host/port differ.
 */

type PersonReport = {
  id: number;
  name?: string;
  approxAge?: string;
  gender?: string;
  lastSeenLocation?: string;
  lastSeenTime?: string;
  foundLocation?: string;
  foundTime?: string;
  reporterName?: string;
  reporterPhone?: string;
  contactPhone?: string;
  clothingDescription?: string;
  photoUrls?: string | null;
  voiceRecordingUrl?: string | null;
  // sometimes backend uses different field names - we'll try several in code
};

type ItemReport = {
  id: number;
  itemName?: string;
  category?: string;
  brand?: string;
  color?: string;
  uniqueFeatures?: string;
  lastSeenLocation?: string;
  foundLocation?: string;
  lastSeenTime?: string;
  foundTime?: string;
  contactPerson?: string;
  contactPhone?: string;
  photoPaths?: string | null;
  photoUrl?: string | null;
};

const API_BASE = "http://localhost:8080";

const VolunteerDashboard: React.FC = () => {
  const [tab, setTab] = useState<
    "overview" | "verify" | "lostReports" | "foundReports" | "map" | "stats"
  >("overview");

  // verify/unverified lists
  const [lostPeople, setLostPeople] = useState<PersonReport[]>([]);
  const [foundPeople, setFoundPeople] = useState<PersonReport[]>([]);
  const [lostItems, setLostItems] = useState<ItemReport[]>([]);
  const [foundItems, setFoundItems] = useState<ItemReport[]>([]);

  const [loading, setLoading] = useState(false);

  // sample statistics (replace with real data if backend provides)
  const [dailyStats] = useState([
    { day: "Mon", verified: 3 },
    { day: "Tue", verified: 5 },
    { day: "Wed", verified: 2 },
    { day: "Thu", verified: 6 },
    { day: "Fri", verified: 4 },
    { day: "Sat", verified: 7 },
    { day: "Sun", verified: 3 },
  ]);

  // helper fetch wrapper that returns json or throws
  const apiFetch = async (path: string, init: RequestInit = {}) => {
    const headers = {
      ...(init.headers || {}),
      Accept: "application/json",
    };
    const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `${res.status} ${res.statusText}`);
    }
    // allow empty responses
    if (res.status === 204) return null;
    return res.json();
  };

  // fetch both lost/found people + items
  async function fetchAllReports() {
    setLoading(true);
    try {
      const [lp, fp, li, fi] = await Promise.all([
        apiFetch("/api/reports/lost").catch(() => []),
        apiFetch("/api/reports/found").catch(() => []),
        apiFetch("/api/items/lost").catch(() => []),
        apiFetch("/api/items/found").catch(() => []),
      ]);

      // normalize returned objects to expected shapes
      setLostPeople(Array.isArray(lp) ? lp : []);
      setFoundPeople(Array.isArray(fp) ? fp : []);
      setLostItems(Array.isArray(li) ? li : []);
      setFoundItems(Array.isArray(fi) ? fi : []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- VERIFY ACTIONS ----------
  async function verifyLostPerson(id: number) {
    try {
      await apiFetch(`/api/reports/verify/${id}`, { method: "POST" });
      setLostPeople((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      alert("Verify failed: " + String(err));
    }
  }

  async function verifyFoundPerson(id: number) {
    try {
      await apiFetch(`/api/reports/verify/${id}`, { method: "POST" });
      setFoundPeople((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      alert("Verify failed: " + String(err));
    }
  }

  async function verifyLostItem(id: number) {
    try {
      await apiFetch(`/api/items/verify/${id}`, { method: "POST" });
      setLostItems((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      alert("Verify failed: " + String(err));
    }
  }

  async function verifyFoundItem(id: number) {
    try {
      await apiFetch(`/api/items/verify/${id}`, { method: "POST" });
      setFoundItems((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      alert("Verify failed: " + String(err));
    }
  }

  // ---------- DELETE ACTIONS ----------
  async function deleteLostPerson(id: number) {
    if (!confirm("Delete this lost person report?")) return;
    try {
      await apiFetch(`/api/reports/lost/${id}`, { method: "DELETE" });
      setLostPeople((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      alert("Delete failed: " + String(err));
    }
  }

  async function deleteFoundPerson(id: number) {
    if (!confirm("Delete this found person report?")) return;
    try {
      await apiFetch(`/api/reports/found/${id}`, { method: "DELETE" });
      setFoundPeople((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      alert("Delete failed: " + String(err));
    }
  }

  async function deleteLostItem(id: number) {
    if (!confirm("Delete this lost item report?")) return;
    try {
      await apiFetch(`/api/items/lost/${id}`, { method: "DELETE" });
      setLostItems((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      alert("Delete failed: " + String(err));
    }
  }

  async function deleteFoundItem(id: number) {
    if (!confirm("Delete this found item report?")) return;
    try {
      await apiFetch(`/api/items/found/${id}`, { method: "DELETE" });
      setFoundItems((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      alert("Delete failed: " + String(err));
    }
  }

  // small helper to pick image field (supports photoUrls, photoUrl, photoPaths)
  const pickImage = (r: any) =>
    r?.photoUrls || r?.photoUrl || r?.photoPaths || r?.image || null;

  // derived counts
  const totalPendingPeople = (lostPeople?.length || 0) + (foundPeople?.length || 0);
  const totalPendingItems = (lostItems?.length || 0) + (foundItems?.length || 0);

  // table row components
  const PersonRow: React.FC<{
    r: PersonReport;
    isLost?: boolean;
    onVerify?: (id: number) => void;
    onDelete?: (id: number) => void;
  }> = ({ r, isLost, onVerify, onDelete }) => (
    <tr className="border-b">
      <td className="py-3 px-2 w-20">
        <img
          src={pickImage(r) || "/placeholder-person.png"}
          alt="preview"
          className="w-16 h-12 object-cover rounded"
        />
      </td>
      <td className="py-3 px-2">{r.name || r.reporterName || "—"}</td>
      <td className="py-3 px-2">{r.lastSeenLocation || r.foundLocation || "—"}</td>
      <td className="py-3 px-2 text-sm text-gray-600">
        {r.lastSeenTime || r.foundTime || "—"}
      </td>
      <td className="py-3 px-2">{r.contactPhone || r.reporterPhone || "—"}</td>
      <td className="py-3 px-2">
        <div className="flex gap-2">
          {onVerify && (
            <button
              onClick={() => onVerify(r.id)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Verify
            </button>
          )}
          <button
            onClick={() => onDelete && onDelete(r.id)}
            className="bg-red-50 text-red-700 px-3 py-1 rounded text-sm"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </td>
    </tr>
  );

  const ItemRow: React.FC<{
    r: ItemReport;
    isLost?: boolean;
    onVerify?: (id: number) => void;
    onDelete?: (id: number) => void;
  }> = ({ r, isLost, onVerify, onDelete }) => (
    <tr className="border-b">
      <td className="py-3 px-2 w-20">
        <img
          src={pickImage(r) || "/placeholder-item.png"}
          alt="preview"
          className="w-16 h-12 object-cover rounded"
        />
      </td>
      <td className="py-3 px-2">{r.itemName || r.category || "—"}</td>
      <td className="py-3 px-2">{r.lastSeenLocation || r.foundLocation || "—"}</td>
      <td className="py-3 px-2 text-sm text-gray-600">
        {r.lastSeenTime || r.foundTime || "—"}
      </td>
      <td className="py-3 px-2">{r.contactPhone || r.contactPerson || "—"}</td>
      <td className="py-3 px-2">
        <div className="flex gap-2">
          {onVerify && (
            <button
              onClick={() => onVerify(r.id)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Verify
            </button>
          )}
          <button
            onClick={() => onDelete && onDelete(r.id)}
            className="bg-red-50 text-red-700 px-3 py-1 rounded text-sm"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <VolunteerNavbar tab={tab} setTab={setTab} />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
            <p className="text-gray-600">Overview & report management</p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="bg-white px-3 py-2 rounded shadow text-sm">Pending People: <strong>{totalPendingPeople}</strong></div>
            <div className="bg-white px-3 py-2 rounded shadow text-sm">Pending Items: <strong>{totalPendingItems}</strong></div>
          </div>
        </div>

        {/* TAB CONTENT */}
        {/* Overview */}
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm text-gray-500">Pending People</h4>
                    <div className="text-3xl font-bold">{totalPendingPeople}</div>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">People reported and awaiting action</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm text-gray-500">Pending Items</h4>
                    <div className="text-3xl font-bold">{totalPendingItems}</div>
                  </div>
                  <Package className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Items reported and awaiting action</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <h4 className="text-sm text-gray-500">Quick Stats</h4>
                <div className="mt-3">
                  <div className="text-sm text-gray-700">Today verifications <strong>3</strong></div>
                  <div className="text-sm text-gray-700">AI flagged matches <strong>5</strong></div>
                </div>
              </div>
            </div>

            {/* Trend chart */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Activity Trend</h3>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyStats}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="verified" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        

        {/* Lost Reports (two-column) */}
        {tab === "lostReports" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-4">Lost People</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Image</th>
                    <th>Name</th>
                    <th>Last Seen Location</th>
                    <th>Last Seen Time</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lostPeople.map((p) => (
                    <PersonRow key={`lostlist-${p.id}`} r={p} isLost onVerify={verifyLostPerson} onDelete={deleteLostPerson} />
                  ))}
                </tbody>
              </table>
              {lostPeople.length === 0 && <p className="text-gray-500 mt-3">No lost people found.</p>}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-4">Lost Items</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Image</th>
                    <th>Item Name</th>
                    <th>Lost Location</th>
                    <th>Time</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lostItems.map((i) => (
                    <ItemRow key={`lostitemslist-${i.id}`} r={i} isLost onVerify={verifyLostItem} onDelete={deleteLostItem} />
                  ))}
                </tbody>
              </table>
              {lostItems.length === 0 && <p className="text-gray-500 mt-3">No lost items found.</p>}
            </div>
          </div>
        )}

        {/* Found Reports (two-column) */}
        {tab === "foundReports" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-4">Found People</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Image</th>
                    <th>Name</th>
                    <th>Found Location</th>
                    <th>Found Time</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foundPeople.map((p) => (
                    <PersonRow key={`foundlist-${p.id}`} r={p} isLost={false} onVerify={verifyFoundPerson} onDelete={deleteFoundPerson} />
                  ))}
                </tbody>
              </table>
              {foundPeople.length === 0 && <p className="text-gray-500 mt-3">No found people found.</p>}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-4">Found Items</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Image</th>
                    <th>Item Name</th>
                    <th>Found Location</th>
                    <th>Time</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foundItems.map((i) => (
                    <ItemRow key={`founditemslist-${i.id}`} r={i} isLost={false} onVerify={verifyFoundItem} onDelete={deleteFoundItem} />
                  ))}
                </tbody>
              </table>
              {foundItems.length === 0 && <p className="text-gray-500 mt-3">No found items found.</p>}
            </div>
          </div>
        )}

        {/* Map */}
        {tab === "map" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Map View</h3>
            <div className="w-full h-96 bg-gray-100 rounded flex items-center justify-center">
              <MapPin className="w-10 h-10 text-gray-400" />
              <span className="ml-3 text-gray-500">Map placeholder — integrate your map provider here</span>
            </div>
          </div>
        )}

        {/* Stats */}
        {tab === "stats" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-4">Weekly Verifications</h3>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyStats}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="verified" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-4">Case Distribution</h3>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "People", value: totalPendingPeople },
                      { name: "Items", value: totalPendingItems },
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
