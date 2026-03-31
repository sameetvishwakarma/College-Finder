import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard, Users, BarChart2, ClipboardList,
  Settings, LogOut, Menu, X, ShieldCheck, ChevronRight,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const NAV = [
  { to: "/admin/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { to: "/admin/users",      label: "Users",      icon: Users },
  { to: "/admin/analytics",  label: "Analytics",  icon: BarChart2 },
  { to: "/admin/checklist",  label: "Checklist",  icon: ClipboardList },
  { to: "/admin/quiz-config",label: "Quiz Config", icon: Settings },
];

export default function AdminLayout({ children }) {
  const { admin, adminLogout } = useAdmin();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);

  if (!admin) return <Navigate to="/admin" replace />;

  const handleLogout = () => {
    adminLogout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-slate-900 text-white shadow-2xl
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight">Admin Panel</p>
            <p className="text-[10px] text-white/40">CollegeFinder</p>
          </div>
          <button onClick={() => setOpen(false)} className="ml-auto lg:hidden text-white/50 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}>
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {active && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-[11px] text-white/40 mb-3 truncate px-1">{admin.email}</p>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 h-14 bg-slate-900 shadow-lg">
        <button onClick={() => setOpen(true)} className="text-white/70 hover:text-white">
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-white">Admin Panel</span>
      </div>

      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen overflow-y-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
