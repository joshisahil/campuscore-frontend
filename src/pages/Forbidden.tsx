import { Link } from 'react-router-dom';
export function Forbidden() {
  return <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
    <h2 className="text-2xl font-bold">Access restricted</h2>
    <p className="mt-3 text-slate-600">Your account does not have permission to open this section.</p>
    <Link to="/" className="mt-6 inline-block rounded-lg bg-[#12385a] px-5 py-3 text-sm font-semibold text-white">Return to dashboard</Link>
  </div>;
}
