import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import {
  Bell,
  BookOpen,
  CalendarCheck2,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  School,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";

import { useAuth } from "../auth/AuthContext";
import { roleCanAccess } from "../auth/session";

const navigation = [
  {
    to: "/",
    area: "",
    label: "Overview",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/students",
    area: "students",
    label: "Students",
    icon: GraduationCap,
  },
  {
    to: "/teachers",
    area: "teachers",
    label: "Teachers",
    icon: UsersRound,
  },
  {
    to: "/classes",
    area: "classes",
    label: "Classes",
    icon: BookOpen,
  },
  {
    to: "/attendance",
    area: "attendance",
    label: "Attendance",
    icon: CalendarCheck2,
  },
  {
    to: "/payments",
    area: "payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    to: "/notifications",
    area: "notifications",
    label: "Notifications",
    icon: Bell,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { session } = useAuth();

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  function handleSidebarKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Tab") {
      return;
    }

    const sidebar = sidebarRef.current;

    if (!sidebar) return;

    const focusable = Array.from(
      sidebar.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]',
      ),
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="campus-sidebar-backdrop fixed inset-0 z-30 bg-slate-950/65 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          tabIndex={-1}
        />
      )}

      <aside
        ref={sidebarRef}
        id="campus-sidebar"
        aria-label="CampusCore navigation"
        onKeyDown={handleSidebarKeyDown}
        className={`campus-sidebar campus-workspace-sidebar fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col overflow-hidden text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative z-10 flex h-[94px] shrink-0 items-center justify-between border-b border-white/10 px-6">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg">
              <School size={25} />
            </span>

            <span className="min-w-0">
              <span className="block text-xl font-black tracking-tight">
                CampusCore
              </span>

              <span className="block text-[11px] tracking-wide text-blue-100">
                School Management
              </span>
            </span>
          </NavLink>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="campus-sidebar-close rounded-xl p-2 text-white/80 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="campus-sidebar-scroll relative z-10 flex-1 overflow-y-auto px-3 pb-6 pt-8">
          <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-200">
            Main workspace
          </p>

          <nav className="space-y-1.5" aria-label="Main navigation">
            {navigation
              .filter(
                (item) => session && roleCanAccess(session.role, item.area),
              )
              .map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `campus-sidebar-link group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "campus-sidebar-link-active bg-white text-[#12385a] shadow-xl shadow-black/10"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "bg-white/10 text-blue-100 group-hover:bg-white/20"
                        }`}
                      >
                        <Icon size={19} />
                      </span>

                      <span className="min-w-0 flex-1">{label}</span>

                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full bg-blue-500"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
          </nav>

          <div className="campus-sidebar-feature relative mt-10 overflow-hidden rounded-3xl border border-white/20 p-5">
            <span className="mb-4 inline-flex rounded-xl bg-white/15 p-2.5">
              <Sparkles size={20} />
            </span>

            <h3 className="text-base font-extrabold">Smarter campus.</h3>

            <p className="mt-2 text-xs leading-6 text-blue-100">
              Manage your school from one connected workspace.
            </p>

            <div
              aria-hidden="true"
              className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl"
            />
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xs font-black">
              {session?.username.slice(0, 2).toUpperCase() ?? "CC"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">
                {session?.username}
              </p>

              <p className="mt-1 text-[11px] text-blue-200">
                {session?.role.replace("ROLE_", "")}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
