import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, MapPin, MessageCircle, Shield, Globe, Camera, Mic, Bell, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LandingPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 shadow-lg z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-white">SahaYatri</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white bg-opacity-20 text-white border border-white border-opacity-90 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
              <Link 
                to="/login" 
                className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                {t('login')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Mahakumbh Background */}
      <section className="pt-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-700 opacity-90"
          style={{
            backgroundImage: "url('/mahakumbh.jpg')",
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            filter: 'brightness(0.5)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t('welcome')}
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('tagline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/login" 
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-xl"
            >
              {t('login')} / {t('register')}
            </Link>
            <Link 
              to="/map" 
              className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-10 py-4 rounded-full text-lg font-semibold border-2 border-white border-opacity-30 hover:bg-opacity-30 transition-all transform hover:scale-105"
            >
              {t('map')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white via-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Lost & Found Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI-powered platform for Simhastha 2028 and beyond
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-orange-100">
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lost Person Reporting</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload photos and voice recordings with AI-powered face and voice recognition for instant matching.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-orange-100">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lost Item Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Report and track lost belongings with detailed categorization and photo documentation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-orange-100">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">CCTV Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time face matching alerts through integrated CCTV camera network monitoring.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-orange-100">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Role-Based Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Separate interfaces for public, volunteers, and admin users with appropriate permissions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-orange-100">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Alerts</h3>
              <p className="text-gray-600 leading-relaxed">
                Instant push notifications when potential matches are found through AI analysis.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-orange-100">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multi-Language Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Available in English, Hindi, Marathi, and more languages for accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50M+</div>
              <div className="text-xl opacity-90">Expected Visitors</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-xl opacity-90">Support Available</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-xl opacity-90">AI Accuracy</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-xl opacity-90">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold">SahaYatri</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Leveraging technology to reunite families and recover belongings during large gatherings.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">Login</Link>
                <Link to="/map" className="block text-gray-400 hover:text-white transition-colors">Map Navigation</Link>
                <Link to="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Emergency Contact</h3>
              <p className="text-gray-400">24/7 Helpline: <span className="text-white font-semibold">+91 1800-123-4567</span></p>
              <p className="text-gray-400 mt-2">Email: <span className="text-white">help@sahayatri.org</span></p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SahaYatri. Built for Simhastha 2028 and beyond.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;