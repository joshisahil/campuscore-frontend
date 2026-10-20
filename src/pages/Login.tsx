import { Link } from 'react-router-dom';
import { LockKeyhole, School, ArrowLeft } from 'lucide-react';

export function Login() {
  return <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5 py-10"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"><div className="inline-flex rounded-2xl bg-[#12385a] p-3 text-white"><School size={28}/></div><h1 className="mt-6 text-3xl font-bold tracking-tight">Sign in to CampusCore</h1><p className="mt-3 text-sm leading-6 text-slate-500">Authentication UI and JWT integration are scheduled for Day 37. This screen intentionally does not collect or transmit credentials yet.</p><div className="mt-8 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm text-[#12385a]"><LockKeyhole size={20} className="mb-2"/> Login functionality is coming next. Your existing Spring Boot authentication remains unchanged.</div><Link to="/" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#12385a] hover:underline"><ArrowLeft size={17}/> Return to dashboard</Link></div></main>;
}
