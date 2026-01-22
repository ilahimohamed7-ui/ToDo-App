import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/api/axios";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  async function fetchMe() {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      // Token ungültig
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchMe();
    else setReady(true);
  }, []); //Auth-Check nur einmal nicht bei jedem rendern

  async function register({ email, password, name }) {
    const { data } = await api.post("/auth/register", {
      email,
      password,
      name,
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
