import { useState } from "react";
import Header from "./UserNavbar";

interface MapItem {
  id: number;
  area: string;
  image: string;
  volunteers: number;
  volunteerContacts: string[];
  policeContacts: string[];
}
export { mapData };
const mapData: MapItem[] = [
  {
    id: 1,
    area: "Mahakumbh Ujjain",
    image: "/mahakumbh-map.jpg",
    volunteers: 25,
    volunteerContacts: ["+91-9876543210", "+91-9876543211", "+91-9876543212"],
    policeContacts: ["+91-100 (Emergency)", "+91-9876543200"],
  },
  {
    id: 2,
    area: "Railway Station",
    image: "/railway-station-map.jpg",
    volunteers: 15,
    volunteerContacts: ["+91-9876543220", "+91-9876543221"],
    policeContacts: ["+91-100 (Emergency)", "+91-9876543201"],
  },
  {
    id: 3,
    area: "Mall",
    image: "/mall-map.jpg",
    volunteers: 10,
    volunteerContacts: ["+91-9876543230", "+91-9876543231"],
    policeContacts: ["+91-100 (Emergency)", "+91-9876543202"],
  },
];
export default function MapNavigation() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMaps = mapData.filter((item) =>
    item.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />

      {/* === Page Title === */}
      <div className="text-center mt-6">
        <h1 className="text-3xl font-bold text-gray-900">Offline Maps</h1>
        <p className="text-gray-600 mt-1">
          Explore maps & emergency contacts for crowded locations.
        </p>
      </div>

      {/* === Search Bar === */}
      <div className="flex justify-center mt-6 px-4">
        <div className="flex w-full md:w-2/3 lg:w-1/2 gap-2">
          <input
            type="text"
            placeholder="Search for an area (e.g., Mahakumbh Ujjain)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-white shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md"
          >
            Search
          </button>
        </div>
      </div>

      {/* === Map Cards === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 mt-8 pb-10">
        {filteredMaps.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col transition hover:shadow-lg"
          >
            <img
              src={item.image}
              alt={item.area}
              className="w-full h-48 object-cover rounded-xl"
            />

            <h3 className="text-xl font-bold mt-3">{item.area}</h3>

            <p className="font-semibold mt-2">
              Active Volunteers: <span className="font-normal">{item.volunteers}</span>
            </p>

            <p className="font-semibold mt-3">Volunteer Contacts:</p>
            <ul className="text-sm ml-4 mt-1 list-disc">
              {item.volunteerContacts.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            <p className="font-semibold mt-3">Police Officers Nearby:</p>
            <ul className="text-sm ml-4 mt-1 list-disc">
              {item.policeContacts.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            {/* Button */}
            <a
              href={item.image}
              download
              className="mt-auto w-full text-center bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition mt-4"
            >
              Download Offline Map
            </a>
          </div>
        ))}

        {filteredMaps.length === 0 && (
          <p className="text-center col-span-full text-gray-600 text-lg">
            No areas found.
          </p>
        )}
      </div>
    </div>
  );
}
