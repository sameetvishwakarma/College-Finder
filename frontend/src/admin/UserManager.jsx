import { useState } from "react";
import { Trash2, Search, X, User, CheckCircle2 } from "lucide-react";

const USERS_KEY = "cf_users";
const load = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } };
const save = (key, v) => localStorage.setItem(key, JSON.stringify(v));

function Toast({ msg }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-semibold shadow-2xl animate-fade-in">
      <CheckCircle2 className="h-4 w-4" /> {msg}
    </div>
  );
}

export default function UserManager() {
  const [users, setUsers]   = useState(() => load(USERS_KEY, []));
  const [search, setSearch] = useState("");
  const [delTarget, setDelTarget] = useState(null);
  const [toast, setToast]   = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const filtered = users.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (email) => {
    const next = users.filter((u) => u.email !== email);
    setUsers(next);
    save(USERS_KEY, next);
    setDelTarget(null);
    showToast("User deleted ✅");
  };

  return (
    <div>
      {toast && <Toast msg={toast} />}

      {delTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDelTarget(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 mx-auto mb-3">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 text-center mb-1">Delete User?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-5 break-all">{delTarget}</p>
            <div className="flex gap-3">
              <button onClick={() => setDelTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(delTarget)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow transition-all hover:scale-[1.02]">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Users</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{users.length} registered</p>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                {["User", "Email", "Marks", "Stream", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {filtered.map((u) => (
                <tr key={u.email} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center shrink-0">
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{u.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.marks ? `${u.marks}%` : "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.stream || "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDelTarget(u.email)}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
