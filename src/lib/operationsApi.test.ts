import { beforeEach, describe, expect, it, vi } from "vitest";

const requestMock = vi.hoisted(() => vi.fn());

vi.mock("./authApi", () => ({
  authenticatedRequest: requestMock,
}));

import { operationsApi } from "./operationsApi";

describe("CampusCore operations API contracts", () => {
  beforeEach(() => {
    requestMock.mockReset();
    requestMock.mockResolvedValue({});
  });

  describe("Classes", () => {
    it("loads class sections", async () => {
      await operationsApi.classes();

      expect(requestMock).toHaveBeenCalledWith("/class-sections");
    });

    it("creates a class section", async () => {
      const body = {
        name: "Computer Engineering A",
        department: "Computer",
        year: 4,
      };

      await operationsApi.addClass(body);

      expect(requestMock).toHaveBeenCalledWith("/class-sections", {
        method: "POST",
        body: JSON.stringify(body),
      });
    });

    it("updates a class section", async () => {
      const body = {
        name: "Computer Engineering B",
        year: 3,
      };

      await operationsApi.editClass(12, body);

      expect(requestMock).toHaveBeenCalledWith("/class-sections/12", {
        method: "PUT",
        body: JSON.stringify(body),
      });
    });

    it("deletes a class section", async () => {
      await operationsApi.removeClass(12);

      expect(requestMock).toHaveBeenCalledWith("/class-sections/12", {
        method: "DELETE",
      });
    });
  });

  describe("Attendance", () => {
    it("loads attendance by class and date", async () => {
      await operationsApi.attendanceForClassDate(5, "2026-10-20");

      expect(requestMock).toHaveBeenCalledWith(
        "/attendance/class/5/date?date=2026-10-20",
      );
    });

    it("loads the current student's attendance", async () => {
      await operationsApi.myAttendance();

      expect(requestMock).toHaveBeenCalledWith("/attendance/me");
    });

    it("marks attendance", async () => {
      const body = {
        studentId: 21,
        classSectionId: 5,
        attendanceDate: "2026-10-20",
        status: "PRESENT" as const,
        remarks: "On time",
      };

      await operationsApi.markAttendance(body);

      expect(requestMock).toHaveBeenCalledWith("/attendance", {
        method: "POST",
        body: JSON.stringify(body),
      });
    });

    it("updates attendance", async () => {
      const body = {
        studentId: 21,
        classSectionId: 5,
        attendanceDate: "2026-10-20",
        status: "LATE" as const,
        remarks: "Arrived late",
      };

      await operationsApi.updateAttendance(30, body);

      expect(requestMock).toHaveBeenCalledWith("/attendance/30", {
        method: "PUT",
        body: JSON.stringify(body),
      });
    });
  });

  describe("Payments", () => {
    it("loads administrator payment records", async () => {
      await operationsApi.payments();

      expect(requestMock).toHaveBeenCalledWith("/payments");
    });

    it("loads student payment records", async () => {
      await operationsApi.myPayments();

      expect(requestMock).toHaveBeenCalledWith("/payments/me");
    });

    it("loads student dues", async () => {
      await operationsApi.myDues();

      expect(requestMock).toHaveBeenCalledWith("/payments/me/dues");
    });

    it("creates a payment", async () => {
      const body = {
        studentId: 21,
        amount: 2500,
        currency: "INR",
        dueDate: "2026-11-15",
      };

      await operationsApi.addPayment(body);

      expect(requestMock).toHaveBeenCalledWith("/payments", {
        method: "POST",
        body: JSON.stringify(body),
      });
    });

    it("updates a payment", async () => {
      const body = {
        studentId: 21,
        amount: 3000,
        currency: "INR",
      };

      await operationsApi.editPayment(42, body);

      expect(requestMock).toHaveBeenCalledWith("/payments/42", {
        method: "PUT",
        body: JSON.stringify(body),
      });
    });

    it("updates payment status", async () => {
      await operationsApi.setPaymentStatus(42, "SUCCESS");

      expect(requestMock).toHaveBeenCalledWith("/payments/42/status", {
        method: "PATCH",
        body: JSON.stringify({
          status: "SUCCESS",
        }),
      });
    });

    it("deletes a payment", async () => {
      await operationsApi.removePayment(42);

      expect(requestMock).toHaveBeenCalledWith("/payments/42", {
        method: "DELETE",
      });
    });
  });

  describe("Notifications", () => {
    it("loads the current user's notifications", async () => {
      await operationsApi.notifications();

      expect(requestMock).toHaveBeenCalledWith("/notifications/me");
    });

    it("loads unread notification count", async () => {
      await operationsApi.unreadCount();

      expect(requestMock).toHaveBeenCalledWith(
        "/notifications/me/unread-count",
      );
    });

    it("marks a notification as read", async () => {
      await operationsApi.markRead(17);

      expect(requestMock).toHaveBeenCalledWith("/notifications/17/read", {
        method: "PATCH",
      });
    });

    it("loads notification preferences", async () => {
      await operationsApi.preferences();

      expect(requestMock).toHaveBeenCalledWith("/notifications/preferences/me");
    });

    it("updates notification preferences", async () => {
      const body = {
        notificationsEnabled: true,
        attendanceWarningsEnabled: true,
        generalEnabled: false,
      };

      await operationsApi.savePreferences(body);

      expect(requestMock).toHaveBeenCalledWith(
        "/notifications/preferences/me",
        {
          method: "PUT",
          body: JSON.stringify(body),
        },
      );
    });

    it("sends a notification", async () => {
      const body = {
        recipientUserId: 21,
        title: "School announcement",
        message: "Please check the notice board.",
        type: "GENERAL" as const,
      };

      await operationsApi.sendNotification(body);

      expect(requestMock).toHaveBeenCalledWith("/notifications", {
        method: "POST",
        body: JSON.stringify(body),
      });
    });
  });

  describe("Error handling", () => {
    it("propagates backend errors", async () => {
      requestMock.mockRejectedValueOnce(new Error("Forbidden"));

      await expect(operationsApi.payments()).rejects.toThrow("Forbidden");
    });

    it("returns the backend response", async () => {
      const classes = [
        {
          id: 1,
          name: "Computer Engineering A",
          year: 4,
        },
      ];

      requestMock.mockResolvedValueOnce(classes);

      await expect(operationsApi.classes()).resolves.toEqual(classes);
    });
  });
});
