import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  // NAV ITEMS — ONLY FOR USER
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/report-person', label: 'Lost Person' },
    { path: '/report-item', label: 'Lost Item' },
    { path: '/report-found-person', label: 'Found Person' },
    { path: '/report-found-item', label: 'Found Item' },
    { path: '/map', label: 'Map' }
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ------------ LOGO ------------ */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-full p-2">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SahaYatri</span>
          </Link>

          {/* ------------ NAVBAR ------------ */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition 
                  ${location.pathname === item.path
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ------------ RIGHT SIDE ------------ */}
          <div className="flex items-center space-x-4">

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-orange-500"
            >
              <option value="en">EN</option>
              <option value="hi">हि</option>
              <option value="mr">मर</option>
            </select>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-2 w-2"></span>
            </button>

            {/* ------------ USER NAME + LOGOUT ------------ */}
            <div className="flex items-center space-x-3">

              {/* Only Name Here */}
              <div className="flex items-center space-x-2">
                <div className="bg-orange-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || "User"}
                </p>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>

            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
