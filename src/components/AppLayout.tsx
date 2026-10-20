import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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

import "../styles/workspacePolish.css";

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
  const [menuOpen, setMenuOpen] = useState(false);

  const { pathname } = useLocation();
  const { session, logout } = useAuth();

  const role = session?.role.replace("ROLE_", "") ?? "USER";

  const initials = session?.username.slice(0, 2).toUpperCase() ?? "CC";

  const pageTitle = titles[pathname] ?? "CampusCore";

  // Close mobile navigation when the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock background scrolling while the mobile drawer is open.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Support Escape for closing the mobile drawer.
  useEffect(() => {
    if (!menuOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <div className="campus-app campus-workspace min-h-screen text-slate-900">
      <a href="#main-content" className="campus-skip-link">
        Skip to main content
      </a>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="campus-workspace-content min-w-0 lg:pl-[272px]">
        <header className="campus-topbar campus-workspace-topbar sticky top-0 z-20">
          <div className="campus-workspace-topbar-inner flex items-center justify-between gap-3 px-4 sm:px-7 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                aria-expanded={menuOpen}
                aria-controls="campus-sidebar"
                onClick={() => setMenuOpen(true)}
                className="campus-icon-button campus-menu-toggle lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div className="min-w-0">
                <div className="campus-workspace-breadcrumb mb-1 flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-slate-500">
                  <span className="hidden sm:inline">CAMPUSCORE</span>
                  <span className="hidden sm:inline">/</span>
                  <span>WORKSPACE</span>
                </div>

                <h1 className="campus-workspace-page-title truncate text-lg font-extrabold tracking-tight text-[#12385a] sm:text-2xl">
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div className="campus-workspace-actions flex shrink-0 items-center gap-2 sm:gap-3">
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

              <Link
                to="/notifications"
                className="campus-icon-button campus-notification-link"
                aria-label="Open notifications"
                title="Notifications"
              >
                <Bell size={19} />
              </Link>

              <div className="hidden min-w-0 text-right md:block">
                <p className="max-w-44 truncate text-sm font-bold text-[#12385a]">
                  {session?.username}
                </p>
                <p className="text-xs font-medium text-slate-500">{role}</p>
              </div>

              <div
                className="campus-workspace-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-xs font-extrabold text-white shadow-lg shadow-blue-200"
                title={session?.username ?? "User"}
                aria-label={`Signed in as ${session?.username ?? "user"}`}
              >
                {initials}
              </div>

              <button
                type="button"
                onClick={logout}
                aria-label="Logout"
                title="Logout"
                className="campus-icon-button campus-logout-button text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={19} />
              </button>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="campus-workspace-main relative mx-auto min-h-[calc(100vh-84px)] max-w-[1600px] p-4 sm:p-7 lg:p-9"
        >
          <div key={pathname} className="campus-reveal min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
