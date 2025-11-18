import React, { useEffect, useState } from "react";
import { Users, Package, CheckCircle } from "lucide-react";
import Header from "./UserNavbar";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  const [lostPersons, setLostPersons] = useState([]);
  const [foundPersons, setFoundPersons] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------
  // LOAD ALL USER REPORTS
  // -----------------------------------------------------
  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);

    const token = localStorage.getItem("sahayatri_token");
    console.log("Using token:", token);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const lp = await fetch("http://localhost:8080/api/my/lost-persons", { headers });
      const fp = await fetch("http://localhost:8080/api/my/found-persons", { headers });
      const li = await fetch("http://localhost:8080/api/my/lost-items", { headers });
      const fi = await fetch("http://localhost:8080/api/my/found-items", { headers });

      setLostPersons(lp.ok ? await lp.json() : []);
      setFoundPersons(fp.ok ? await fp.json() : []);
      setLostItems(li.ok ? await li.json() : []);
      setFoundItems(fi.ok ? await fi.json() : []);

    } catch (e) {
      console.error("Failed:", e);
    }

    setLoading(false);
  }

  if (loading) return <div className="p-10 text-center text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Greetings */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name || "User"}
          </h1>
          <p className="text-gray-600">Manage all your reports below</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <Link
            to="/report-person"
            className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl text-white shadow-lg hover:opacity-90"
          >
            <Users className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold">Report Lost Person</h3>
          </Link>

          <Link
            to="/report-item"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-2xl text-white shadow-lg hover:opacity-90"
          >
            <Package className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold">Report Lost Item</h3>
          </Link>

          <Link
            to="/report-found-person"
            className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-2xl text-white shadow-lg hover:opacity-90"
          >
            <CheckCircle className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold">Report Found Person</h3>
          </Link>

          <Link
            to="/report-found-item"
            className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-2xl text-white shadow-lg hover:opacity-90"
          >
            <CheckCircle className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold">Report Found Item</h3>
          </Link>

        </div>

        {/* Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LOST PERSONS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">My Lost Persons</h2>

            {lostPersons.length === 0 && <p className="text-gray-500">No lost person reports.</p>}

            <div className="space-y-4">
              {lostPersons.map((p: any) => (
                <div key={p.id} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={p.photoUrls || "/placeholder-person.png"}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <p className="text-sm text-gray-600">Last seen at: {p.lastSeenLocation}</p>
                    <p className="text-xs text-gray-500">{p.lastSeenTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOUND PERSONS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">My Found Persons</h2>

            {foundPersons.length === 0 && <p className="text-gray-500">No found person reports.</p>}

            <div className="space-y-4">
              {foundPersons.map((p: any) => (
                <div key={p.id} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={p.photoUrls || "/placeholder-person.png"}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{p.gender || "Unknown"}</h3>
                    <p className="text-sm text-gray-600">Found at: {p.foundLocation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOST ITEMS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">My Lost Items</h2>

            {lostItems.length === 0 && <p className="text-gray-500">No lost item reports.</p>}

            <div className="space-y-4">
              {lostItems.map((i: any) => (
                <div key={i.id} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={i.photoPaths || "/placeholder-item.png"}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{i.itemName}</h3>
                    <p className="text-sm text-gray-600">Last seen: {i.lastSeenLocation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOUND ITEMS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">My Found Items</h2>

            {foundItems.length === 0 && <p className="text-gray-500">No found item reports.</p>}

            <div className="space-y-4">
              {foundItems.map((i: any) => (
                <div key={i.id} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={i.photoUrl || "/placeholder-item.png"}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{i.itemName}</h3>
                    <p className="text-sm text-gray-600">Found at: {i.foundLocation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
