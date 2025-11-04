// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loginApi, logoutApi, meApi } from "../api/auth";
import { useNavigate } from "react-router-dom";

export type User = {
  id: number;
  name: string;
  email: string;
  role?: string; // 'admin' | 'manager' | 'seller' | 'technician' | 'accountant' | ...
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleRouteMap: Record<string, string> = {
  admin: "/admin",
  manager: "/manager",
  seller: "/sales",
  technician: "/technician/quotes",
  accountant: "/accounting",
  // ajouter d'autres rôles ici si besoin
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initial load : vérifier si la session est active (GET /me)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await meApi(); // doit renvoyer { user: {...} } ou 401
        setUser(res.user ?? null);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // login handler : fait login et redirige selon rôle
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      const u: User = res.user;
      setUser(u);

      // redirection selon rôle
      const role = u.role ?? "";
      const target = roleRouteMap[role] ?? "/dashboard";
      navigate(target, { replace: true });
    } catch (err: any) {
      // throw pour page login qui affichera l'erreur
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutApi();
      setUser(null);
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("logout error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
