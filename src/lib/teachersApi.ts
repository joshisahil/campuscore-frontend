import { authenticatedRequest } from "./authApi";

export interface Teacher {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  subject: string | null;
  classSectionId: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface TeacherRequest {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  subject: string | null;
  classSectionId: number | null;
}

export function getTeachers(): Promise<Teacher[]> {
  return authenticatedRequest<Teacher[]>("/teachers");
}

export function getTeacher(id: number): Promise<Teacher> {
  return authenticatedRequest<Teacher>(`/teachers/${id}`);
}

export function getMyTeacherProfile(): Promise<Teacher> {
  return authenticatedRequest<Teacher>("/teachers/me");
}

export function createTeacher(request: TeacherRequest): Promise<Teacher> {
  return authenticatedRequest<Teacher>("/teachers", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function updateTeacher(
  id: number,
  request: TeacherRequest,
): Promise<Teacher> {
  return authenticatedRequest<Teacher>(`/teachers/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deleteTeacher(id: number): Promise<void> {
  await authenticatedRequest<null>(`/teachers/${id}`, {
    method: "DELETE",
  });
}

export function filterTeachers(teachers: Teacher[], search: string): Teacher[] {
  const query = search.trim().toLowerCase();

  if (!query) return teachers;

  return teachers.filter((teacher) => {
    const fields = [
      teacher.firstName,
      teacher.lastName,
      `${teacher.firstName} ${teacher.lastName}`,
      teacher.email,
      teacher.subject ?? "",
      String(teacher.id),
      String(teacher.userId),
    ];

    return fields.some((field) => field.toLowerCase().includes(query));
  });
}

export function getTeacherSubjects(teachers: Teacher[]): string[] {
  return Array.from(
    new Set(
      teachers
        .map((teacher) => teacher.subject?.trim())
        .filter((subject): subject is string => Boolean(subject)),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

export function validateTeacherRequest(request: TeacherRequest): string[] {
  const errors: string[] = [];

  if (!Number.isSafeInteger(request.userId) || request.userId <= 0) {
    errors.push("A valid existing teacher user ID is required.");
  }

  if (!request.firstName.trim()) {
    errors.push("First name is required.");
  } else if (request.firstName.length > 50) {
    errors.push("First name must be 50 characters or fewer.");
  }

  if (!request.lastName.trim()) {
    errors.push("Last name is required.");
  } else if (request.lastName.length > 50) {
    errors.push("Last name must be 50 characters or fewer.");
  }

  const email = request.email.trim();

  if (!email) {
    errors.push("Email is required.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
    errors.push("Enter a valid email address (100 characters maximum).");
  }

  if (request.phone !== null && request.phone.length > 20) {
    errors.push("Phone must be 20 characters or fewer.");
  }

  if (request.subject !== null && request.subject.length > 100) {
    errors.push("Subject must be 100 characters or fewer.");
  }

  if (
    request.classSectionId !== null &&
    (!Number.isSafeInteger(request.classSectionId) ||
      request.classSectionId <= 0)
  ) {
    errors.push("Class section ID must be a positive integer.");
  }

  return errors;
}
