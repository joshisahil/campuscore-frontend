import { NavLink } from "react-router-dom";
import {
  BookOpen,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
  Bell,
  X,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { roleCanAccess } from "../auth/session";
const navigation = [
  { to: "/", area: "", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/students", area: "students", label: "Students", icon: GraduationCap },
  { to: "/teachers", area: "teachers", label: "Teachers", icon: Users },
  { to: "/classes", area: "classes", label: "Classes", icon: BookOpen },
  {
    to: "/attendance",
    area: "attendance",
    label: "Attendance",
    icon: CalendarCheck,
  },
  { to: "/payments", area: "payments", label: "Payments", icon: CreditCard },
  {
    to: "/notifications",
    area: "notifications",
    label: "Notifications",
    icon: Bell,
  },
];
export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { session } = useAuth();
  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#12385a] text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-white/15 p-2">
              <School size={23} />
            </span>
            <div>
              <p className="text-lg font-bold tracking-tight">CampusCore</p>
              <p className="text-[11px] text-slate-300">School Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 pb-2 pt-7 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
          Workspace
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
          {navigation
            .filter((item) => session && roleCanAccess(session.role, item.area))
            .map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive ? "bg-white text-[#12385a] shadow-sm" : "text-slate-200 hover:bg-white/10 hover:text-white"}`
                }
              >
                <Icon size={19} />
                {label}
              </NavLink>
            ))}
        </nav>
        <div className="border-t border-white/10 p-5 text-xs text-slate-300">
          Day 37 · Secure workspace
        </div>
      </aside>
    </>
  );
}
