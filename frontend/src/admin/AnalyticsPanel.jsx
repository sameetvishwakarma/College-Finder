import { useMemo } from "react";
import { TrendingUp, Heart, Eye, Activity } from "lucide-react";

const load = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } };

function BarChart({ data, color = "bg-indigo-500" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-32 mt-4">
      {data.map(({ label, value }) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1 group">
          <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{value}</span>
          <div className={`w-full rounded-t-lg ${color} hover:opacity-80 transition-all duration-300`}
            style={{ height: `${Math.max((value / max) * 100, 4)}px` }} />
          <span className="text-[9px] text-slate-400 truncate w-full text-center">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPanel() {
  const loginHistory = load("cf_login_history", []);
  const wishlist     = load("cf_wishlist", []);
  const pageVisits   = parseInt(localStorage.getItem("cf_page_visits")) || 0;
  const totalVisits  = parseInt(localStorage.getItem("cf_login_visits")) || 0;
  const today        = new Date().toLocaleDateString();
  const todayVisits  = loginHistory.filter((h) => h.date === today).length;

  // Build last-14-days bar chart from login history
  const visitData = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const dateLabel = d.toLocaleDateString();
      return {
        label: d.toLocaleDateString([], { month: "short", day: "numeric" }),
        value: loginHistory.filter((h) => h.date === dateLabel).length,
      };
    }), []);

  const wishlistData = useMemo(() => {
    const map = {};
    wishlist.forEach((c) => { map[c.name] = (map[c.name] ?? 0) + 1; });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, value]) => ({ label: label.split(" ").slice(0, 2).join(" "), value }));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Traffic and engagement overview</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Visits",   value: totalVisits,    icon: Eye,       color: "from-indigo-500 to-blue-500" },
          { label: "Today's Visits", value: todayVisits,    icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
          { label: "Page Visits",    value: pageVisits,     icon: Activity,  color: "from-violet-500 to-purple-500" },
          { label: "Saved Colleges", value: wishlist.length, icon: Heart,    color: "from-rose-500 to-pink-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className={`inline-flex h-9 w-9 rounded-xl bg-linear-to-br ${color} items-center justify-center shadow mb-2`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User login trend — last 14 days */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">User Logins — Last 14 Days</h2>
          <BarChart data={visitData} color="bg-indigo-500" />
        </div>

        {/* Wishlist breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Most Saved Colleges</h2>
          {wishlistData.length === 0
            ? <p className="text-sm text-slate-400 text-center py-10">No wishlist data yet</p>
            : <BarChart data={wishlistData} color="bg-rose-400" />
          }
        </div>
      </div>
    </div>
  );
}
