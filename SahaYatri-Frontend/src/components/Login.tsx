import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, User, Phone, UserCheck } from "lucide-react";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "USER",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // -------------------------------------------------------
  // SAFE LOGIN + REGISTER
  // -------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // -------------------------------------------------------
    // REGISTER USER
    // -------------------------------------------------------
    if (!isLogin) {
      try {
        const registerRes = await fetch("http://localhost:8080/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const resText = await registerRes.text();
        alert(resText.includes("successful") ? "Registered! Wait for approval." : resText);

        if (registerRes.ok) setIsLogin(true);
      } catch {
        alert("Registration failed.");
      }

      setIsLoading(false);
      return;
    }

    // -------------------------------------------------------
    // LOGIN USER
    // -------------------------------------------------------
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // ❌ If login failed
      if (!response.ok) {
        const msg = await response.text();
        alert("Login failed: " + msg);
        setIsLoading(false);
        return;
      }

      // ✔ Safe JSON parse
      let data: any;
      try {
        data = await response.json();
      } catch {
        alert("Unexpected server response. Try again.");
        setIsLoading(false);
        return;
      }

      // ❌ Invalid token check
      if (!data.token || data.token.split(".").length !== 3) {
        alert("Received invalid token from server.");
        setIsLoading(false);
        return;
      }

      // ❌ User not approved
      if (!data.user?.approved) {
        alert("Your account is waiting for admin approval.");
        setIsLoading(false);
        return;
      }

      // SAVE TOKEN + ROLE
      localStorage.setItem("sahayatri_token", data.token);
      localStorage.setItem("sahayatri_role", data.user.role);

      // REDIRECT BY ROLE
      switch (data.user.role) {
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        case "VOLUNTEER":
          navigate("/volunteer-dashboard");
          break;
        default:
          navigate("/dashboard-user");
      }
    } catch {
      alert("Network error. Try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* BG */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-orange-800 via-amber-700 to-yellow-600 opacity-95"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1784578/pexels-photo-1784578.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.6)",
        }}
      />

      {/* FORM CARD */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-full p-3">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">SahaYatri</span>
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Login" : "Register"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* REGISTER FIELDS */}
            {!isLogin && (
              <>
                {/* Name */}
                <div>
                  <label className="block text-sm mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                />
              </div>
            </div>

            {/* Role */}
            {!isLogin && (
              <div>
                <label className="block text-sm mb-2">Role</label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  >
                    <option value="USER">Public User</option>
                    <option value="VOLUNTEER">Volunteer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg"
            >
              {isLoading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* Switch */}
          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-orange-600 font-medium">
              {isLogin ? "Don't have an account? Register" : "Already registered? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
