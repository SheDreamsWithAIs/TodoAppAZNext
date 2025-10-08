"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { isDevMode, DEV_USER } from "@/lib/auth-dev";
import type { AuthContextType, User } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string) => {
    if (isDevMode) {
      setUser({ ...DEV_USER, email });
      return;
    }
    // TODO: Replace with real API call when auth is implemented
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (_email: string, _password: string, _name?: string) => {
    if (isDevMode) {
      setUser(DEV_USER);
      return;
    }
    // TODO: Replace with real API call when auth is implemented
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}


