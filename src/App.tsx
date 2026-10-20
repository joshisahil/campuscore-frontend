import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";

import { Dashboard } from "./pages/Dashboard";
import { Forbidden } from "./pages/Forbidden";
import { Login } from "./pages/Login";
import { ModulePage } from "./pages/ModulePage";
import { Students } from "./pages/Students";
import { Teachers } from "./pages/Teachers";

import "./styles/campusMotion.css";
import "./styles/directory.css";

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

              <Route
                path="classes"
                element={
                  <ModulePage
                    title="Classes & Sections"
                    description="Class sections and academic organization will appear here."
                  />
                }
              />

              <Route
                path="attendance"
                element={
                  <ModulePage
                    title="Attendance"
                    description="Attendance recording, analytics, and risk alerts will appear here."
                  />
                }
              />

              <Route
                path="payments"
                element={
                  <ModulePage
                    title="Payments"
                    description="Payment records, student dues, and receipt workflows will appear here."
                  />
                }
              />

              <Route
                path="notifications"
                element={
                  <ModulePage
                    title="Notifications"
                    description="Notifications and user notification preferences will appear here."
                  />
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
