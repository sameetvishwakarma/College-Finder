import { useState } from "react";
import { Plus, Pencil, Trash2, Search, X, CheckCircle2 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const EMPTY = { name: "", area: "", type: "Aided", stream: "Science", cutoff: "", fee: "", subjects: "" };

function Toast({ msg, onDone }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-semibold shadow-2xl animate-fade-in">
      <CheckCircle2 className="h-4 w-4" /> {msg}
    </div>
  );
}

function CollegeModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const INPUT = "w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{initial ? "Edit College" : "Add College"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"><X className="h-4 w-4" /></button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { f: "name",     label: "College Name",  type: "text",   full: true },
            { f: "area",     label: "Area",           type: "text" },
            { f: "cutoff",   label: "Cutoff (%)",     type: "number" },
            { f: "fee",      label: "Fees (₹/yr)",    type: "number" },
            { f: "subjects", label: "Subjects (comma-separated)", type: "text", full: true },
          ].map(({ f, label, type, full }) => (
            <div key={f} className={full ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</label>
              <input type={type} value={form[f]} onChange={set(f)} className={INPUT} />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Stream</label>
            <select value={form.stream} onChange={set("stream")} className={INPUT}>
              {["Science", "Commerce", "Arts"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Type</label>
            <select value={form.type} onChange={set("type")} className={INPUT}>
              {["Aided", "Unaided", "Self-Financed"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white text-sm font-bold shadow transition-all hover:scale-[1.02]">
            {initial ? "Save Changes" : "Add College"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 mx-auto mb-3">
          <Trash2 className="h-5 w-5 text-red-500" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 text-center mb-1">Delete College?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-5">"{name}" will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow transition-all hover:scale-[1.02]">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function CollegeManager() {
  const { colleges, addCollege, updateCollege, deleteCollege } = useAdmin();
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(null); // null | "add" | college object
  const [delTarget, setDelTarget] = useState(null);
  const [toast, setToast]       = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  // Guard: skip entries with no name to prevent .toLowerCase() crash
  const filtered = colleges
    .filter((c) => c.name)
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.area ?? "").toLowerCase().includes(search.toLowerCase())
    );

  // Debug: log colleges to console for verification
  console.log("[CollegeManager] colleges:", colleges.length, colleges.slice(0, 2));

  const handleSave = (form) => {
    if (modal === "add") {
      addCollege(form);
      showToast("College added successfully ✅");
    } else {
      updateCollege(modal.id, form);
      showToast("College updated successfully ✅");
    }
    setModal(null);
  };

  const handleDelete = () => {
    deleteCollege(delTarget.id);
    showToast("College deleted ✅");
    setDelTarget(null);
  };

  return (
    <div>
      {toast && <Toast msg={toast} />}
      {modal && <CollegeModal initial={modal === "add" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
      {delTarget && <DeleteConfirm name={delTarget.name} onConfirm={handleDelete} onCancel={() => setDelTarget(null)} />}

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Colleges</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{colleges.length} total</p>
        </div>
        <button onClick={() => setModal("add")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <Plus className="h-4 w-4" /> Add College
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colleges…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                {["Name", "Area", "Type", "Stream", "Cutoff", "Fee", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100 max-w-[200px] truncate">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{c.area || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.type === "Aided"         ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : c.type === "Unaided"     ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>{c.type || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.stream || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                    {c.cutoff ? `${c.cutoff}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {c.fee ? `₹${Number(c.fee).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(c)} title="Edit"
                        className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDelTarget(c)} title="Delete"
                        className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">No colleges found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
