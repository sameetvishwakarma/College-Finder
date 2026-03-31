import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const validateEmail    = (v) => /^[^\s@]+@gmail\.com$/.test(v);
const validatePassword = (v) =>
  /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v);

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminLogin } = useAdmin();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [serverErr, setServerErr] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!validateEmail(form.email))    e.email    = "Must be a valid @gmail.com address.";
    if (!validatePassword(form.password)) e.password = "Needs uppercase, lowercase, number & special character.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErr("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = adminLogin(form.email, form.password);
    setLoading(false);
    if (ok) { navigate("/admin/dashboard"); }
    else    { setServerErr("Invalid admin credentials."); }
  };

  const INPUT = (hasErr) =>
    `w-full px-[14px] py-[13px] h-[52px] rounded-xl text-base text-white
     placeholder-white/50 outline-none bg-white/10 border backdrop-blur-sm
     transition-all duration-200 focus:bg-white/15
     focus:shadow-[0_0_0_2px_rgba(99,102,241,0.55),0_0_12px_rgba(99,102,241,0.25)]
     hover:border-white/50 ${hasErr ? "border-red-400/70" : "border-white/30"}`;

  return (
    <div className="auth-page-enter relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="auth-bg-zoom absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1920&q=80')" }} />
      </div>
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-indigo-900/40 to-purple-900/50" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />

      {/* card */}
      <div className="auth-card-enter relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl ring-2 ring-white/20 mb-3">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow-lg tracking-tight">Admin Panel</h1>
          <p className="text-white/60 text-sm mt-1">CollegeFinder Administration</p>
        </div>

        <div className="rounded-3xl p-8 shadow-2xl border border-white/20"
          style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>

          {serverErr && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-200 rounded-xl px-4 py-3 mb-4 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />{serverErr}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5">Admin Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="admin@gmail.com" className={INPUT(!!errors.email)} />
              {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="••••••••" className={INPUT(!!errors.password) + " pr-11"} />
                <button type="button" onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 mt-2 rounded-xl text-lg font-bold text-white
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-500 hover:to-purple-500
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-[0_2px_12px_rgba(99,102,241,0.5)]
                hover:shadow-[0_4px_20px_rgba(99,102,241,0.65)]
                transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
                flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Sign In as Admin"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">← Back to App</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
