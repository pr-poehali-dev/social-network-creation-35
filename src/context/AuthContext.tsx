import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("volna_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, _password: string) => {
    // Имитация входа — в будущем заменить на реальный API
    await new Promise(r => setTimeout(r, 800));
    const mockUser: AuthUser = {
      id: 1,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      username: "@" + email.split("@")[0],
      email,
    };
    setUser(mockUser);
    localStorage.setItem("volna_user", JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const mockUser: AuthUser = {
      id: Date.now(),
      name,
      username: "@" + email.split("@")[0],
      email,
    };
    setUser(mockUser);
    localStorage.setItem("volna_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("volna_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
