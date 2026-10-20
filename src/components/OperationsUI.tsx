import type { ReactNode } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";

export function OperationsShell({
  title,
  description,
  icon,
  children,
  action,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="cc-operations space-y-6">
      <header className="cc-operations-hero flex flex-wrap items-center justify-between gap-5 rounded-3xl p-6 text-white sm:p-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/20 p-4">{icon}</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
              CampusCore / Management
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-blue-100">{description}</p>
          </div>
        </div>
        {action}
      </header>
      {children}
    </div>
  );
}
export function Notice({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
    >
      <AlertCircle size={18} className="shrink-0" />
      {message}
    </div>
  );
}
export function Busy() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl bg-white p-12 text-slate-500">
      <LoaderCircle className="animate-spin" />
      Loading records...
    </div>
  );
}
export function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
export const primaryButton =
  "rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryButton =
  "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50";
export function getError(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Request failed. Please try again.";
}
