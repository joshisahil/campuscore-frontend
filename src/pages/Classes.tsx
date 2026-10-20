import { useCallback, useEffect, useState, type FormEvent } from "react";
import { BookOpen, Plus, Pencil, Trash2, Search } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import {
  operationsApi,
  type ClassSection,
  type ClassSectionInput,
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

const blank: ClassSectionInput = { name: "", department: "", year: 1 };
export function Classes() {
  const { session } = useAuth();
  const admin = session?.role === "ROLE_ADMIN";
  const [items, setItems] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ClassSectionInput>(blank);
  const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await operationsApi.classes());
    } catch (e) {
      setError(getError(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const openCreate = () => {
    setEditing(null);
    setForm({ ...blank });
    setShowForm(true);
  };
  const openEdit = (item: ClassSection) => {
    setEditing(item.id);
    setForm({
      name: item.name,
      department: item.department ?? "",
      year: item.year ?? 1,
    });
    setShowForm(true);
  };
  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        name: form.name.trim(),
        department: form.department?.trim() || undefined,
        year: form.year,
      };
      if (editing === null) await operationsApi.addClass(body);
      else await operationsApi.editClass(editing, body);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  }
  async function remove(item: ClassSection) {
    if (!window.confirm(`Delete class "${item.name}"? This cannot be undone.`))
      return;
    setError("");
    try {
      await operationsApi.removeClass(item.id);
      await load();
    } catch (err) {
      setError(getError(err));
    }
  }
  const visible = items.filter((x) =>
    `${x.name} ${x.department ?? ""} ${x.year ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <OperationsShell
      title="Classes & Sections"
      description="Organize academic sections and departments."
      icon={<BookOpen size={28} />}
      action={
        admin && (
          <button className={primaryButton} onClick={openCreate}>
            <Plus size={16} className="mr-1 inline" />
            Add class
          </button>
        )
      }
    >
      {error && <Notice message={error} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="cc-operations-card rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total sections</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {loading ? "—" : items.length}
          </p>
        </div>
        <div className="cc-operations-card rounded-2xl p-5">
          <p className="text-sm text-slate-500">Your access</p>
          <p className="mt-2 font-bold text-indigo-700">
            {admin ? "Manage classes" : "View classes"}
          </p>
        </div>
      </div>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-slate-400" />
        <input
          aria-label="Search classes"
          className={`${inputClass} pl-10`}
          placeholder="Search by section, department, or year"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <Busy />
      ) : visible.length === 0 ? (
        <Empty message="No matching class sections found." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <article
              key={item.id}
              className="cc-operations-card rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <BookOpen size={23} />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  #{item.id}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-extrabold text-slate-900">
                {item.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {item.department || "Department not specified"}
              </p>
              <p className="mt-3 text-sm font-semibold text-indigo-700">
                {item.year ? `Year ${item.year}` : "Year not set"}
              </p>
              {admin && (
                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    className={secondaryButton}
                    onClick={() => openEdit(item)}
                  >
                    <Pencil size={15} className="mr-1 inline" />
                    Edit
                  </button>
                  <button
                    className={`${secondaryButton} text-rose-600`}
                    onClick={() => void remove(item)}
                  >
                    <Trash2 size={15} className="mr-1 inline" />
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      {showForm && admin && (
        <div
          className="cc-operations-modal"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={editing === null ? "Create class" : "Edit class"}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <h2 className="mb-5 text-xl font-extrabold">
              {editing === null ? "Create class section" : "Edit class section"}
            </h2>
            <form className="space-y-4" onSubmit={(e) => void save(e)}>
              <Field label="Class name">
                <input
                  className={inputClass}
                  maxLength={50}
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Department">
                <input
                  className={inputClass}
                  maxLength={50}
                  value={form.department ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
              </Field>
              <Field label="Year (1–6)">
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  max={6}
                  required
                  value={form.year ?? 1}
                  onChange={(e) =>
                    setForm({ ...form, year: Number(e.target.value) })
                  }
                />
              </Field>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className={secondaryButton}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button disabled={saving} className={primaryButton}>
                  {saving ? "Saving..." : "Save class"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </OperationsShell>
  );
}
