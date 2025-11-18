import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Clock, Users, AlertCircle, Compass, Map } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from './UserNavbar';

const MapNavigation: React.FC = () => {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const importantLocations = [
    {
      id: 1,
      name: 'Mahakaleshwar Temple',
      type: 'temple',
      coordinates: { lat: 23.1825, lng: 75.7681 },
      description: 'Main temple complex - Primary gathering point',
      facilities: ['Lost & Found Center', 'Medical Aid', 'Information Desk'],
      helplineNumber: '+91 1800-123-4567',
      status: 'active'
    },
    {
      id: 2,
      name: 'Ram Ghat',
      type: 'ghat',
      coordinates: { lat: 23.1790, lng: 75.7650 },
      description: 'Holy bathing ghat - High activity area',
      facilities: ['SahaYatri Kiosk', 'Volunteer Station', 'First Aid'],
      helplineNumber: '+91 1800-123-4568',
      status: 'active'
    },
    {
      id: 3,
      name: 'Harsiddhi Temple',
      type: 'temple',
      coordinates: { lat: 23.1698, lng: 75.7840 },
      description: 'Sacred temple - Popular pilgrimage site',
      facilities: ['Information Center', 'Lost Person Booth'],
      helplineNumber: '+91 1800-123-4569',
      status: 'active'
    },
    {
      id: 4,
      name: 'Rudra Sagar Lake',
      type: 'lake',
      coordinates: { lat: 23.1889, lng: 75.7681 },
      description: 'Scenic lake area - Recreation zone',
      facilities: ['SahaYatri Help Desk', 'Security Post'],
      helplineNumber: '+91 1800-123-4570',
      status: 'active'
    },
    {
      id: 5,
      name: 'Central Parking Area',
      type: 'parking',
      coordinates: { lat: 23.1750, lng: 75.7700 },
      description: 'Main vehicle parking - Common separation point',
      facilities: ['Lost & Found Office', 'Information Kiosk', 'Security'],
      helplineNumber: '+91 1800-123-4571',
      status: 'active'
    },
    {
      id: 6,
      name: 'Food Court Complex',
      type: 'facility',
      coordinates: { lat: 23.1800, lng: 75.7720 },
      description: 'Central food and shopping area',
      facilities: ['SahaYatri Booth', 'Lost Item Collection'],
      helplineNumber: '+91 1800-123-4572',
      status: 'active'
    }
  ];

  const emergencyContacts = [
    { name: 'SahaYatri Emergency', number: '+91 1800-SAHAYATRI', type: 'primary' },
    { name: 'Police Control Room', number: '100', type: 'emergency' },
    { name: 'Medical Emergency', number: '108', type: 'emergency' },
    { name: 'Fire Department', number: '101', type: 'emergency' }
  ];

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'temple': return '🛕';
      case 'ghat': return '🏛️';
      case 'lake': return '🏞️';
      case 'parking': return '🅿️';
      case 'facility': return '🏢';
      default: return '📍';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('map')} Navigation</h1>
          <p className="text-gray-600">Find important locations and get help during Simhastha</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Map Header */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Map className="h-6 w-6" />
                    <h2 className="text-xl font-bold">Ujjain Simhastha Map</h2>
                  </div>
                  <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-3 py-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Live</span>
                  </div>
                </div>
              </div>

              {/* Interactive Map Area */}
              <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100">
                {/* Simulated Map Background */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url('https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                
                {/* Location Markers */}
                {importantLocations.map((location, index) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(selectedLocation === location.name ? null : location.name)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                      selectedLocation === location.name ? 'z-10 scale-125' : 'z-5'
                    }`}
                    style={{
                      left: `${20 + (index % 3) * 30}%`,
                      top: `${20 + Math.floor(index / 3) * 25}%`
                    }}
                  >
                    <div className={`bg-white rounded-full p-3 shadow-lg border-4 ${
                      selectedLocation === location.name ? 'border-teal-500' : 'border-gray-200'
                    }`}>
                      <span className="text-2xl">{getLocationIcon(location.type)}</span>
                    </div>
                    {selectedLocation === location.name && (
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 min-w-64 z-20">
                        <h3 className="font-bold text-gray-900 mb-2">{location.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{location.description}</p>
                        <div className="space-y-2 mb-3">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase">Facilities</h4>
                          {location.facilities.map((facility, idx) => (
                            <div key={idx} className="flex items-center text-xs text-gray-600">
                              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                              {facility}
                            </div>
                          ))}
                        </div>
                        <a
                          href={`tel:${location.helplineNumber}`}
                          className="flex items-center space-x-2 bg-teal-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-teal-600 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          <span>Call for Help</span>
                        </a>
                      </div>
                    )}
                  </button>
                ))}

                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <button className="bg-white rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors">
                    <Navigation className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="bg-white rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors">
                    <Compass className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Legend</h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs">
                      <span className="mr-2">🛕</span>
                      <span>Temples</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="mr-2">🏛️</span>
                      <span>Ghats</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="mr-2">🅿️</span>
                      <span>Parking</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="mr-2">🏢</span>
                      <span>Facilities</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6" />
                  <div className="text-left">
                    <h3 className="font-semibold">Emergency Alert</h3>
                    <p className="text-sm opacity-90">Report emergency situation</p>
                  </div>
                </div>
              </button>

              <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6" />
                  <div className="text-left">
                    <h3 className="font-semibold">Find Volunteer</h3>
                    <p className="text-sm opacity-90">Locate nearest helper</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-red-500" />
                Emergency Contacts
              </h3>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <a
                    key={index}
                    href={`tel:${contact.number}`}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all hover:scale-105 ${
                      contact.type === 'primary' 
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                        : contact.type === 'emergency'
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div>
                      <p className={`font-semibold ${contact.type === 'primary' ? 'text-white' : ''}`}>
                        {contact.name}
                      </p>
                      <p className={`text-sm ${
                        contact.type === 'primary' ? 'text-cyan-100' : 'opacity-75'
                      }`}>
                        {contact.number}
                      </p>
                    </div>
                    <Phone className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Live Updates */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Live Updates
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-500 rounded-full w-2 h-2 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-green-800">All systems operational</p>
                    <p className="text-xs text-green-600">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-500 rounded-full w-2 h-2 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Match found at Ram Ghat</p>
                    <p className="text-xs text-blue-600">15 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="bg-yellow-500 rounded-full w-2 h-2 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Heavy crowd at Temple Gate 1</p>
                    <p className="text-xs text-yellow-600">30 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Instructions */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <p className="text-sm">Visit any marked location for assistance</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <Phone className="h-4 w-4" />
                  </div>
                  <p className="text-sm">Call emergency numbers above</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <Users className="h-4 w-4" />
                  </div>
                  <p className="text-sm">Look for SahaYatri volunteers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapNavigation;