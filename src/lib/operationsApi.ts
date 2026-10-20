import { authenticatedRequest } from "../lib/authApi";

export type Role = "ROLE_ADMIN" | "ROLE_TEACHER" | "ROLE_STUDENT";
export type ClassSection = {
  id: number;
  name: string;
  department?: string | null;
  year?: number | null;
};
export type ClassSectionInput = {
  name: string;
  department?: string;
  year?: number;
};
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";
export type Attendance = {
  id: number;
  studentId: number;
  classSectionId: number;
  attendanceDate: string;
  status: AttendanceStatus;
  remarks?: string | null;
};
export type AttendanceInput = Omit<Attendance, "id">;
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
export type Payment = {
  id: number;
  studentId: number;
  amount: number;
  currency?: string | null;
  status: PaymentStatus;
  dueDate?: string | null;
  paidAt?: string | null;
  transactionRef?: string | null;
  paymentMethod?: string | null;
};
export type PaymentInput = {
  studentId: number;
  amount: number;
  currency?: string;
  dueDate?: string;
};
export type PaymentDues = {
  totalOutstanding: number;
  totalOverdue: number;
  pendingPaymentCount: number;
  overduePaymentCount: number;
};
export type NotificationType =
  | "ATTENDANCE_WARNING"
  | "ATTENDANCE_CRITICAL"
  | "ATTENDANCE_IMPROVED"
  | "GENERAL";
export type Notification = {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  readAt?: string | null;
};
export type NotificationPreferences = {
  notificationsEnabled: boolean;
  attendanceWarningsEnabled: boolean;
  generalEnabled: boolean;
};
export type NotificationInput = {
  recipientUserId: number;
  title: string;
  message: string;
  type: NotificationType;
};
const json = (value: unknown) => JSON.stringify(value);
export const operationsApi = {
  classes: () => authenticatedRequest<ClassSection[]>("/class-sections"),
  addClass: (body: ClassSectionInput) =>
    authenticatedRequest<ClassSection>("/class-sections", {
      method: "POST",
      body: json(body),
    }),
  editClass: (id: number, body: ClassSectionInput) =>
    authenticatedRequest<ClassSection>(`/class-sections/${id}`, {
      method: "PUT",
      body: json(body),
    }),
  removeClass: (id: number) =>
    authenticatedRequest<void>(`/class-sections/${id}`, { method: "DELETE" }),
  attendanceForClassDate: (id: number, date: string) =>
    authenticatedRequest<Attendance[]>(
      `/attendance/class/${id}/date?date=${encodeURIComponent(date)}`,
    ),
  myAttendance: () => authenticatedRequest<Attendance[]>("/attendance/me"),
  markAttendance: (body: AttendanceInput) =>
    authenticatedRequest<Attendance>("/attendance", {
      method: "POST",
      body: json(body),
    }),
  updateAttendance: (id: number, body: AttendanceInput) =>
    authenticatedRequest<Attendance>(`/attendance/${id}`, {
      method: "PUT",
      body: json(body),
    }),
  payments: () => authenticatedRequest<Payment[]>("/payments"),
  myPayments: () => authenticatedRequest<Payment[]>("/payments/me"),
  myDues: () => authenticatedRequest<PaymentDues>("/payments/me/dues"),
  addPayment: (body: PaymentInput) =>
    authenticatedRequest<Payment>("/payments", {
      method: "POST",
      body: json(body),
    }),
  editPayment: (id: number, body: PaymentInput) =>
    authenticatedRequest<Payment>(`/payments/${id}`, {
      method: "PUT",
      body: json(body),
    }),
  setPaymentStatus: (id: number, status: PaymentStatus) =>
    authenticatedRequest<Payment>(`/payments/${id}/status`, {
      method: "PATCH",
      body: json({ status }),
    }),
  removePayment: (id: number) =>
    authenticatedRequest<void>(`/payments/${id}`, { method: "DELETE" }),
  notifications: () =>
    authenticatedRequest<Notification[]>("/notifications/me"),
  unreadCount: () =>
    authenticatedRequest<{ unreadCount: number }>(
      "/notifications/me/unread-count",
    ),
  markRead: (id: number) =>
    authenticatedRequest<Notification>(`/notifications/${id}/read`, {
      method: "PATCH",
    }),
  preferences: () =>
    authenticatedRequest<NotificationPreferences>(
      "/notifications/preferences/me",
    ),
  savePreferences: (body: NotificationPreferences) =>
    authenticatedRequest<NotificationPreferences>(
      "/notifications/preferences/me",
      { method: "PUT", body: json(body) },
    ),
  sendNotification: (body: NotificationInput) =>
    authenticatedRequest<Notification>("/notifications", {
      method: "POST",
      body: json(body),
    }),
};
