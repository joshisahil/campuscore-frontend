import { describe, expect, it } from "vitest";

import { roleCanAccess, type Role } from "./session";

const ADMIN: Role = "ROLE_ADMIN";
const TEACHER: Role = "ROLE_TEACHER";
const STUDENT: Role = "ROLE_STUDENT";

describe("CampusCore role-based access", () => {
  it("allows all roles to access the dashboard", () => {
    for (const role of [ADMIN, TEACHER, STUDENT]) {
      expect(roleCanAccess(role, "")).toBe(true);
      expect(roleCanAccess(role, "/")).toBe(true);
    }
  });

  it("allows only admins to manage students", () => {
    expect(roleCanAccess(ADMIN, "students")).toBe(true);
    expect(roleCanAccess(TEACHER, "students")).toBe(false);
    expect(roleCanAccess(STUDENT, "students")).toBe(false);
  });

  it("allows only admins to manage teachers", () => {
    expect(roleCanAccess(ADMIN, "teachers")).toBe(true);
    expect(roleCanAccess(TEACHER, "teachers")).toBe(false);
    expect(roleCanAccess(STUDENT, "teachers")).toBe(false);
  });

  it("allows admins and teachers to view classes", () => {
    expect(roleCanAccess(ADMIN, "classes")).toBe(true);
    expect(roleCanAccess(TEACHER, "classes")).toBe(true);
    expect(roleCanAccess(STUDENT, "classes")).toBe(false);
  });

  it("allows all roles to access attendance", () => {
    for (const role of [ADMIN, TEACHER, STUDENT]) {
      expect(roleCanAccess(role, "attendance")).toBe(true);
    }
  });

  it("restricts payments to admins and students", () => {
    expect(roleCanAccess(ADMIN, "payments")).toBe(true);
    expect(roleCanAccess(TEACHER, "payments")).toBe(false);
    expect(roleCanAccess(STUDENT, "payments")).toBe(true);
  });

  it("allows all roles to access notifications", () => {
    for (const role of [ADMIN, TEACHER, STUDENT]) {
      expect(roleCanAccess(role, "notifications")).toBe(true);
    }
  });

  it("blocks unknown modules", () => {
    for (const role of [ADMIN, TEACHER, STUDENT]) {
      expect(roleCanAccess(role, "unknown")).toBe(false);
      expect(roleCanAccess(role, "settings")).toBe(false);
    }
  });

  it("handles URL-style paths", () => {
    expect(roleCanAccess(ADMIN, "/students")).toBe(true);
    expect(roleCanAccess(TEACHER, "/students")).toBe(false);
    expect(roleCanAccess(STUDENT, "/payments")).toBe(true);
  });

  it("handles query strings and fragments", () => {
    expect(roleCanAccess(STUDENT, "/payments?status=PENDING")).toBe(true);

    expect(roleCanAccess(TEACHER, "/payments#history")).toBe(false);
  });

  it("blocks students from nested teacher routes", () => {
    expect(roleCanAccess(STUDENT, "/teachers/10")).toBe(false);
  });

  it("allows admins to access nested student routes", () => {
    expect(roleCanAccess(ADMIN, "/students/10")).toBe(true);
  });
});
