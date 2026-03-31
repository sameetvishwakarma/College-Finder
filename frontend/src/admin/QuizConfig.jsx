import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";

const QUIZ_KEY = "cf_quiz_config";
const load = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } };
const save = (key, v) => localStorage.setItem(key, JSON.stringify(v));

const DEFAULT_CONFIG = {
  budgets: [
    { key: "low",    label: "Low",    sub: "Under ₹10k", min: 0,     max: 10000   },
    { key: "medium", label: "Medium", sub: "₹10k–₹20k",  min: 10000, max: 20000   },
    { key: "high",   label: "High",   sub: "Above ₹20k", min: 20000, max: Infinity },
  ],
  streams: ["Science", "Commerce", "Arts"],
};

function Toast({ msg }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-semibold shadow-2xl animate-fade-in">
      <CheckCircle2 className="h-4 w-4" /> {msg}
    </div>
  );
}

const INPUT = "w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all";

export default function QuizConfig() {
  const [config, setConfig] = useState(() => load(QUIZ_KEY, DEFAULT_CONFIG));
  const [toast, setToast]   = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const updateBudget = (i, field, val) => {
    const next = config.budgets.map((b, idx) =>
      idx === i ? { ...b, [field]: field === "min" || field === "max" ? Number(val) : val } : b
    );
    setConfig((p) => ({ ...p, budgets: next }));
  };

  const updateStreams = (val) => {
    const arr = val.split(",").map((s) => s.trim()).filter(Boolean);
    setConfig((p) => ({ ...p, streams: arr }));
  };

  const handleSave = () => {
    save(QUIZ_KEY, config);
    showToast("Quiz config saved ✅");
  };

  return (
    <div>
      {toast && <Toast msg={toast} />}

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Quiz Configuration</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Modify budget ranges and stream options</p>
        </div>
        <button onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <Save className="h-4 w-4" /> Save Config
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Budget ranges */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">💰 Budget Ranges</h2>
          <div className="space-y-4">
            {config.budgets.map((b, i) => (
              <div key={b.key} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3 uppercase tracking-wider">{b.label}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Label</label>
                    <input value={b.label} onChange={(e) => updateBudget(i, "label", e.target.value)} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Sub-label</label>
                    <input value={b.sub} onChange={(e) => updateBudget(i, "sub", e.target.value)} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Min (₹)</label>
                    <input type="number" value={b.min} onChange={(e) => updateBudget(i, "min", e.target.value)} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Max (₹)</label>
                    <input type="number" value={b.max === Infinity ? "" : b.max} placeholder="∞"
                      onChange={(e) => updateBudget(i, "max", e.target.value === "" ? Infinity : e.target.value)} className={INPUT} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stream options */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">🎓 Stream Options</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Comma-separated list of streams shown in the quiz</p>
          <textarea
            value={config.streams.join(", ")}
            onChange={(e) => updateStreams(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all resize-none"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {config.streams.map((s) => (
              <span key={s} className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
