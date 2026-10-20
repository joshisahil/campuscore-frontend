import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { RoleGate } from "./auth/RoleGate";

import { AppLayout } from "./components/AppLayout";

import { Dashboard } from "./pages/Dashboard";
import { Forbidden } from "./pages/Forbidden";
import { Login } from "./pages/Login";

import { Students } from "./pages/Students";
import { Teachers } from "./pages/Teachers";
import { Classes } from "./pages/Classes";
import { AttendancePage } from "./pages/Attendance";
import { PaymentsPage } from "./pages/Payments";
import { NotificationsPage } from "./pages/Notifications";

import "./styles/campusMotion.css";
import "./styles/directory.css";
import "./styles/operations.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />

              <Route
                path="students"
                element={
                  <RoleGate area="students">
                    <div className="campus-directory">
                      <Students />
                    </div>
                  </RoleGate>
                }
              />

              <Route
                path="teachers"
                element={
                  <RoleGate area="teachers">
                    <div className="campus-directory">
                      <Teachers />
                    </div>
                  </RoleGate>
                }
              />

              <Route
                path="classes"
                element={
                  <RoleGate area="classes">
                    <Classes />
                  </RoleGate>
                }
              />

              <Route
                path="attendance"
                element={
                  <RoleGate area="attendance">
                    <AttendancePage />
                  </RoleGate>
                }
              />

              <Route
                path="payments"
                element={
                  <RoleGate area="payments">
                    <PaymentsPage />
                  </RoleGate>
                }
              />

              <Route
                path="notifications"
                element={
                  <RoleGate area="notifications">
                    <NotificationsPage />
                  </RoleGate>
                }
              />

              <Route path="forbidden" element={<Forbidden />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
