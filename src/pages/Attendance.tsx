import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CalendarCheck, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import {
  operationsApi,
  type Attendance,
  type AttendanceInput,
  type AttendanceStatus,
  type ClassSection,
} from "../lib/operationsApi";
import {
  Busy,
  Empty,
  Field,
  getError,
  inputClass,
  Notice,
  OperationsShell,
  primaryButton,
  secondaryButton,
} from "../components/OperationsUI";
const today = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
export function AttendancePage() {
  const { session } = useAuth();
  const student = session?.role === "ROLE_STUDENT";
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(today);
  const [items, setItems] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    status: "PRESENT" as AttendanceStatus,
    remarks: "",
  });
  useEffect(() => {
    if (student) return;
    let active = true;
    operationsApi
      .classes()
      .then((data) => {
        if (!active) return;
        setClasses(data);
        setClassId((id) => id || String(data[0]?.id ?? ""));
      })
      .catch((e) => {
        if (active) setError(getError(e));
      })
      .finally(() => {
        if (active && !classId) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [student]);
  const load = useCallback(async () => {
    if (!student && !classId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setItems(
        student
          ? await operationsApi.myAttendance()
          : await operationsApi.attendanceForClassDate(Number(classId), date),
      );
    } catch (e) {
      setError(getError(e));
    } finally {
      setLoading(false);
    }
  }, [student, classId, date]);
  useEffect(() => {
    void load();
  }, [load]);
  const visible = student
    ? items
    : items.filter((x) => x.attendanceDate === date);
  const present = visible.filter((x) => x.status === "PRESENT").length;
  const absent = visible.filter((x) => x.status === "ABSENT").length;
  const late = visible.filter((x) => x.status === "LATE").length;
  function openCreate() {
    setEditing(null);
    setForm({ studentId: "", status: "PRESENT", remarks: "" });
    setFormOpen(true);
  }
  function openEdit(row: Attendance) {
    setEditing(row.id);
    setForm({
      studentId: String(row.studentId),
      status: row.status,
      remarks: row.remarks ?? "",
    });
    setFormOpen(true);
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    const studentId = Number(form.studentId);
    if (!Number.isSafeInteger(studentId) || studentId <= 0 || !classId) {
      setError("Select a class and enter a valid student ID.");
      return;
    }
    const body: AttendanceInput = {
      studentId,
      classSectionId: Number(classId),
      attendanceDate: date,
      status: form.status,
      remarks: form.remarks,
    };
    setSaving(true);
    setError("");
    try {
      if (editing === null) await operationsApi.markAttendance(body);
      else await operationsApi.updateAttendance(editing, body);
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  }
  return (
    <OperationsShell
      title="Attendance"
      description={
        student
          ? "View your attendance records."
          : "Mark attendance and review class records."
      }
      icon={<CalendarCheck size={28} />}
      action={
        !student && (
          <button
            className={primaryButton}
            onClick={openCreate}
            disabled={!classId}
          >
            <Plus size={16} className="mr-1 inline" />
            Mark attendance
          </button>
        )
      }
    >
      {error && <Notice message={error} />}
      {!student && (
        <div className="cc-operations-card grid gap-4 rounded-2xl p-5 sm:grid-cols-2">
          <Field label="Class section">
            <select
              className={inputClass}
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.department ?? "General"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Attendance date">
            <input
              className={inputClass}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Records", visible.length],
          ["Present", present],
          ["Absent", absent],
          ["Late", late],
        ].map(([label, count]) => (
          <div className="cc-operations-card rounded-2xl p-5" key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-extrabold text-indigo-700">
              {loading ? "—" : count}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button className={secondaryButton} onClick={() => void load()}>
          <RefreshCw size={15} className="mr-1 inline" />
          Refresh
        </button>
      </div>
      {loading ? (
        <Busy />
      ) : visible.length === 0 ? (
        <Empty
          message={
            student
              ? "No attendance records yet."
              : "No attendance records for this class and date."
          }
        />
      ) : (
        <div className="cc-operations-card overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-indigo-50 text-slate-600">
              <tr>
                {[
                  "Student ID",
                  "Date",
                  "Status",
                  "Remarks",
                  ...(!student ? ["Action"] : []),
                ].map((h) => (
                  <th key={h} className="px-5 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-semibold">#{row.studentId}</td>
                  <td className="px-5 py-4">{row.attendanceDate}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${row.status === "PRESENT" ? "bg-emerald-100 text-emerald-700" : row.status === "ABSENT" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">{row.remarks || "—"}</td>
                  {!student && (
                    <td className="px-5 py-4">
                      <button
                        className={secondaryButton}
                        onClick={() => openEdit(row)}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {formOpen && !student && (
        <div
          className="cc-operations-modal"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setFormOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Attendance form"
            className="w-full max-w-md rounded-3xl bg-white p-6"
          >
            <h2 className="mb-4 text-xl font-bold">
              {editing === null ? "Mark attendance" : "Update attendance"}
            </h2>
            <form className="space-y-4" onSubmit={(e) => void save(e)}>
              <Field label="Student ID">
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  required
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({ ...form, studentId: e.target.value })
                  }
                />
              </Field>
              <Field label="Status">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as AttendanceStatus,
                    })
                  }
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">Late</option>
                </select>
              </Field>
              <Field label="Remarks">
                <textarea
                  className={inputClass}
                  maxLength={255}
                  value={form.remarks}
                  onChange={(e) =>
                    setForm({ ...form, remarks: e.target.value })
                  }
                />
              </Field>
              <p className="text-xs text-slate-500">
                Class #{classId} · {date}. Teachers can modify only assigned
                classes.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className={secondaryButton}
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </button>
                <button className={primaryButton} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </OperationsShell>
  );
}
