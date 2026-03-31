import { useState, useEffect } from "react";
import { Users, Heart, TrendingUp, ArrowUpRight, Activity } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const load = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } };

// ── Login activity line chart (pure CSS/SVG — no external lib) ───────────────
function ActivityChart({ history }) {
  if (!history.length) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-slate-400">
        No login activity yet. Login count will appear here.
      </div>
    );
  }

  const W = 500, H = 100, PAD = 10;
  const counts = history.map((h) => h.count);
  const maxVal = Math.max(...counts, 1);

  // Map each point to SVG coordinates
  const pts = history.map((h, i) => {
    const x = PAD + (i / Math.max(history.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - ((h.count / maxVal) * (H - PAD * 2));
    return { x, y, ...h };
  });

  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  // Filled area path
  const area = `M${pts[0].x},${H - PAD} ` +
    pts.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${pts[pts.length - 1].x},${H - PAD} Z`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={area} fill="url(#areaGrad)" />
        {/* Line */}
        <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#6366f1" stroke="white" strokeWidth="1.5" />
        ))}
      </svg>

      {/* X-axis labels — show first, middle, last */}
      {history.length > 0 && (
        <div className="flex justify-between mt-1 px-1">
          <span className="text-[9px] text-slate-400">{history[0]?.time}</span>
          {history.length > 2 && (
            <span className="text-[9px] text-slate-400">{history[Math.floor(history.length / 2)]?.time}</span>
          )}
          <span className="text-[9px] text-slate-400">{history[history.length - 1]?.time}</span>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { colleges } = useAdmin();

  const [totalVisits, setTotalVisits]   = useState(0);
  const [todayVisits, setTodayVisits]   = useState(0);
  const [loginHistory, setLoginHistory] = useState([]);
  const [users, setUsers]               = useState([]);
  const [wishlist, setWishlist]         = useState([]);

  useEffect(() => {
    const history = load("cf_login_history", []);
    const today   = new Date().toLocaleDateString();
    setTotalVisits(parseInt(localStorage.getItem("cf_login_visits")) || 0);
    setTodayVisits(history.filter((h) => h.date === today).length);
    setLoginHistory(history);
    setUsers(load("cf_users", []));
    setWishlist(load("cf_wishlist", []));
  }, []);

  // Wishlist: most saved colleges
  const wishlistMap = (() => {
    const map = {};
    wishlist.forEach((c) => { map[c.name] = (map[c.name] ?? 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  })();

  const STATS = [
    { label: "Registered Users", value: users.length,   icon: Users,      color: "from-emerald-500 to-teal-500",  bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Saved Colleges",   value: wishlist.length, icon: Heart,      color: "from-rose-500 to-pink-500",     bg: "bg-rose-50 dark:bg-rose-900/20" },
    { label: "Total Visits",     value: totalVisits,     icon: TrendingUp, color: "from-amber-500 to-orange-500",  bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Today's Visits",   value: todayVisits,     icon: Activity,   color: "from-indigo-500 to-blue-500",   bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, Admin</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-5 border border-white/50 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
            <div className={`inline-flex h-10 w-10 rounded-xl bg-linear-to-br ${color} items-center justify-center shadow-lg mb-3`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Activity graph */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">User Activity</h2>
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5" /> {totalVisits} total logins
            </span>
          </div>
          <ActivityChart history={loginHistory} />
          {loginHistory.length > 0 && (
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Last login: {loginHistory[loginHistory.length - 1]?.date} at {loginHistory[loginHistory.length - 1]?.time}
            </p>
          )}
        </div>

        {/* Most saved colleges */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Most Saved Colleges ❤️</h2>
          {wishlistMap.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No wishlist data yet</p>
          ) : (
            <div className="space-y-3">
              {wishlistMap.map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{name}</p>
                    <div className="mt-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full transition-all duration-500"
                        style={{ width: `${(count / (wishlistMap[0]?.[1] || 1)) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-500 shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
