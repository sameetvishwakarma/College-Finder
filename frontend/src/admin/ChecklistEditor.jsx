import { useState } from "react";
import { Plus, Trash2, CheckCircle2, GripVertical } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

function Toast({ msg }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-semibold shadow-2xl animate-fade-in">
      <CheckCircle2 className="h-4 w-4" /> {msg}
    </div>
  );
}

function ListEditor({ title, color, items, onChange }) {
  const [newItem, setNewItem] = useState("");

  const add = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem("");
  };

  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  const edit = (i, val) => onChange(items.map((item, idx) => idx === i ? val : item));

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700`}>
      <h2 className={`text-sm font-bold mb-4 ${color}`}>{title}</h2>

      <div className="space-y-2 mb-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 group">
            <GripVertical className="h-4 w-4 text-slate-300 mt-2.5 shrink-0" />
            <span className="mt-2 text-xs font-bold text-slate-400 shrink-0 w-5">{i + 1}.</span>
            <input
              value={item}
              onChange={(e) => edit(i, e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
            <button onClick={() => remove(i)}
              className="mt-1.5 p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add new item…"
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
        />
        <button onClick={add}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow transition-all hover:scale-[1.02] flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
}

export default function ChecklistEditor() {
  const { checklist, updateChecklist } = useAdmin();
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleChange = (key, val) => {
    updateChecklist({ [key]: val });
    showToast("Checklist updated ✅");
  };

  return (
    <div>
      {toast && <Toast msg={toast} />}

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Checklist Editor</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Changes reflect instantly on the college detail page</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ListEditor
          title="📄 Documents Required"
          color="text-blue-600 dark:text-blue-400"
          items={checklist.documents}
          onChange={(val) => handleChange("documents", val)}
        />
        <ListEditor
          title="📋 Admission Steps"
          color="text-indigo-600 dark:text-indigo-400"
          items={checklist.admissionSteps}
          onChange={(val) => handleChange("admissionSteps", val)}
        />
      </div>
    </div>
  );
}
