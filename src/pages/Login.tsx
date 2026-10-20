import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, School } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../lib/api";
export function Login() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (session) return <Navigate to="/" replace />;
  const from = (location.state as { from?: unknown } | null)?.from;
  const redirect =
    typeof from === "string" &&
    from.startsWith("/") &&
    !from.startsWith("//") &&
    from !== "/login"
      ? from
      : "/";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await login(username.trim(), password);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "Invalid username or password."
          : err instanceof Error
            ? err.message
            : "Login failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="inline-flex rounded-2xl bg-[#12385a] p-3 text-white">
          <School size={28} />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          Sign in to CampusCore
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Use your school account to access your workspace.
        </p>
        <form onSubmit={submit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-semibold"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              required
              maxLength={100}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#12385a] px-4 py-3 font-semibold text-white hover:bg-[#1b4f78] disabled:opacity-60"
          >
            <LockKeyhole size={17} />
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          Your session ends when you close this browser tab.
        </p>
        <Link
          to="/"
          className="mt-5 block text-center text-sm text-slate-500 hover:underline"
        >
          Back to workspace
        </Link>
      </div>
    </main>
  );
}
