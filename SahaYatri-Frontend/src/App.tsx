import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import ReportLostPerson from "./components/ReportLostPerson";
import ReportFoundPerson from "./components/ReportFoundPerson";
import ReportFoundItem from "./components/ReportFoundItem";
import ReportLostItem from "./components/ReportLostItem";
import Chatbot from "./components/Chatbot";
import MatchFaces from "./components/MatchFaces";
import UserDashboard from "./components/UserDashboard";
import VolunteerDashboard from "./components/VolunteerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import "./index.css";
import MapNavigation from "./components/MapNavigation";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

function AppContent() {
  const { user } = useAuth();

  // Normalizing role (uppercase always)
  const role = user?.role?.toUpperCase();

  return (
    <>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/report-person"
          element={user ? <ReportLostPerson /> : <Navigate to="/login" />}
        />

        <Route
          path="/report-found-person"
          element={user ? <ReportFoundPerson /> : <Navigate to="/login" />}
        />

        <Route
          path="/report-item"
          element={user ? <ReportLostItem /> : <Navigate to="/login" />}
        />

        <Route
          path="/report-found-item"
          element={user ? <ReportFoundItem /> : <Navigate to="/login" />}
        />

        <Route path="/map" element={<MapNavigation />} />

        <Route path="/match" element={<MatchFaces />} />

        {/* CORRECT DASHBOARD ROUTES */}
        <Route
          path="/dashboard-user"
          element={
            user?.role === "USER" ? <UserDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/volunteer-dashboard"
          element={
            user?.role === "VOLUNTEER" ? (
              <VolunteerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            user?.role === "ADMIN" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* BACKWARD COMPATIBILITY */}
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard-user" replace />}
        />
      </Routes>

      <Chatbot />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
            <AppContent />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
