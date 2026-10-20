import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Bell,
  CircleHelp,
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../auth/AuthContext";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/students": "Students",
  "/teachers": "Teachers",
  "/classes": "Classes & Sections",
  "/attendance": "Attendance",
  "/payments": "Payments",
  "/notifications": "Notifications",
  "/forbidden": "Access restricted",
};

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { session, logout } = useAuth();

  const role = session?.role.replace("ROLE_", "") ?? "USER";
  const initials = session?.username.slice(0, 2).toUpperCase() ?? "CC";

  return (
    <div className="campus-app min-h-screen text-slate-900">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="min-w-0 lg:pl-[272px]">
        <header className="campus-topbar sticky top-0 z-20">
          <div className="flex min-h-[84px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setOpen(true)}
                className="campus-icon-button lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-slate-500">
                  <span className="hidden sm:inline">CAMPUSCORE</span>
                  <span className="hidden sm:inline">/</span>
                  <span>WORKSPACE</span>
                </div>

                <h1 className="truncate text-lg font-extrabold tracking-tight text-[#12385a] sm:text-2xl">
                  {titles[pathname] ?? "CampusCore"}
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 xl:flex">
                <ShieldCheck size={15} />
                Secure workspace
              </div>

              <a
                href="http://localhost:8081/swagger-ui/index.html"
                target="_blank"
                rel="noreferrer"
                className="campus-icon-button hidden sm:inline-flex"
                aria-label="Open API documentation"
                title="API documentation"
              >
                <CircleHelp size={19} />
                <ArrowUpRight size={12} />
              </a>

              <div className="relative hidden sm:block">
                <div className="campus-icon-button" aria-hidden="true">
                  <Bell size={19} />
                </div>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500" />
              </div>

              <div className="hidden min-w-0 text-right md:block">
                <p className="max-w-44 truncate text-sm font-bold text-[#12385a]">
                  {session?.username}
                </p>
                <p className="text-xs font-medium text-slate-500">{role}</p>
              </div>

              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-xs font-extrabold text-white shadow-lg shadow-blue-200"
                title={session?.username ?? "User"}
              >
                {initials}
              </div>

              <button
                type="button"
                onClick={logout}
                aria-label="Logout"
                title="Logout"
                className="campus-icon-button text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={19} />
              </button>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          className="relative mx-auto min-h-[calc(100vh-84px)] max-w-[1600px] p-4 sm:p-7 lg:p-9"
        >
          <div key={pathname} className="campus-reveal">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
