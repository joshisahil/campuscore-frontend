import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";

interface ModulePageProps {
  title: string;
  description: string;
}

export function ModulePage({ title, description }: ModulePageProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
      <span className="inline-flex rounded-2xl bg-sky-50 p-4 text-[#12385a]">
        <Construction size={30} />
      </span>

      <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#28668c]">
        Module scaffold
      </p>

      <h2 className="mt-2 text-3xl font-bold">{title}</h2>

      <p className="mt-4 leading-7 text-slate-600">{description}</p>

      <p className="mt-3 text-sm text-slate-500">
        Backend-connected data tables, forms, and role-based access will be
        added in later frontend milestones.
      </p>

      <Link
        to="/"
        className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#12385a] hover:underline"
      >
        <ArrowLeft size={17} />
        Back to dashboard
      </Link>
    </div>
  );
}
