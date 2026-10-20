import { ArrowRight, BookOpen, CalendarCheck, CreditCard, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const cards = [
  { label: 'Student management', icon: GraduationCap, description: 'Student profiles and enrollment', to: '/students' },
  { label: 'Teacher management', icon: Users, description: 'Faculty profiles and assignments', to: '/teachers' },
  { label: 'Classes & sections', icon: BookOpen, description: 'Organize academic sections', to: '/classes' },
  { label: 'Attendance', icon: CalendarCheck, description: 'Track daily attendance and trends', to: '/attendance' },
  { label: 'Payments', icon: CreditCard, description: 'Fees, payments and receipts', to: '/payments' },
];

export function Dashboard() {
  return <div className="space-y-8">
    <section className="relative overflow-hidden rounded-3xl bg-[#12385a] p-7 text-white sm:p-10"><div className="relative z-10 max-w-xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100"><ShieldCheck size={14}/> Frontend foundation · Day 36</span><h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Welcome to CampusCore</h2><p className="mt-3 text-sm leading-7 text-slate-200 sm:text-base">One organized workspace for school administration. The navigation is ready; authenticated data and workflows will be connected in upcoming milestones.</p><Link to="/students" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#12385a] hover:bg-sky-50">Explore modules <ArrowRight size={17}/></Link></div><div aria-hidden className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[55px] border-white/5"/></section>
    <div><h3 className="text-lg font-bold">Management modules</h3><p className="mt-1 text-sm text-slate-500">Select a module to explore the initial frontend structure.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ label, icon: Icon, description, to }) => <Link key={to} to={to} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"><span className="inline-flex rounded-xl bg-sky-50 p-3 text-[#12385a]"><Icon size={22}/></span><h4 className="mt-5 font-semibold">{label}</h4><p className="mt-2 text-sm text-slate-500">{description}</p><div className="mt-5 flex items-center gap-1 text-sm font-semibold text-[#12385a]">Open module <ArrowRight size={16} className="transition group-hover:translate-x-1"/></div></Link>)}</div>
    <p className="text-xs text-slate-500">No live student counts, attendance metrics, or payment totals are displayed until authentication and backend integration are implemented.</p>
  </div>;
}
