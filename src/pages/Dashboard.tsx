import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { roleCanAccess } from "../auth/session";

const modules = [
  {
    title: "Student Management",
    description: "Profiles, enrollment, and student records.",
    to: "/students",
    icon: GraduationCap,
    gradient: "from-blue-500 to-cyan-500",
    tint: "bg-blue-50",
    accent: "text-blue-700",
    tag: "Academics",
  },
  {
    title: "Teacher Management",
    description: "Faculty directory and teaching assignments.",
    to: "/teachers",
    icon: UsersRound,
    gradient: "from-violet-500 to-fuchsia-500",
    tint: "bg-violet-50",
    accent: "text-violet-700",
    tag: "Faculty",
  },
  {
    title: "Classes & Sections",
    description: "Classroom structure and academic sections.",
    to: "/classes",
    icon: BookOpen,
    gradient: "from-cyan-500 to-teal-500",
    tint: "bg-cyan-50",
    accent: "text-cyan-700",
    tag: "Organization",
  },
  {
    title: "Attendance",
    description: "Attendance records, insights, and tracking.",
    to: "/attendance",
    icon: CalendarCheck2,
    gradient: "from-emerald-500 to-green-500",
    tint: "bg-emerald-50",
    accent: "text-emerald-700",
    tag: "Daily activity",
  },
  {
    title: "Payments",
    description: "Fees, transactions, and payment workflows.",
    to: "/payments",
    icon: CreditCard,
    gradient: "from-orange-400 to-rose-500",
    tint: "bg-orange-50",
    accent: "text-orange-700",
    tag: "Finance",
  },
  {
    title: "Notifications",
    description: "Communication and important updates.",
    to: "/notifications",
    icon: Bell,
    gradient: "from-indigo-500 to-blue-500",
    tint: "bg-indigo-50",
    accent: "text-indigo-700",
    tag: "Communication",
  },
];

export function Dashboard() {
  const { session } = useAuth();

  const visibleModules = modules.filter(
    (module) => session && roleCanAccess(session.role, module.to.slice(1)),
  );

  const primaryRoute = visibleModules[0]?.to ?? "/notifications";

  return (
    <div className="space-y-8">
      <section className="campus-dashboard-hero relative isolate overflow-hidden rounded-[30px] px-6 py-10 text-white sm:px-10 sm:py-14 xl:px-14">
        <div className="campus-hero-orb campus-hero-orb-one" />
        <div className="campus-hero-orb campus-hero-orb-two" />

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-cyan-100 backdrop-blur">
              <Sparkles size={15} />
              THE FUTURE OF SCHOOL MANAGEMENT
            </div>

            <h2 className="mt-6 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-4xl xl:text-5xl">
              Your campus.
              <span className="mt-1 block text-cyan-200">
                One smart workspace.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-blue-100 sm:text-base">
              Welcome to CampusCore. Bring academics, administration, and
              everyday school operations together in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={primaryRoute}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-[#12385a] shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                Explore workspace
                <ArrowRight size={18} />
              </Link>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold text-white backdrop-blur">
                <ShieldCheck size={17} />
                JWT-secured access
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[450px]">
            <div className="campus-hero-visual campus-float relative overflow-hidden rounded-[28px] border border-white/25 p-3 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1000&q=85"
                alt="Students learning together in a classroom"
                className="h-[230px] w-full rounded-[20px] object-cover sm:h-[300px]"
                loading="lazy"
              />

              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/30 bg-[#12385a]/80 p-4 text-white backdrop-blur-md">
                <p className="text-xs font-semibold text-cyan-200">
                  CAMPUSCORE
                </p>
                <p className="mt-1 text-lg font-extrabold">
                  Learn. Manage. Grow.
                </p>
              </div>
            </div>

            <div className="campus-float absolute -right-2 -top-5 rounded-2xl border border-white/30 bg-white p-3 text-blue-700 shadow-xl sm:-right-6">
              <GraduationCap size={27} />
            </div>

            <div className="absolute -bottom-4 -left-3 rounded-2xl border border-white/30 bg-white px-4 py-3 text-xs font-extrabold text-[#12385a] shadow-xl sm:-left-6">
              <CheckCircle2
                size={17}
                className="mr-2 inline text-emerald-500"
              />
              Connected workspace
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">
              Your workspace
            </p>

            <h3 className="mt-2 text-2xl font-black tracking-tight text-[#12385a] sm:text-3xl">
              Management modules
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Choose where you want to work today.
            </p>
          </div>

          <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
            {visibleModules.length} accessible modules
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleModules.map((module, index) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.to}
                to={module.to}
                className="campus-card campus-module-card group relative overflow-hidden p-6"
                style={{
                  animation: `campusAppear 600ms ease ${index * 75}ms both`,
                }}
              >
                <div
                  aria-hidden="true"
                  className={`absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${module.gradient} opacity-[0.08] blur-2xl transition group-hover:opacity-20`}
                />

                <div className="relative flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${module.gradient} text-white shadow-lg`}
                  >
                    <Icon size={25} />
                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </div>

                <div className="relative mt-7">
                  <span
                    className={`inline-flex rounded-full ${module.tint} px-3 py-1 text-[11px] font-bold ${module.accent}`}
                  >
                    {module.tag}
                  </span>

                  <h4 className="mt-4 text-lg font-extrabold text-[#12385a]">
                    {module.title}
                  </h4>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                    Open module
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="campus-glass flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
            <ShieldCheck size={24} />
          </span>

          <div>
            <h3 className="font-extrabold text-[#12385a]">
              Your workspace is protected
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Module visibility follows your account role. Backend permissions
              remain enforced separately.
            </p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-extrabold text-emerald-700">
          {session?.role.replace("ROLE_", "")} access
        </span>
      </section>
    </div>
  );
}
