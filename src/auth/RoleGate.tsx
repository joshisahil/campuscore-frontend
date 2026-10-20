import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { roleCanAccess, type Role } from "./session";

interface RoleGateProps {
  area: string;
  children: ReactNode;
}

export function canOpenModule(role: Role, area: string): boolean {
  return roleCanAccess(role, area);
}

export function RoleGate({ area, children }: RoleGateProps) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!canOpenModule(session.role, area)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}
