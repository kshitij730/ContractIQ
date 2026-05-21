"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "contractiq_token";
const USER_KEY = "contractiq_user";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  company?: string | null;
  is_active: boolean;
  created_at?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { full_name: string; email: string; company?: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession() {
  if (typeof window === "undefined") {
    return { storedToken: null as string | null, storedUser: null as AuthUser | null };
  }

  const storedToken = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  return {
    storedToken,
    storedUser: rawUser ? (JSON.parse(rawUser) as AuthUser) : null,
  };
}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data?.detail === "string" ? data.detail : "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ storedToken, storedUser }] = useState(readStoredSession);
  const [user, setUser] = useState<AuthUser | null>(storedUser);
  const [token, setToken] = useState<string | null>(storedToken);
  const [isLoading, setIsLoading] = useState(Boolean(storedToken && storedUser));

  const persistSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!storedToken || !storedUser) {
      return;
    }

    requestJson<AuthUser>("/api/v1/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((profile) => {
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
        setUser(profile);
      })
      .catch(() => {
        clearSession();
      })
      .finally(() => setIsLoading(false));
  }, [clearSession, storedToken, storedUser]);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const data = await requestJson<{ access_token: string; user: AuthUser }>("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    persistSession(data.access_token, data.user);
  }, [persistSession]);

  const signup = useCallback(async (payload: { full_name: string; email: string; company?: string; password: string }) => {
    const data = await requestJson<{ access_token: string; user: AuthUser }>("/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    persistSession(data.access_token, data.user);
  }, [persistSession]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, token, isLoading, login, signup, logout }),
    [user, token, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
