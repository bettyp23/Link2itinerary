import React, { createContext, useContext, useMemo, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const STORAGE_KEY = "link2itinerary.auth.user";

function readStoredUser(): User | null {
  //defensively reading: storage can fail (privacy mode/quota) or contain invalid json
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function writeStoredUser(user: User | null) {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    //ignoring storage errors: auth should still work in-memory
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  //deriving auth state from user to avoid duplicate sources of truth
  const isAuthenticated = !!user;

  const value = useMemo<AuthContextValue>(() => {
    const login = (email: string, password: string) => {
      const normalizedEmail = email.trim();
      const normalizedPassword = password.trim();

      if (!normalizedEmail || !normalizedPassword) return;

      //mock-only login: swap for real backend auth + token handling later
      const fakeUser: User = {
        id: `user_${Math.random().toString(16).slice(2)}`,
        name: normalizedEmail.split("@")[0] || "User",
        email: normalizedEmail
      };

      setUser(fakeUser);
      writeStoredUser(fakeUser);
    };

    const logout = () => {
      setUser(null);
      writeStoredUser(null);
    };

    return {
      user,
      isAuthenticated,
      login,
      logout
    };
    //memoizing context value to avoid re-rendering all consumers unnecessarily
  }, [user, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}

