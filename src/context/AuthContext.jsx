import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { http, fmtError } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null=loading, false=guest, obj=user
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const { data } = await http.get("/auth/me");
      setUser(data);
      return data;
    } catch (e) {
      setUser(false);
      return null;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    setError("");
    try {
      const { data } = await http.post("/auth/login", { email, password });
      setUser(data.user);
      return data.user;
    } catch (e) {
      const msg = fmtError(e.response?.data?.detail) || e.message;
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (name, email, password) => {
    setError("");
    try {
      const { data } = await http.post("/auth/register", { name, email, password });
      setUser(data.user);
      return data.user;
    } catch (e) {
      const msg = fmtError(e.response?.data?.detail) || e.message;
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await http.post("/auth/logout");
    } catch (_) {}
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, refresh, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
