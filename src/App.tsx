import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
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
                  <div className="campus-directory">
                    <Students />
                  </div>
                }
              />
              <Route
                path="teachers"
                element={
                  <div className="campus-directory">
                    <Teachers />
                  </div>
                }
              />
              <Route path="classes" element={<Classes />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="forbidden" element={<Forbidden />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
