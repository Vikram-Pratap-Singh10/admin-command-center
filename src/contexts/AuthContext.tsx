import React, { createContext, useContext, useState, useCallback } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string; // now dynamic — matches role name (snake_case)
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("magicdose_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string, role?: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const selectedRole = role || "super_admin";
    const roleName = selectedRole.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const mockUser: User = {
      id: "1",
      email,
      name: roleName + " User",
      role: selectedRole,
    };
    localStorage.setItem("magicdose_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("magicdose_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
