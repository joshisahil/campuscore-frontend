import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../lib/api";
import {
  createTeacher,
  deleteTeacher,
  filterTeachers,
  getTeacher,
  getTeacherSubjects,
  getTeachers,
  updateTeacher,
  validateTeacherRequest,
  type Teacher,
  type TeacherRequest,
} from "../lib/teachersApi";

type PanelMode = "create" | "view" | "edit";

type TeacherForm = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  classSectionId: string;
};

const blankForm: TeacherForm = {
  userId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  classSectionId: "",
};

const facultyImage =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85";

function formFromTeacher(teacher: Teacher): TeacherForm {
  return {
    userId: String(teacher.userId),
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    phone: teacher.phone ?? "",
    subject: teacher.subject ?? "",
    classSectionId:
      teacher.classSectionId === null ? "" : String(teacher.classSectionId),
  };
}

function requestFromForm(form: TeacherForm): TeacherRequest {
  return {
    userId: Number(form.userId),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || null,
    subject: form.subject.trim() || null,
    classSectionId: form.classSectionId.trim()
      ? Number(form.classSectionId)
      : null,
  };
}

function errorText(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Your login session has expired. Please sign in again.";
    }

    if (error.status === 403) {
      return "Your account does not have permission for this action.";
    }

    if (error.status === 404) {
      return `The requested record was not found. ${error.message}`;
    }

    if (error.status === 409) {
      return `This record conflicts with existing data. ${error.message}`;
    }

    return `Request failed (${error.status}): ${error.message}`;
  }

  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

function initials(teacher: Teacher): string {
  return `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`.toUpperCase();
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="border-b border-slate-100 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value === null || value === "" ? "Not provided" : value}
      </dd>
    </div>
  );
}

type PanelProps = {
  mode: PanelMode;
  teacher: Teacher | null;
  busy: boolean;
  error: string;
  onClose: () => void;
  onEdit: () => void;
  onSave: (request: TeacherRequest) => Promise<void>;
  onDelete: () => Promise<void>;
};

