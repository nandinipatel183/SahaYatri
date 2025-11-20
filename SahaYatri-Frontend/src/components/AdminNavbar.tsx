import React from "react";
import { Home, Users, FileText, PieChart, Cpu, Settings2, LogOut, Camera } from "lucide-react";

interface Props {
  tab: string;
  setTab: (
    t: "overview" | "users" | "reports" | "analytics" | "matches" | "settings" | "cctv"
  ) => void;
  onLogout?: () => void;
  userName?: string;
}

const NavButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${
      active
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const AdminNavbar: React.FC<Props> = ({ tab, setTab, onLogout, userName }) => {
  return (
    <div className="w-full fixed top-0 left-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-default">
            <div className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-full p-2 shadow">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">SahaYatri Admin</div>
              <div className="text-xs text-gray-500">Central control panel</div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <NavButton active={tab === "overview"} onClick={() => setTab("overview")}>
              <Home className="h-4 w-4" /> Overview
            </NavButton>

            <NavButton active={tab === "users"} onClick={() => setTab("users")}>
              <Users className="h-4 w-4" /> Users
            </NavButton>

            <NavButton active={tab === "reports"} onClick={() => setTab("reports")}>
              <FileText className="h-4 w-4" /> Reports
            </NavButton>

            <NavButton active={tab === "analytics"} onClick={() => setTab("analytics")}>
              <PieChart className="h-4 w-4" /> Analytics
            </NavButton>

            <NavButton active={tab === "matches"} onClick={() => setTab("matches")}>
              <Settings2 className="h-4 w-4" /> AI Matches
            </NavButton>

            {/* ⭐ NEW CCTV DETECTION TAB */}
            <NavButton active={tab === "cctv"} onClick={() => setTab("cctv")}>
              <Camera className="h-4 w-4" /> CCTV Detection
            </NavButton>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">
            Signed in as <span className="font-semibold">{userName ?? "Admin"}</span>
          </div>
          <button
            onClick={() => onLogout?.()}
            className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-2"
            title="Logout"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
