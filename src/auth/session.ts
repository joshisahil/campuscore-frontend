export type Role = "ROLE_ADMIN" | "ROLE_TEACHER" | "ROLE_STUDENT";

export interface AuthSession {
  token: string;
  username: string;
  role: Role;
  expiresAt: number;
}

const STORAGE_KEY = "campuscore.auth.session";

const ALLOWED_ROLES: readonly Role[] = [
  "ROLE_ADMIN",
  "ROLE_TEACHER",
  "ROLE_STUDENT",
];

const ACCESS_RULES: Record<string, readonly Role[]> = {
  students: ["ROLE_ADMIN"],
  teachers: ["ROLE_ADMIN"],
  classes: ["ROLE_ADMIN", "ROLE_TEACHER"],
  attendance: ["ROLE_ADMIN", "ROLE_TEACHER", "ROLE_STUDENT"],
  payments: ["ROLE_ADMIN", "ROLE_STUDENT"],
  notifications: ["ROLE_ADMIN", "ROLE_TEACHER", "ROLE_STUDENT"],
};

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && ALLOWED_ROLES.some((role) => role === value)
  );
}

export function tokenExpiry(token: string): number | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3 || !parts[1]) {
      return null;
    }

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");

    const decoded = atob(padded);
    const parsed: unknown = JSON.parse(decoded);

    if (!parsed || typeof parsed !== "object" || !("exp" in parsed)) {
      return null;
    }

    const expiry = (parsed as { exp?: unknown }).exp;

    if (typeof expiry !== "number" || !Number.isFinite(expiry) || expiry <= 0) {
      return null;
    }

    return expiry * 1000;
  } catch {
    return null;
  }
}

export function sessionFromLogin(value: unknown): AuthSession {
  if (!value || typeof value !== "object") {
    throw new Error("Unexpected login response");
  }

  const data = value as Record<string, unknown>;

  if (
    typeof data.token !== "string" ||
    !data.token ||
    typeof data.username !== "string" ||
    !data.username ||
    !isRole(data.role)
  ) {
    throw new Error("Unexpected login response");
  }

  const expiresAt = tokenExpiry(data.token);

  if (!expiresAt || expiresAt <= Date.now()) {
    throw new Error("Invalid or expired login token");
  }

  return {
    token: data.token,
    username: data.username,
    role: data.role,
    expiresAt,
  };
}

export function readSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      clearSession();
      return null;
    }

    const session = parsed as Partial<AuthSession>;

    if (
      typeof session.token !== "string" ||
      typeof session.username !== "string" ||
      !session.username ||
      !isRole(session.role) ||
      typeof session.expiresAt !== "number" ||
      !Number.isFinite(session.expiresAt) ||
      session.expiresAt <= Date.now() ||
      tokenExpiry(session.token) !== session.expiresAt
    ) {
      clearSession();
      return null;
    }

    return session as AuthSession;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage may be unavailable in restricted environments.
  }
}

export function roleCanAccess(role: Role, area: string): boolean {
  const normalizedArea = area
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "")
    .split("/")[0];

  if (!normalizedArea) {
    return true;
  }

  const allowedRoles = ACCESS_RULES[normalizedArea];

  if (!allowedRoles) {
    return false;
  }

  return allowedRoles.includes(role);
}
