import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  deleteStudent,
  filterStudents,
  getStudent,
  getStudents,
  updateStudent,
  type Student,
  type StudentUpdateRequest,
} from "../lib/studentsApi";
import { ApiError } from "../lib/api";
import { useAuth } from "../auth/AuthContext";

type PanelMode = "view" | "edit";

interface StudentForm {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  profilePhotoUrl: string;
}

function toForm(student: Student): StudentForm {
  return {
    firstName: student.firstName,
    lastName: student.lastName,
    phone: student.phone ?? "",
    address: student.address ?? "",
    dateOfBirth: student.dateOfBirth ?? "",
    profilePhotoUrl: student.profilePhotoUrl ?? "",
  };
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 403) {
      return "You do not have permission to perform this action.";
    }

    if (error.status === 404) {
      return "Student not found. Refresh the list and try again.";
    }

    return error.message;
  }

  if (error instanceof Error) return error.message;

  return "An unexpected error occurred.";
}

function StudentPanel({
  student,
  mode,
  busy,
  error,
  onClose,
  onEdit,
  onSave,
  onDelete,
}: {
  student: Student;
  mode: PanelMode;
  busy: boolean;
  error: string;
  onClose: () => void;
  onEdit: () => void;
  onSave: (data: StudentUpdateRequest) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [form, setForm] = useState<StudentForm>(() => toForm(student));

  useEffect(() => {
    setForm(toForm(student));
  }, [student]);

  function change(field: keyof StudentForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) return;

    const data: StudentUpdateRequest = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      profilePhotoUrl: form.profilePhotoUrl.trim(),
    };

    // The backend ignores null fields. Do not send an empty date
    // because an empty string is not a valid LocalDate.
    if (form.dateOfBirth) {
      data.dateOfBirth = form.dateOfBirth;
    }

    await onSave(data);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-panel-title"
        className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">
              Student profile
            </p>
            <h2
              id="student-panel-title"
              className="mt-1 text-xl font-bold text-slate-900"
            >
              {student.firstName} {student.lastName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close student profile"
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 rounded-2xl bg-sky-50 p-5">
            <p className="text-sm text-slate-500">Roll number</p>
            <p className="mt-1 text-lg font-bold text-[#12385a]">
              {student.rollNumber}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {student.className || "No class assigned"}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {mode === "view" ? (
            <div className="space-y-5">
              {[
                ["First name", student.firstName],
                ["Last name", student.lastName],
                ["Email", student.email],
                ["Phone", student.phone],
                ["Date of birth", student.dateOfBirth],
                ["Address", student.address],
                ["Class", student.className],
                ["Admission date", student.admissionDate],
                ["Profile photo URL", student.profilePhotoUrl],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-slate-100 pb-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                    {value || "Not provided"}
                  </p>
                </div>
              ))}

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#12385a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1b4f78]"
                >
                  <Pencil size={16} />
                  Edit profile
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void onDelete()}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Delete student
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(event) => void submit(event)}>
              <p className="mb-5 text-sm text-slate-500">
                Roll number, email, and class cannot be changed here.
              </p>

              <div className="space-y-4">
                {(
                  [
                    ["firstName", "First name"],
                    ["lastName", "Last name"],
                    ["phone", "Phone"],
                    ["address", "Address"],
                    ["dateOfBirth", "Date of birth"],
                    ["profilePhotoUrl", "Profile photo URL"],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field} className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      {label}
                    </span>
                    <input
                      type={field === "dateOfBirth" ? "date" : "text"}
                      value={form[field]}
                      onChange={(event) => change(field, event.target.value)}
                      required={field === "firstName" || field === "lastName"}
                      maxLength={
                        field === "firstName" || field === "lastName"
                          ? 50
                          : field === "phone"
                            ? 20
                            : 255
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-[#12385a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1b4f78] disabled:opacity-50"
                >
                  {busy ? "Saving..." : "Save changes"}
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

export function Students() {
  const { session } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [panelError, setPanelError] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const [mode, setMode] = useState<PanelMode>("view");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const filtered = useMemo(
    () => filterStudents(students, search),
    [students, search],
  );

  const classCount = new Set(
    students.map((student) => student.className).filter(Boolean),
  ).size;

  async function openStudent(id: number) {
    setPanelError("");
    setError("");

    try {
      const student = await getStudent(id);
      setSelected(student);
      setMode("view");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function saveStudent(data: StudentUpdateRequest) {
    if (!selected) return;

    setBusy(true);
    setPanelError("");

    try {
      const updated = await updateStudent(selected.id, data);

      setStudents((current) =>
        current.map((student) =>
          student.id === updated.id ? updated : student,
        ),
      );

      setSelected(updated);
      setMode("view");
    } catch (err) {
      setPanelError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function removeStudent() {
    if (!selected) return;

    const confirmed = window.confirm(
      `Permanently delete ${selected.firstName} ${selected.lastName} (${selected.rollNumber})? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setBusy(true);
    setPanelError("");

    try {
      await deleteStudent(selected.id);

      setStudents((current) =>
        current.filter((student) => student.id !== selected.id),
      );

      setSelected(null);
    } catch (err) {
      setPanelError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (session?.role !== "ROLE_ADMIN") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        You do not have permission to manage student records.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-sky-700">
            Student management
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight">
            Student Directory
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Search, view, and manage student profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadStudents()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total students",
            value: students.length,
            icon: Users,
          },
          {
            label: "Class sections",
            value: classCount,
            icon: GraduationCap,
          },
          {
            label: "Matching search",
            value: filtered.length,
            icon: Search,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="inline-flex rounded-xl bg-sky-50 p-3 text-[#12385a]">
              <Icon size={21} />
            </span>
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-bold">All students</h3>
            <p className="mt-1 text-sm text-slate-500">
              {filtered.length} record(s) displayed
            </p>
          </div>

          <label className="relative block w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              aria-label="Search students"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, roll no., email..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-500"
            />
          </label>
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap size={34} className="mx-auto text-slate-400" />
            <p className="mt-3 font-semibold text-slate-700">
              No students found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "No student records are available."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Roll number</th>
                  <th className="px-5 py-4">Class</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {student.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">{student.rollNumber}</td>

                    <td className="px-5 py-4">
                      {student.className || "Unassigned"}
                    </td>

                    <td className="px-5 py-4">{student.phone || "—"}</td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => void openStudent(student.id)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#12385a] hover:underline"
                      >
                        View
                        <ArrowLeft size={15} className="rotate-180" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs text-slate-500">
        Student creation requires a backend endpoint that provisions the linked
        user account and student record. It is not enabled yet.
      </p>

      {selected && (
        <StudentPanel
          key={selected.id}
          student={selected}
          mode={mode}
          busy={busy}
          error={panelError}
          onClose={() => {
            if (!busy) {
              setSelected(null);
              setPanelError("");
            }
          }}
          onEdit={() => {
            setPanelError("");
            setMode("edit");
          }}
          onSave={saveStudent}
          onDelete={removeStudent}
        />
      )}
    </div>
  );
}
