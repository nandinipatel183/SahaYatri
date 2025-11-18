import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (formData: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // -------------------------------------------------
  // ✅ RESTORE LOGIN AFTER REFRESH
  // -------------------------------------------------
  useEffect(() => {
    const savedToken = localStorage.getItem("sahayatri_token");
    const savedRole = localStorage.getItem("sahayatri_role");

    if (savedToken && savedRole) {
      try {
        const decoded: any = jwtDecode(savedToken);

        setUser({
          email: decoded.sub,
          role: savedRole,
        });

        setToken(savedToken);
      } catch (err) {
        console.error("Invalid token on refresh:", err);
        localStorage.removeItem("sahayatri_token");
        localStorage.removeItem("sahayatri_role");
      }
    }
  }, []);

  // -------------------------------------------------
  // ✅ LOGIN FUNCTION
  // -------------------------------------------------
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        const token = data.token;
        const role = data.user.role; // <-- backend returns user object

        // Save to localStorage
        localStorage.setItem("sahayatri_token", token);
        localStorage.setItem("sahayatri_role", role);

        const decoded: any = jwtDecode(token);

        setToken(token);
        setUser({
          email: decoded.sub,
          role: role,
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // -------------------------------------------------
  // ✅ REGISTER FUNCTION
  // -------------------------------------------------
  const register = async (formData: any) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      return response.ok;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // -------------------------------------------------
  // ✅ LOGOUT FUNCTION
  // -------------------------------------------------
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sahayatri_token");
    localStorage.removeItem("sahayatri_role");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