function TeacherPanel({
  mode,
  teacher,
  busy,
  error,
  onClose,
  onEdit,
  onSave,
  onDelete,
}: PanelProps) {
  const [form, setForm] = useState<TeacherForm>(() =>
    teacher ? formFromTeacher(teacher) : { ...blankForm },
  );

  const [validation, setValidation] = useState<string[]>([]);

  useEffect(() => {
    setForm(teacher ? formFromTeacher(teacher) : { ...blankForm });
    setValidation([]);
  }, [teacher, mode]);

  function change(key: keyof TeacherForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setValidation([]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const request = requestFromForm(form);
    const errors = validateTeacherRequest(request);

    if (errors.length > 0) {
      setValidation(errors);
      return;
    }

    await onSave(request);
  }

  const isCreate = mode === "create";
  const isView = mode === "view";

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100";

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-dialog-title"
        className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl motion-safe:animate-[slideIn_.3s_ease-out]"
      >
        <header className="relative overflow-hidden bg-[#12385a] px-6 py-7 text-white">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-sky-400/20 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-sky-200">
                CampusCore / Faculty
              </p>
              <h2 id="teacher-dialog-title" className="mt-2 text-2xl font-bold">
                {isCreate
                  ? "Add New Teacher"
                  : mode === "edit"
                    ? "Edit Teacher"
                    : "Teacher Profile"}
              </h2>
              <p className="mt-2 text-sm text-sky-100">
                {isCreate
                  ? "Create a faculty profile linked to an existing account."
                  : "View and manage faculty information."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close teacher panel"
              className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div
              role="alert"
              className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle size={19} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {validation.length > 0 && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
            >
              <p className="font-semibold">Please correct:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {validation.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          {isView && teacher ? (
            <>
              <div className="flex items-center gap-4 rounded-2xl bg-sky-50 p-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#12385a] text-xl font-bold text-white">
                  {initials(teacher)}
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {teacher.subject || "Subject not assigned"}
                  </p>
                </div>
              </div>

              <dl className="mt-5">
                <Field label="Teacher ID" value={teacher.id} />
                <Field label="Linked user ID" value={teacher.userId} />
                <Field label="Email" value={teacher.email} />
                <Field label="Phone" value={teacher.phone} />
                <Field label="Subject" value={teacher.subject} />
                <Field
                  label="Class section ID"
                  value={teacher.classSectionId}
                />
              </dl>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onEdit}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#12385a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#20547d] disabled:opacity-50"
                >
                  <Pencil size={17} />
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={() => void onDelete()}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={17} />
                  Delete
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={(event) => void submit(event)}>
              <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <div className="flex gap-3">
                  <UserRound
                    size={21}
                    className="mt-0.5 shrink-0 text-sky-700"
                  />
                  <div>
                    <p className="font-semibold text-[#12385a]">
                      {isCreate
                        ? "Existing teacher account required"
                        : "Linked account"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {isCreate
                        ? "First create or identify a user with ROLE_TEACHER in your backend. Enter that user's numeric ID below. This form does not create a login account."
                        : "The teacher's linked user account cannot be changed here."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Linked User ID *
                  </span>
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={form.userId}
                    disabled={!isCreate || busy}
                    onChange={(event) => change("userId", event.target.value)}
                    placeholder="Existing ROLE_TEACHER user ID"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    First Name *
                  </span>
                  <input
                    className={inputClass}
                    type="text"
                    maxLength={50}
                    required
                    disabled={busy}
                    value={form.firstName}
                    onChange={(event) =>
                      change("firstName", event.target.value)
                    }
                    placeholder="First name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Last Name *
                  </span>
                  <input
                    className={inputClass}
                    type="text"
                    maxLength={50}
                    required
                    disabled={busy}
                    value={form.lastName}
                    onChange={(event) => change("lastName", event.target.value)}
                    placeholder="Last name"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address *
                  </span>
                  <input
                    className={inputClass}
                    type="email"
                    maxLength={100}
                    required
                    disabled={busy}
                    value={form.email}
                    onChange={(event) => change("email", event.target.value)}
                    placeholder="teacher@school.com"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone
                  </span>
                  <input
                    className={inputClass}
                    type="tel"
                    maxLength={20}
                    disabled={busy}
                    value={form.phone}
                    onChange={(event) => change("phone", event.target.value)}
                    placeholder="Phone number"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Subject
                  </span>
                  <input
                    className={inputClass}
                    type="text"
                    maxLength={100}
                    disabled={busy}
                    value={form.subject}
                    onChange={(event) => change("subject", event.target.value)}
                    placeholder="Mathematics"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Class Section ID
                  </span>
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    step="1"
                    disabled={busy}
                    value={form.classSectionId}
                    onChange={(event) =>
                      change("classSectionId", event.target.value)
                    }
                    placeholder="Optional existing section ID"
                  />
                </label>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#12385a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/10 transition hover:-translate-y-0.5 hover:bg-[#20547d] disabled:opacity-50 motion-reduce:transform-none"
                >
                  {busy
                    ? "Saving..."
                    : isCreate
                      ? "Create Teacher"
                      : "Save Changes"}
                  {!busy && <ChevronRight size={17} />}
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export function Teachers() {
  const { session } = useAuth();
  const isAdmin = session?.role === "ROLE_ADMIN";

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [openingId, setOpeningId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [panelError, setPanelError] = useState("");
  const [success, setSuccess] = useState("");

  const [selected, setSelected] = useState<Teacher | null>(null);
  const [mode, setMode] = useState<PanelMode | null>(null);

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getTeachers();
      setTeachers(result);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      void loadTeachers();
    }
  }, [isAdmin, loadTeachers]);

  const subjects = useMemo(() => getTeacherSubjects(teachers), [teachers]);

  const filtered = useMemo(() => {
    const searched = filterTeachers(teachers, search);

    return subject
      ? searched.filter((teacher) => teacher.subject?.trim() === subject)
      : searched;
  }, [teachers, search, subject]);

  const assignedCount = teachers.filter(
    (teacher) => teacher.classSectionId !== null,
  ).length;

  function closePanel() {
    if (busy) return;

    setMode(null);
    setSelected(null);
    setPanelError("");
  }

  function openCreate() {
    setSelected(null);
    setPanelError("");
    setSuccess("");
    setMode("create");
  }

  async function openTeacher(id: number) {
    setOpeningId(id);
    setError("");

    try {
      const result = await getTeacher(id);
      setSelected(result);
      setPanelError("");
      setMode("view");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setOpeningId(null);
    }
  }

  async function saveTeacher(request: TeacherRequest) {
    if (!mode) return;

    const creating = mode === "create";

    if (!creating && !selected) return;

    setBusy(true);
    setPanelError("");

    try {
      const result = creating
        ? await createTeacher(request)
        : await updateTeacher(selected!.id, request);

      setTeachers((current) =>
        creating
          ? [...current, result]
          : current.map((teacher) =>
              teacher.id === result.id ? result : teacher,
            ),
      );

      setSelected(result);
      setMode("view");
      setSuccess(
        creating
          ? "Teacher profile created successfully."
          : "Teacher profile updated successfully.",
      );
    } catch (err) {
      setPanelError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  async function removeTeacher() {
    if (!selected) return;

    const confirmed = window.confirm(
      `Delete ${selected.firstName} ${selected.lastName}'s teacher profile? This cannot be undone.`,
    );

    if (!confirmed) return;

    setBusy(true);
    setPanelError("");

    try {
      await deleteTeacher(selected.id);

      setTeachers((current) =>
        current.filter((teacher) => teacher.id !== selected.id),
      );

      setSelected(null);
      setMode(null);
      setSuccess("Teacher profile deleted successfully.");
    } catch (err) {
      setPanelError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  if (!isAdmin) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900"
      >
        Only administrators can manage teacher records.
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-8">
      <style>
        {`
          @keyframes campusFadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes campusSlideIn {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @media (prefers-reduced-motion: no-preference) {
            .campus-reveal {
              animation: campusFadeUp .55s ease-out both;
            }
            .campus-slide {
              animation: campusSlideIn .3s ease-out both;
            }
          }
        `}
      </style>

      <section className="campus-reveal relative isolate overflow-hidden rounded-[28px] bg-[#12385a] text-white shadow-xl shadow-slate-900/10">
        <img
          src={facultyImage}
          alt="Students collaborating in an educational setting"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#102f4c] via-[#12385a]/95 to-[#12385a]/45" />

        <div className="relative max-w-2xl px-6 py-10 sm:px-10 sm:py-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur-md">
            <GraduationCap size={16} />
            FACULTY MANAGEMENT
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Meet the people behind great learning.
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-sky-100 sm:text-base">
            A smarter way to organize your faculty, subjects, and classroom
            assignments — all in one place.
          </p>

          <button
            type="button"
            onClick={openCreate}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#12385a] shadow-lg transition hover:-translate-y-1 hover:bg-sky-50 motion-reduce:transform-none"
          >
            <Plus size={18} />
            Add New Teacher
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-sky-700">
            CampusCore Workspace
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Teacher Directory
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage faculty information and academic assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadTeachers()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-800"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 size={19} />
            {success}
          </span>

          <button
            type="button"
            aria-label="Dismiss success message"
            onClick={() => setSuccess("")}
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Teachers",
            value: teachers.length,
            icon: Users,
            hint: "Faculty profiles",
          },
          {
            label: "Subjects",
            value: subjects.length,
            icon: BookOpen,
            hint: "Unique subjects",
          },
          {
            label: "Class Assignments",
            value: assignedCount,
            icon: GraduationCap,
            hint: "Assigned profiles",
          },
        ].map(({ label, value, icon: Icon, hint }, index) => (
          <div
            key={label}
            className="campus-reveal group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-900/10 motion-reduce:transform-none"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="flex items-start justify-between">
              <span className="rounded-2xl bg-sky-50 p-3 text-[#12385a] transition group-hover:bg-[#12385a] group-hover:text-white">
                <Icon size={23} />
              </span>
              <span className="text-xs font-semibold text-slate-400">
                LIVE DATA
              </span>
            </div>

            <p className="mt-6 text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-4xl font-extrabold text-[#12385a]">
              {loading ? "—" : value}
            </p>
            <p className="mt-2 text-xs text-slate-400">{hint}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Faculty Members
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {filtered.length} matching teacher(s)
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <Search
                size={18}
                className="absolute left-4 top-3.5 text-slate-400"
              />
              <input
                type="search"
                aria-label="Search teachers"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search faculty..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white sm:w-72"
              />
            </label>

            <select
              aria-label="Filter by subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-sky-400"
            >
              <option value="">All Subjects</option>
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div role="status" className="p-16 text-center text-slate-500">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-[#12385a] motion-reduce:animate-none" />
            Loading faculty profiles...
          </div>
        ) : error && teachers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Unable to load teachers. Select Refresh to try again.
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-50 text-[#12385a]">
              <UserRound size={38} />
            </div>

            <h4 className="mt-6 text-xl font-bold text-slate-900">
              {search || subject
                ? "No matching teachers"
                : "Your faculty directory is ready"}
            </h4>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              {search || subject
                ? "Try a different search or subject filter."
                : "No teacher profiles have been added yet. Link an existing teacher-role account to create your first faculty profile."}
            </p>

            {!search && !subject && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#12385a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#20547d]"
              >
                <Plus size={18} />
                Add First Teacher
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 xl:grid-cols-3">
            {filtered.map((teacher, index) => (
              <article
                key={teacher.id}
                className="campus-reveal group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg motion-reduce:transform-none"
                style={{
                  animationDelay: `${Math.min(index, 8) * 60}ms`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#12385a] to-sky-500 text-lg font-bold text-white shadow-md">
                    {initials(teacher)}
                  </div>

                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#12385a]">
                    #{teacher.id}
                  </span>
                </div>

                <h4 className="mt-5 text-lg font-bold text-slate-900">
                  {teacher.firstName} {teacher.lastName}
                </h4>

                <p className="mt-1 text-sm font-medium text-sky-700">
                  {teacher.subject || "Subject not assigned"}
                </p>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={16} className="shrink-0" />
                    <span className="min-w-0 truncate">{teacher.email}</span>
                  </p>

                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <BookOpen size={16} className="shrink-0" />
                    {teacher.classSectionId === null
                      ? "No class assigned"
                      : `Section #${teacher.classSectionId}`}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={openingId !== null}
                  onClick={() => void openTeacher(teacher.id)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-[#12385a] transition group-hover:bg-[#12385a] group-hover:text-white disabled:opacity-50"
                >
                  {openingId === teacher.id ? "Opening..." : "View Profile"}
                  <ChevronRight size={17} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="text-xs leading-6 text-slate-500">
        Faculty profiles are linked to existing user accounts with the teacher
        role. Profile creation does not create a login account, and profile
        deletion does not delete the linked login account.
      </p>

      {mode && (
        <TeacherPanel
          key={
            mode === "create"
              ? "new-teacher"
              : `teacher-${selected?.id ?? "unknown"}`
          }
          mode={mode}
          teacher={selected}
          busy={busy}
          error={panelError}
          onClose={closePanel}
          onEdit={() => {
            setPanelError("");
            setMode("edit");
          }}
          onSave={saveTeacher}
          onDelete={removeTeacher}
        />
      )}
    </div>
  );
}
