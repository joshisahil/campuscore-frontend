import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, ArrowUpRight, CircleHelp } from 'lucide-react';
import { Sidebar } from './Sidebar';

const titles: Record<string, string> = { '/': 'Dashboard', '/students': 'Students', '/teachers': 'Teachers', '/classes': 'Classes', '/attendance': 'Attendance', '/payments': 'Payments', '/notifications': 'Notifications' };

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'CampusCore';
  return <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
    <Sidebar open={open} onClose={() => setOpen(false)} />
    <div className="lg:pl-64">
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur sm:px-8">
        <div className="flex items-center gap-4"><button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu size={22}/></button><div><p className="text-xs text-slate-500">CampusCore / Workspace</p><h1 className="text-xl font-bold tracking-tight">{title}</h1></div></div>
        <div className="flex items-center gap-3"><a href="http://localhost:8081/swagger-ui/index.html" target="_blank" rel="noreferrer" className="hidden items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 sm:flex"><CircleHelp size={16}/> API Docs <ArrowUpRight size={14}/></a><Link to="/login" className="rounded-lg bg-[#12385a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1b4f78]">Login</Link></div>
      </header>
      <main className="mx-auto max-w-7xl p-5 sm:p-8"><Outlet/></main>
    </div>
  </div>;
}
