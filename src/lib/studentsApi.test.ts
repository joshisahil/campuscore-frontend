import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteStudent,
  filterStudents,
  getStudent,
  getStudents,
  updateStudent,
  type Student,
} from "./studentsApi";

import { authenticatedRequest } from "./authApi";

vi.mock("./authApi", () => ({
  authenticatedRequest: vi.fn(),
}));

const mockRequest = vi.mocked(authenticatedRequest);

const sampleStudents: Student[] = [
  {
    id: 1,
    rollNumber: "CS001",
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav@example.com",
    phone: "9876543210",
    dateOfBirth: "2005-04-10",
    address: "Mumbai",
    className: "CS-3A",
    admissionDate: "2023-06-01",
    profilePhotoUrl: null,
  },
  {
    id: 2,
    rollNumber: "CS002",
    firstName: "Priya",
    lastName: "Patil",
    email: "priya@example.com",
    phone: null,
    dateOfBirth: null,
    address: null,
    className: "CS-3B",
    admissionDate: null,
    profilePhotoUrl: null,
  },
];

describe("Day 38 student management API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves the student list", async () => {
    mockRequest.mockResolvedValueOnce(sampleStudents);

    const result = await getStudents();

    expect(mockRequest).toHaveBeenCalledWith("/students");
    expect(result).toEqual(sampleStudents);
  });

  it("retrieves a student by ID", async () => {
    mockRequest.mockResolvedValueOnce(sampleStudents[0]);

    const result = await getStudent(1);

    expect(mockRequest).toHaveBeenCalledWith("/students/1");
    expect(result.id).toBe(1);
  });

  it("updates a student using PUT", async () => {
    const payload = {
      firstName: "Aarav",
      lastName: "Sharma",
      phone: "9999999999",
    };

    mockRequest.mockResolvedValueOnce({
      ...sampleStudents[0],
      ...payload,
    });

    await updateStudent(1, payload);

    expect(mockRequest).toHaveBeenCalledWith("/students/1", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  });

  it("deletes a student using DELETE", async () => {
    mockRequest.mockResolvedValueOnce(null);

    await deleteStudent(2);

    expect(mockRequest).toHaveBeenCalledWith("/students/2", {
      method: "DELETE",
    });
  });

  it("returns all students for an empty search", () => {
    expect(filterStudents(sampleStudents, "")).toEqual(sampleStudents);
  });

  it("searches by first name", () => {
    expect(filterStudents(sampleStudents, "aarav")).toEqual([
      sampleStudents[0],
    ]);
  });

  it("searches by full name", () => {
    expect(filterStudents(sampleStudents, "Priya Patil")).toEqual([
      sampleStudents[1],
    ]);
  });

  it("searches by roll number", () => {
    expect(filterStudents(sampleStudents, "CS002")).toEqual([
      sampleStudents[1],
    ]);
  });

  it("searches by email", () => {
    expect(filterStudents(sampleStudents, "aarav@example.com")).toEqual([
      sampleStudents[0],
    ]);
  });

  it("searches by class name", () => {
    expect(filterStudents(sampleStudents, "CS-3B")).toEqual([
      sampleStudents[1],
    ]);
  });

  it("ignores search capitalization and extra spaces", () => {
    expect(filterStudents(sampleStudents, "  PRIYA  ")).toEqual([
      sampleStudents[1],
    ]);
  });

  it("returns an empty list for no matches", () => {
    expect(filterStudents(sampleStudents, "unknown")).toEqual([]);
  });
});
