import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout, getUser } from "../api/auth";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur au démarrage (si cookie session valide)
  useEffect(() => {
    (async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    await apiLogin(email, password);
    const data = await getUser();
    setUser(data);
  };

  // Logout
  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
