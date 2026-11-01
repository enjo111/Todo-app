import { useState, useEffect, createContext, type ReactNode } from "react";
import type User from "../models/User";
import { authToken, client } from "../services/api-client";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore user session via HTTP cookie on app startup
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const token = authToken.get();
        if (!token) {
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        const activeUser = await client.get<{user: User}>("/auth/me");
        if (isMounted && activeUser) {
          setUser(activeUser.user);
          setIsAuthenticated(true);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const userRes = await client.post<{ user: User , token: string}>("/auth/login", { email, password });

    // store the token in an session cookie, so we don't need to handle it in localStorage or state
    authToken.set(userRes.token);
    
    setUser(userRes.user);
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string, name?: string): Promise<void> => {
    const userRes = await client.post<{ user: User, token: string }>("/auth/register", { email, password, name });

    // store the token in an session cookie, so we don't need to handle it in localStorage or state
    authToken.set(userRes.token);
    

    setUser(userRes.user);
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
      setUser(null);

      // Remove the token from the session cookie
      authToken.clear();

      setIsAuthenticated(false);
  };

  const value: AuthState = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
