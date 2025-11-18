// src/components/VolunteerNavbar.tsx
import React from "react";

interface Props {
  tab: string;
  setTab: (t: "overview" | "verify" | "lostReports" | "foundReports" | "map" | "stats") => void;
}

const VolunteerNavbar: React.FC<Props> = ({ tab, setTab }) => {
  const link = (id: Props["tab"], label: string) => (
    <button
      onClick={() => setTab(id as any)}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        tab === id ? "bg-emerald-600 text-white shadow" : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold">SahaYatri-Volunteer</div>
          <nav className="flex items-center gap-2">
            {link("overview", "Overview")}
            {link("lostReports", "Lost Reports")}
            {link("foundReports", "Found Reports")}
            {link("map", "Map")}
            {link("stats", "Stats")}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Welcome, Volunteer</div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerNavbar;
