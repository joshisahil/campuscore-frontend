import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiRequest } from '../lib/api';
import { clearSession, readSession, saveSession, sessionFromLogin, type AuthSession } from './session';
interface AuthValue {
  session: AuthSession | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readSession());
  const logout = useCallback(() => { clearSession(); setSession(null); }, []);
  const login = useCallback(async (username: string, password: string) => {
    const response = await apiRequest<unknown>('/auth/login', {
      method: 'POST', body: JSON.stringify({ username, password }),
    });
    const next = sessionFromLogin(response);
    saveSession(next);
    setSession(next);
  }, []);
  useEffect(() => {
    if (!session) return;
    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) { logout(); return; }
    const timeout = window.setTimeout(logout, Math.min(remaining, 2147483647));
    return () => window.clearTimeout(timeout);
  }, [session, logout]);
  const value = useMemo(() => ({ session, login, logout }), [session, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
