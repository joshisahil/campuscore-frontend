export type Role = 'ROLE_ADMIN' | 'ROLE_TEACHER' | 'ROLE_STUDENT';
export interface AuthSession { token: string; username: string; role: Role; expiresAt: number }
const KEY = 'campuscore.auth.session';
const allowedRoles: readonly string[] = ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT'];
export function isRole(value: unknown): value is Role { return typeof value === 'string' && allowedRoles.includes(value); }
export function tokenExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/') .padEnd(Math.ceil(payload.length / 4) * 4, '='));
    const parsed: unknown = JSON.parse(decoded);
    if (!parsed || typeof parsed !== 'object' || !('exp' in parsed)) return null;
    const exp = (parsed as { exp?: unknown }).exp;
    return typeof exp === 'number' && Number.isFinite(exp) ? exp * 1000 : null;
  } catch { return null; }
}
export function sessionFromLogin(value: unknown): AuthSession {
  if (!value || typeof value !== 'object') throw new Error('Unexpected login response');
  const data = value as Record<string, unknown>;
  if (typeof data.token !== 'string' || !data.token || typeof data.username !== 'string' || !data.username || !isRole(data.role)) {
    throw new Error('Unexpected login response');
  }
  const expiresAt = tokenExpiry(data.token);
  if (!expiresAt || expiresAt <= Date.now()) throw new Error('Invalid or expired login token');
  return { token: data.token, username: data.username, role: data.role, expiresAt };
}
export function readSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') { clearSession(); return null; }
    const s = data as Partial<AuthSession>;
    if (typeof s.token !== 'string' || typeof s.username !== 'string' || !isRole(s.role) || typeof s.expiresAt !== 'number' || s.expiresAt <= Date.now() || tokenExpiry(s.token) !== s.expiresAt) {
      clearSession(); return null;
    }
    return s as AuthSession;
  } catch { clearSession(); return null; }
}
export function saveSession(session: AuthSession): void { sessionStorage.setItem(KEY, JSON.stringify(session)); }
export function clearSession(): void { try { sessionStorage.removeItem(KEY); } catch { /* storage unavailable */ } }
export function roleCanAccess(role: Role, area: string): boolean {
  switch (area) {
    case 'students': return role === 'ROLE_ADMIN';
    case 'teachers': return role === 'ROLE_ADMIN';
    case 'classes': return role === 'ROLE_ADMIN' || role === 'ROLE_TEACHER';
    case 'attendance': return true; // endpoints inside this module have different permissions
    case 'payments': return true; // admin manages payments; students have limited own-payment endpoints
    case 'notifications': return true;
    default: return true;
  }
}
