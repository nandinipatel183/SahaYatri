// AdminDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { useAuth } from "../contexts/AuthContext";
import MatchFaces from "./MatchFaces";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Search, Trash2, UserCheck, Download, Bell } from "lucide-react";

/**
 * Fixed AdminDashboard.tsx
 * - Handles multiple /api/matches response shapes
 * - Robust apiFetch with Authorization header
 * - Overview, Users, Reports, Analytics, Matches
 *
 * Make sure localStorage contains sahayatri_token (JWT) or apiFetch will call unauthenticated endpoints.
 */

type RoleString = "ADMIN" | "VOLUNTEER" | "USER";

type UserRow = {
  id: number;
  name?: string;
  email: string;
  phone?: string;
  role: RoleString;
  approved: boolean;
  createdAt?: string | null;
};

type ReportRow = {
  id: number;
  title: string;
  location?: string;
  createdAt?: string | null;
  photoUrl?: string | null;
  type?: string;
};

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

const API_BASE = "http://localhost:8080";

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const token = localStorage.getItem("sahayatri_token") || "";

  const [tab, setTab] = useState<
    "overview" | "users" | "reports" | "analytics" | "matches" | "cctv"
  >("overview");

  // Users
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Reports & items
  const [lostPeople, setLostPeople] = useState<ReportRow[]>([]);
  const [foundPeople, setFoundPeople] = useState<ReportRow[]>([]);
  const [lostItems, setLostItems] = useState<ReportRow[]>([]);
  const [foundItems, setFoundItems] = useState<ReportRow[]>([]);
  const [matches, setMatches] = useState<any[]>([]);

  // Metrics & trend
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    volunteers: 0,
    pendingApprovals: 0,
    lostPersonCount: 0,
    foundPersonCount: 0,
    lostItemCount: 0,
    foundItemCount: 0,
    successfulMatches: 0,
  });

  const [trendData, setTrendData] = useState<
    { date: string; reports: number }[]
  >([]);
  const [notifications, setNotifications] = useState<
    { id: string; message: string; time: string }[]
  >([]);

  // ---------- Helper: centralized fetch ----------
  async function apiFetch(path: string, init: RequestInit = {}) {
    const headers: Record<string, string> = {
      ...((init.headers as Record<string, string>) || {}),
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    init.headers = headers;

    const res = await fetch(`${API_BASE}${path}`, init);
    if (!res.ok) {
      const text = await res
        .text()
        .catch(() => `${res.status} ${res.statusText}`);
      throw new Error(text || `HTTP ${res.status}`);
    }

    // If no content
    if (res.status === 204) return null;

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    } else {
      // fallback: return text
      return res.text();
    }
  }

  // ---------- Users ----------
  async function fetchUsers() {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const data = (await apiFetch("/api/admin/users")) as any[];
      const normalized: UserRow[] = Array.isArray(data)
        ? data.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: String(u.role || "USER").toUpperCase() as RoleString,
            approved: !!u.approved,
            createdAt: u.createdAt ?? null,
          }))
        : [];
      setUsers(normalized);

      // metrics update
      const volunteers = normalized.filter(
        (x) => x.role === "VOLUNTEER" && x.approved
      ).length;
      const pending = normalized.filter((x) => !x.approved).length;
      setMetrics((m) => ({
        ...m,
        totalUsers: normalized.length,
        volunteers,
        pendingApprovals: pending,
      }));
    } catch (err: any) {
      console.error("fetchUsers:", err);
      setUsersError(String(err.message || err));
    } finally {
      setUsersLoading(false);
    }
  }

  async function approveUser(id: number) {
    if (!confirm("Approve this user?")) return;
    try {
      await apiFetch(`/api/admin/approve/${id}`, { method: "PATCH" });
      pushNotification("User approved");
      fetchUsers();
    } catch (err) {
      alert("Approve failed: " + String(err));
    }
  }

  async function changeRole(userId: number, role: RoleString) {
    if (!confirm(`Set role to ${role}?`)) return;
    try {
      await apiFetch(`/api/admin/role/${userId}?role=${role}`, {
        method: "PATCH",
      });
      pushNotification("Role updated");
      fetchUsers();
    } catch (err) {
      alert("Change role failed: " + String(err));
    }
  }

  async function deleteUser(userId: number) {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await apiFetch(`/api/admin/user/${userId}`, { method: "DELETE" });
      pushNotification("User deleted");
      fetchUsers();
    } catch (err) {
      alert("Delete failed: " + String(err));
    }
  }

  // ---------- Reports & Matches ----------
  async function fetchReportsAndItems() {
    try {
      // fetch all in parallel, ignore faults individually
      const [lpR, fpR, liR, fiR, mtR] = await Promise.allSettled([
        apiFetch("/api/reports/lost"),
        apiFetch("/api/reports/found"),
        apiFetch("/api/items/lost"),
        apiFetch("/api/items/found"),
        apiFetch("/api/matches"), // this endpoint may return either array or object
      ]);

      const lp =
        lpR.status === "fulfilled" && Array.isArray(lpR.value) ? lpR.value : [];
      const fp =
        fpR.status === "fulfilled" && Array.isArray(fpR.value) ? fpR.value : [];
      const li =
        liR.status === "fulfilled" && Array.isArray(liR.value) ? liR.value : [];
      const fi =
        fiR.status === "fulfilled" && Array.isArray(fiR.value) ? fiR.value : [];

      // normalize reports into simple rows for UI
      const normalize = (arr: any[], type: string) =>
        (Array.isArray(arr) ? arr : []).map((r) => ({
          id: r.id,
          title: r.name || r.itemName || r.title || `#${r.id}`,
          location:
            r.lastSeenLocation || r.foundLocation || r.location || "Unknown",
          createdAt: r.lastSeenTime || r.foundTime || r.createdAt || null,
          photoUrl: r.photoUrls || r.photoUrl || null,
          type,
        }));

      const lpN = normalize(lp, "lost_person");
      const fpN = normalize(fp, "found_person");
      const liN = normalize(li, "lost_item");
      const fiN = normalize(fi, "found_item");

      setLostPeople(lpN);
      setFoundPeople(fpN);
      setLostItems(liN);
      setFoundItems(fiN);

      // Matches: `/api/matches` could be:
      //  - array of matches OR
      //  - object { peopleMatches: [], itemMatches: [] }
      let matchesArr: any[] = [];
      if (mtR.status === "fulfilled") {
        const mtVal = mtR.value;
        if (Array.isArray(mtVal)) {
          matchesArr = mtVal;
        } else if (mtVal && typeof mtVal === "object") {
          // if it has peopleMatches / itemMatches keys
          const ppl = Array.isArray(mtVal.peopleMatches)
            ? mtVal.peopleMatches
            : [];
          const itms = Array.isArray(mtVal.itemMatches)
            ? mtVal.itemMatches
            : [];
          // also accept other keys naming
          const combined = [...ppl, ...itms];
          // if still empty and itVal has nested arrays keys (fallback)
          if (combined.length === 0) {
            Object.values(mtVal).forEach((v: any) => {
              if (Array.isArray(v)) matchesArr.push(...v);
            });
          } else matchesArr = combined;
        }
      }
      setMatches(matchesArr);

      // update metrics
      setMetrics((m) => ({
        ...m,
        lostPersonCount: lpN.length,
        foundPersonCount: fpN.length,
        lostItemCount: liN.length,
        foundItemCount: fiN.length,
        successfulMatches: matchesArr.length,
      }));

      // generate minimal trend data (last 7 keys)
      const combined = [...lpN, ...fpN, ...liN, ...fiN];
      const counts: Record<string, number> = {};
      combined.forEach((c) => {
        const d = c.createdAt ? String(c.createdAt).slice(0, 10) : "unknown";
        counts[d] = (counts[d] || 0) + 1;
      });
      const trend = Object.entries(counts)
        .slice(-7)
        .map(([date, reports]) => ({ date, reports }));
      setTrendData(
        trend.length
          ? trend
          : [
              { date: "6d", reports: 12 },
              { date: "5d", reports: 18 },
              { date: "4d", reports: 10 },
              { date: "3d", reports: 24 },
              { date: "2d", reports: 16 },
              { date: "1d", reports: 20 },
              { date: "today", reports: 14 },
            ]
      );
    } catch (err) {
      console.error("fetchReportsAndItems error:", err);
    }
  }

  // ---------- Notifications helper ----------
  function pushNotification(message: string) {
    setNotifications((s) =>
      [
        {
          id: Date.now().toString(),
          message,
          time: new Date().toLocaleTimeString(),
        },
        ...s,
      ].slice(0, 6)
    );
  }

  // ---------- CSV export ----------
  function exportUsersCsv() {
    if (!users.length) {
      alert("No users to export");
      return;
    }
    const header = [
      "id",
      "name",
      "email",
      "phone",
      "role",
      "approved",
      "createdAt",
    ];
    const rows = users.map((u) => [
      u.id,
      u.name ?? "",
      u.email,
      u.phone ?? "",
      u.role,
      u.approved ? "true" : "false",
      u.createdAt ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sahayatri_users_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- derived ----------
  const filteredUsers = useMemo(() => {
    if (!query) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        String(u.id) === q
    );
  }, [users, query]);

  useEffect(() => {
    // initial load
    fetchUsers();
    fetchReportsAndItems();
    pushNotification("Welcome to SahaYatri Admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ensure matches is an array before mapping in JSX
  const safeMatches = Array.isArray(matches) ? matches : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50">
      <AdminNavbar
        tab={tab}
        setTab={setTab}
        userName={user?.name || user?.email || "Admin"}
        onLogout={() => {
          logout?.();
          window.location.href = "/";
        }}
      />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        {/* top actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">
              Manage users, reports, AI matches & system data
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportUsersCsv()}
              className="px-3 py-2 bg-white rounded shadow hover:shadow-md inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <div className="relative">
              <button className="bg-white p-2 rounded-full shadow">
                <Bell className="w-4 h-4" />
              </button>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {notifications.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="text-sm text-gray-500">Total Users</div>
                <div className="text-3xl font-bold">{metrics.totalUsers}</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="text-sm text-gray-500">Volunteers</div>
                <div className="text-3xl font-bold">{metrics.volunteers}</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="text-sm text-gray-500">Pending Approvals</div>
                <div className="text-3xl font-bold">
                  {metrics.pendingApprovals}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow col-span-2">
                <h3 className="text-lg font-semibold mb-4">Activity Trend</h3>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="reports"
                        stroke="#7C3AED"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-semibold mb-4">Case Types</h3>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Lost Persons",
                            value: metrics.lostPersonCount,
                          },
                          {
                            name: "Found Persons",
                            value: metrics.foundPersonCount,
                          },
                          { name: "Lost Items", value: metrics.lostItemCount },
                          {
                            name: "Found Items",
                            value: metrics.foundItemCount,
                          },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={40}
                        outerRadius={80}
                      >
                        <Cell fill={COLORS[0]} />
                        <Cell fill={COLORS[1]} />
                        <Cell fill={COLORS[2]} />
                        <Cell fill={COLORS[3]} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "users" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">User Management</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    placeholder="Search name, email..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-3 py-2 border rounded-lg w-72"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
                <button
                  onClick={() => fetchUsers()}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Refresh
                </button>
              </div>
            </div>

            {usersLoading ? (
              <p>Loading users...</p>
            ) : usersError ? (
              <p className="text-red-600">{usersError}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm text-gray-500">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm text-gray-500">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-sm text-gray-500">
                        Role
                      </th>
                      <th className="px-4 py-2 text-left text-sm text-gray-500">
                        Approved
                      </th>
                      <th className="px-4 py-2 text-left text-sm text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="px-4 py-3">{u.name || "-"}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">{u.role}</td>
                        <td className="px-4 py-3">
                          {u.approved ? (
                            <span className="text-green-600">Approved</span>
                          ) : (
                            <span className="text-yellow-600">Pending</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {!u.approved && (
                              <button
                                onClick={() => approveUser(u.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded"
                              >
                                <UserCheck className="inline w-4 h-4 mr-1" />
                                Approve
                              </button>
                            )}
                            <select
                              value={u.role}
                              onChange={(e) =>
                                changeRole(u.id, e.target.value as RoleString)
                              }
                              className="px-3 py-1 border rounded"
                            >
                              <option value="USER">Public</option>
                              <option value="VOLUNTEER">Volunteer</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded"
                            >
                              <Trash2 className="inline w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <p className="text-gray-500 mt-4">No users found.</p>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "reports" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Latest Person Reports
              </h3>
              <div className="space-y-3">
                {[...foundPeople.slice(0, 6), ...lostPeople.slice(0, 6)].map(
                  (r) => (
                    <div
                      key={`${r.type}-${r.id}`}
                      className="p-3 border rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-sm text-gray-500">
                          {r.location}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {r.createdAt ? String(r.createdAt).slice(0, 16) : ""}
                      </div>
                    </div>
                  )
                )}
                {foundPeople.length + lostPeople.length === 0 && (
                  <p className="text-gray-500">No person reports yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Latest Item Reports
              </h3>
              <div className="space-y-3">
                {[...foundItems.slice(0, 6), ...lostItems.slice(0, 6)].map(
                  (r) => (
                    <div
                      key={`${r.type}-${r.id}`}
                      className="p-3 border rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-sm text-gray-500">
                          {r.location}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {r.createdAt ? String(r.createdAt).slice(0, 16) : ""}
                      </div>
                    </div>
                  )
                )}
                {foundItems.length + lostItems.length === 0 && (
                  <p className="text-gray-500">No item reports yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Reports Trend (last 7)
              </h3>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="reports"
                      stroke="#7C3AED"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Case Type Distribution
              </h3>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Lost Persons",
                          value: metrics.lostPersonCount,
                        },
                        {
                          name: "Found Persons",
                          value: metrics.foundPersonCount,
                        },
                        { name: "Lost Items", value: metrics.lostItemCount },
                        { name: "Found Items", value: metrics.foundItemCount },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={90}
                    >
                      <Cell fill={COLORS[0]} />
                      <Cell fill={COLORS[1]} />
                      <Cell fill={COLORS[2]} />
                      <Cell fill={COLORS[3]} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === "matches" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">AI Matches</h3>

            {safeMatches.length === 0 ? (
              <p className="text-gray-500">No matches yet.</p>
            ) : (
              safeMatches.map((m: any, i: number) => (
                <div
                  key={m.id ?? i}
                  className="border rounded-lg p-4 mb-3 grid grid-cols-1 md:grid-cols-5 gap-3 items-center"
                >
                  <div className="col-span-1 md:col-span-3">
                    <div className="font-semibold">Match #{m.id ?? i}</div>
                    <div className="text-sm text-gray-500">
                      Type:{" "}
                      {m.type ||
                        m.matchType ||
                        (m.lostId && m.foundId ? "person/item" : "unknown")}
                    </div>
                    <div className="text-sm text-gray-500">
                      Time: {m.matchedAt || m.time || m.createdAt || "N/A"}
                    </div>
                  </div>

                  <div className="col-span-1 flex gap-2 items-center">
                    <div className="text-sm">
                      <strong>Confidence</strong>
                      <div className="text-2xl font-bold">
                        {(
                          (m.confidence ?? m.similarity ?? m.score) ||
                          0
                        ).toFixed(2)}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-1 flex gap-2 justify-end">
                    {m.lostImage && (
                      <img
                        alt="lost"
                        src={m.lostImage}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    {m.foundImage && (
                      <img
                        alt="found"
                        src={m.foundImage}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    {!m.lostImage && m.leftImageUrl && (
                      <img
                        alt="left"
                        src={m.leftImageUrl}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    {!m.foundImage && m.rightImageUrl && (
                      <img
                        alt="right"
                        src={m.rightImageUrl}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>

                  <div className="col-span-1 flex gap-2 justify-end md:justify-end">
                    <button className="px-3 py-1 bg-green-600 text-white rounded">
                      Confirm
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded">
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {tab === "cctv" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">CCTV Live Detection</h3>
            <MatchFaces />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
