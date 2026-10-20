import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { ModulePage } from './pages/ModulePage';

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/login" element={<Login/>}/>
    <Route element={<AppLayout/>}>
      <Route index element={<Dashboard/>}/>
      <Route path="students" element={<ModulePage title="Students" description="Student records, profiles, and class enrollment will appear here."/>}/>
      <Route path="teachers" element={<ModulePage title="Teachers" description="Faculty profiles, subject assignments, and teacher information will appear here."/>}/>
      <Route path="classes" element={<ModulePage title="Classes & Sections" description="Class sections and academic organization will appear here."/>}/>
      <Route path="attendance" element={<ModulePage title="Attendance" description="Attendance recording, analytics, and risk alerts will appear here."/>}/>
      <Route path="payments" element={<ModulePage title="Payments" description="Payment records, student dues, and receipt workflows will appear here."/>}/>
      <Route path="notifications" element={<ModulePage title="Notifications" description="Notifications and user notification preferences will appear here."/>}/>
      <Route path="*" element={<ModulePage title="Page not found" description="This route is not available in CampusCore."/>}/>
    </Route>
  </Routes></BrowserRouter>;
}
