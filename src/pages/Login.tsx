import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  School,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../lib/api";
import "./login.css";

export function Login() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="cc-login">
      <div className="cc-login-photo" aria-hidden="true" />
      <div className="cc-login-overlay" aria-hidden="true" />
      <div className="cc-login-orb cc-login-orb-one" aria-hidden="true" />
      <div className="cc-login-orb cc-login-orb-two" aria-hidden="true" />

      <div className="cc-login-shell">
        <section className="cc-login-story">
          <Link to="/" className="cc-login-brand">
            <span className="cc-login-brand-icon">
              <School size={27} />
            </span>

            <span>
              <strong>CampusCore</strong>
              <small>School Management Platform</small>
            </span>
          </Link>

          <div className="cc-login-story-content">
            <span className="cc-login-eyebrow">
              <Sparkles size={15} />
              Your connected campus
            </span>

            <h1>
              A smarter way
              <br />
              to manage
              <br />
              <span>education.</span>
            </h1>

            <p>
              One beautifully connected workspace for students, teachers, and
              school operations.
            </p>

            <div className="cc-login-benefits">
              <div>
                <span className="cc-login-benefit-icon">
                  <GraduationCap size={20} />
                </span>
                <span>
                  <strong>Student management</strong>
                  <small>Everything in one place</small>
                </span>
              </div>

              <div>
                <span className="cc-login-benefit-icon">
                  <BookOpen size={20} />
                </span>
                <span>
                  <strong>Academic operations</strong>
                  <small>Simple, connected workflows</small>
                </span>
              </div>

              <div>
                <span className="cc-login-benefit-icon">
                  <ShieldCheck size={20} />
                </span>
                <span>
                  <strong>Role-based access</strong>
                  <small>Designed for your school team</small>
                </span>
              </div>
            </div>
          </div>

          <p className="cc-login-story-footer">
            CampusCore · Your school, connected.
          </p>
        </section>

        <section className="cc-login-form-section">
          <div className="cc-login-card">
            <div className="cc-login-card-glow" aria-hidden="true" />

            <div className="cc-login-mobile-brand">
              <School size={22} />
              <strong>CampusCore</strong>
            </div>

            <span className="cc-login-welcome-icon">
              <GraduationCap size={26} />
            </span>

            <span className="cc-login-card-eyebrow">WELCOME BACK</span>

            <h2>Sign in to your workspace</h2>

            <p className="cc-login-description">
              Enter your school account credentials to continue.
            </p>

            <form onSubmit={submit} className="cc-login-form">
              <div className="cc-login-field">
                <label htmlFor="username">Email or username</label>

                <div className="cc-login-input-wrap">
                  <Mail size={19} aria-hidden="true" />

                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    maxLength={100}
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    disabled={busy}
                  />
                </div>
              </div>

              <div className="cc-login-field">
                <label htmlFor="password">Password</label>

                <div className="cc-login-input-wrap">
                  <LockKeyhole size={19} aria-hidden="true" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={busy}
                  />

                  <button
                    type="button"
                    className="cc-login-password-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="cc-login-error" role="alert" aria-live="polite">
                  {error}
                </div>
              )}

              <button className="cc-login-submit" type="submit" disabled={busy}>
                {busy ? (
                  <>
                    <span className="cc-login-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            <div className="cc-login-secure">
              <ShieldCheck size={16} />
              <span>Protected school workspace</span>
            </div>

            <p className="cc-login-session-note">
              Your session ends when you close this browser tab.
            </p>
          </div>

          <p className="cc-login-bottom-text">
            Built for better school management.
          </p>
        </section>
      </div>
    </main>
  );
}
