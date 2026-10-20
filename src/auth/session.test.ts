import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSession, isRole, readSession, roleCanAccess, saveSession, sessionFromLogin, tokenExpiry } from './session';
const store = new Map<string, string>();
const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v); }, removeItem: (k: string) => { store.delete(k); } };
function token(exp: number): string { const payload = btoa(JSON.stringify({ exp })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'); return `header.${payload}.signature`; }
beforeEach(() => { store.clear(); vi.stubGlobal('sessionStorage', storage); });
afterEach(() => vi.unstubAllGlobals());
describe('Day 37 authentication helpers', () => {
  it('accepts only known roles', () => { expect(isRole('ROLE_ADMIN')).toBe(true); expect(isRole('ROLE_SUPERUSER')).toBe(false); });
  it('reads expiry from a JWT', () => { expect(tokenExpiry(token(1234))).toBe(1234000); });
  it('rejects malformed JWT', () => { expect(tokenExpiry('bad')).toBeNull(); });
  it('rejects unknown roles from login', () => { expect(() => sessionFromLogin({ token: token(9999999999), username: 'a', role: 'ROLE_UNKNOWN' })).toThrow(); });
  it('rejects expired tokens', () => { expect(() => sessionFromLogin({ token: token(1), username: 'a', role: 'ROLE_ADMIN' })).toThrow(); });
  it('saves and loads a valid session', () => { const session = sessionFromLogin({ token: token(9999999999), username: 'admin', role: 'ROLE_ADMIN' }); saveSession(session); expect(readSession()).toEqual(session); });
  it('clears a session', () => { saveSession(sessionFromLogin({ token: token(9999999999), username: 'a', role: 'ROLE_ADMIN' })); clearSession(); expect(readSession()).toBeNull(); });
  it('rejects tampered session expiry', () => { saveSession(sessionFromLogin({ token: token(9999999999), username: 'a', role: 'ROLE_ADMIN' })); const key = 'campuscore.auth.session'; const value = JSON.parse(store.get(key)!); value.expiresAt += 1000; store.set(key, JSON.stringify(value)); expect(readSession()).toBeNull(); });
  it('limits admin modules to admins', () => { expect(roleCanAccess('ROLE_ADMIN', 'students')).toBe(true); expect(roleCanAccess('ROLE_STUDENT', 'students')).toBe(false); });
  it('allows teacher class access', () => { expect(roleCanAccess('ROLE_TEACHER', 'classes')).toBe(true); expect(roleCanAccess('ROLE_STUDENT', 'classes')).toBe(false); });
});
