import React, { createContext, useContext, useMemo, useState } from "react";

export type User = {
  id: string;
  username: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const USER_KEY = "link2itinerary.auth.user";
const TOKEN_KEY = "link2itinerary.auth.token";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:3000/api";

function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // ignore storage errors — auth works in-memory as fallback
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(() => readStorage<User>(USER_KEY));
  const [token, setToken] = useState<string | null>(() =>
    readStorage<string>(TOKEN_KEY)
  );

  const isAuthenticated = !!user && !!token;

  const value = useMemo<AuthContextValue>(() => {
    const login = async (username: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Invalid username or password");
      }

      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      writeStorage(USER_KEY, data.user);
      writeStorage(TOKEN_KEY, data.token);
    };

    const register = async (username: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          Array.isArray(body?.message)
            ? body.message.join(". ")
            : (body?.message ?? "Registration failed")
        );
      }

      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      writeStorage(USER_KEY, data.user);
      writeStorage(TOKEN_KEY, data.token);
    };

    const logout = () => {
      setUser(null);
      setToken(null);
      writeStorage(USER_KEY, null);
      writeStorage(TOKEN_KEY, null);
    };

    return { user, token, isAuthenticated, login, register, logout };
  }, [user, token, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}
