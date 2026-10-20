import { beforeEach, describe, expect, it, vi } from "vitest";

import { authenticatedRequest } from "./authApi";

import {
  createTeacher,
  deleteTeacher,
  filterTeachers,
  getMyTeacherProfile,
  getTeacher,
  getTeacherSubjects,
  getTeachers,
  updateTeacher,
  validateTeacherRequest,
  type Teacher,
  type TeacherRequest,
} from "./teachersApi";

vi.mock("./authApi", () => ({
  authenticatedRequest: vi.fn(),
}));

const mockRequest = vi.mocked(authenticatedRequest);

const teachers: Teacher[] = [
  {
    id: 1,
    userId: 21,
    firstName: "Anita",
    lastName: "Sharma",
    email: "anita@example.com",
    phone: "9876543210",
    subject: "Mathematics",
    classSectionId: 3,
    createdAt: "2026-10-01T10:00:00",
    updatedAt: "2026-10-02T10:00:00",
  },
  {
    id: 2,
    userId: 22,
    firstName: "Rahul",
    lastName: "Patil",
    email: "rahul@example.com",
    phone: null,
    subject: "Physics",
    classSectionId: null,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: 3,
    userId: 23,
    firstName: "Priya",
    lastName: "Desai",
    email: "priya@example.com",
    phone: null,
    subject: "Mathematics",
    classSectionId: 4,
    createdAt: null,
    updatedAt: null,
  },
];

const validRequest: TeacherRequest = {
  userId: 21,
  firstName: "Anita",
  lastName: "Sharma",
  email: "anita@example.com",
  phone: "9876543210",
  subject: "Mathematics",
  classSectionId: 3,
};

describe("Day 39 teacher API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves all teachers", async () => {
    mockRequest.mockResolvedValueOnce(teachers);

    const result = await getTeachers();

    expect(mockRequest).toHaveBeenCalledWith("/teachers");
    expect(result).toEqual(teachers);
  });

  it("retrieves a teacher by ID", async () => {
    mockRequest.mockResolvedValueOnce(teachers[0]);

    const result = await getTeacher(1);

    expect(mockRequest).toHaveBeenCalledWith("/teachers/1");
    expect(result.id).toBe(1);
  });

  it("retrieves the logged-in teacher profile", async () => {
    mockRequest.mockResolvedValueOnce(teachers[0]);

    await getMyTeacherProfile();

    expect(mockRequest).toHaveBeenCalledWith("/teachers/me");
  });

  it("creates a teacher with POST", async () => {
    mockRequest.mockResolvedValueOnce(teachers[0]);

    await createTeacher(validRequest);

    expect(mockRequest).toHaveBeenCalledWith("/teachers", {
      method: "POST",
      body: JSON.stringify(validRequest),
    });
  });

  it("updates a teacher with the complete PUT request", async () => {
    mockRequest.mockResolvedValueOnce(teachers[0]);

    await updateTeacher(1, validRequest);

    expect(mockRequest).toHaveBeenCalledWith("/teachers/1", {
      method: "PUT",
      body: JSON.stringify(validRequest),
    });
  });

  it("deletes a teacher with DELETE", async () => {
    mockRequest.mockResolvedValueOnce(null);

    await deleteTeacher(2);

    expect(mockRequest).toHaveBeenCalledWith("/teachers/2", {
      method: "DELETE",
    });
  });
});

describe("Day 39 teacher search", () => {
  it("returns all teachers for an empty search", () => {
    expect(filterTeachers(teachers, "")).toEqual(teachers);
  });

  it("searches by first name", () => {
    expect(filterTeachers(teachers, "anita")).toEqual([teachers[0]]);
  });

  it("searches by full name", () => {
    expect(filterTeachers(teachers, "Rahul Patil")).toEqual([teachers[1]]);
  });

  it("searches by email", () => {
    expect(filterTeachers(teachers, "priya@example.com")).toEqual([
      teachers[2],
    ]);
  });

  it("searches by subject", () => {
    expect(filterTeachers(teachers, "physics")).toEqual([teachers[1]]);
  });

  it("searches by teacher ID", () => {
    expect(filterTeachers(teachers, "3")).toContain(teachers[2]);
  });

  it("searches by linked user ID", () => {
    expect(filterTeachers(teachers, "22")).toEqual([teachers[1]]);
  });

  it("ignores capitalization and surrounding spaces", () => {
    expect(filterTeachers(teachers, "  ANITA  ")).toEqual([teachers[0]]);
  });

  it("returns an empty list when no teacher matches", () => {
    expect(filterTeachers(teachers, "Biology")).toEqual([]);
  });

  it("returns unique sorted subjects", () => {
    expect(getTeacherSubjects(teachers)).toEqual(["Mathematics", "Physics"]);
  });
});

describe("Day 39 teacher request validation", () => {
  it("accepts a valid teacher request", () => {
    expect(validateTeacherRequest(validRequest)).toEqual([]);
  });

  it("rejects a missing user ID", () => {
    const result = validateTeacherRequest({
      ...validRequest,
      userId: 0,
    });

    expect(result).toContain("A valid existing teacher user ID is required.");
  });

  it("rejects an invalid user ID", () => {
    const result = validateTeacherRequest({
      ...validRequest,
      userId: 2.5,
    });

    expect(result.length).toBeGreaterThan(0);
  });

  it("requires a first name", () => {
    const result = validateTeacherRequest({
      ...validRequest,
      firstName: " ",
    });

    expect(result).toContain("First name is required.");
  });

  it("requires a last name", () => {
    const result = validateTeacherRequest({
      ...validRequest,
      lastName: "",
    });

    expect(result).toContain("Last name is required.");
  });

  it("rejects an invalid email", () => {
    const result = validateTeacherRequest({
      ...validRequest,
      email: "invalid-email",
    });

    expect(result.some((error) => error.includes("email"))).toBe(true);
  });

  it("rejects an overly long first name", () => {
    const result = validateTeacherRequest({
      ...validRequest,
      firstName: "A".repeat(51),
    });

    expect(result.length).toBeGreaterThan(0);
  });

  it("rejects an overly long phone number", () => {
    const result = validateTeacherRequest({
      ...validRequest,
      phone: "1".repeat(21),
    });

    expect(result.length).toBeGreaterThan(0);
  });

  it("rejects an invalid class section ID", () => {
    const result = validateTeacherRequest({
      ...validRequest,
      classSectionId: -1,
    });

    expect(result.length).toBeGreaterThan(0);
  });

  it("accepts a teacher without optional fields", () => {
    const result = validateTeacherRequest({
      ...validRequest,
      phone: null,
      subject: null,
      classSectionId: null,
    });

    expect(result).toEqual([]);
  });
});
