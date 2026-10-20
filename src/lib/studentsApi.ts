import { authenticatedRequest } from "./authApi";

export interface Student {
  id: number;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  className: string | null;
  admissionDate: string | null;
  profilePhotoUrl: string | null;
}

export interface StudentUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  profilePhotoUrl?: string;
}

export async function getStudents(): Promise<Student[]> {
  return authenticatedRequest<Student[]>("/students");
}

export async function getStudent(id: number): Promise<Student> {
  return authenticatedRequest<Student>(`/students/${id}`);
}

export async function updateStudent(
  id: number,
  data: StudentUpdateRequest,
): Promise<Student> {
  return authenticatedRequest<Student>(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStudent(id: number): Promise<void> {
  await authenticatedRequest<null>(`/students/${id}`, {
    method: "DELETE",
  });
}

export function filterStudents(students: Student[], search: string): Student[] {
  const query = search.trim().toLowerCase();

  if (!query) return students;

  return students.filter((student) => {
    const fields = [
      student.firstName,
      student.lastName,
      `${student.firstName} ${student.lastName}`,
      student.rollNumber,
      student.email,
      student.className ?? "",
    ];

    return fields.some((field) => field.toLowerCase().includes(query));
  });
}
