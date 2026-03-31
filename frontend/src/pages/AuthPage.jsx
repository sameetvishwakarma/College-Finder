import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, User, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import { recordLogin } from "../context/AdminContext";

/* ── validation ─────────────────────────────────────────────────────────── */
const validateEmail    = (v) => /^[^\s@]+@gmail\.com$/.test(v);
const validatePassword = (v) =>
  /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v);

/* ── localStorage helpers ───────────────────────────────────────────────── */
const USERS_KEY = "cf_users";
const getUsers  = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; } };
const pushUser  = (u) => { const arr = getUsers(); arr.push(u); localStorage.setItem(USERS_KEY, JSON.stringify(arr)); };

/* ── password strength indicator ───────────────────────────────────────── */
function StrengthBar({ password }) {
  const checks = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length >= 8,
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-lime-400", "bg-emerald-500"];
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0,1,2,3,4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-slate-200 dark:bg-slate-600"}`} />
        ))}
      </div>
      <p className={`text-[11px] font-semibold ${score <= 2 ? "text-red-400" : score <= 3 ? "text-yellow-500" : "text-emerald-500"}`}>
        {labels[score - 1] ?? ""}
      </p>
    </div>
  );
}

/* ── main component ─────────────────────────────────────────────────────── */
export default function AuthPage() {
  const navigate       = useNavigate();
  const { login }      = useAuth();
  const { adminLogin } = useAdmin();
  const [mode, setMode]           = useState("login");
  const [isAdmin, setIsAdmin]     = useState(false);
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState("");
  const [serverErr, setServerErr] = useState("");
  const [errors, setErrors]       = useState({});
  const [form, setForm]           = useState({ name: "", email: "", password: "" });

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Full name is required.";
    if (!validateEmail(form.email))             e.email = "Must be a valid @gmail.com address.";
    if (!validatePassword(form.password))
      e.password = "Needs 1 uppercase, 1 lowercase, 1 number & 1 special character.";
    return e;
  };

  const switchMode = (m) => {
    setMode(m);
    if (m !== "login") setIsAdmin(false);
    setErrors({});
    setServerErr("");
    setSuccess("");
    setForm({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErr("");
    setSuccess("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    await new Promise((r) => setTimeout(r, 700));

    const users = getUsers();

    if (mode === "signup") {
      if (users.find((u) => u.email === form.email)) {
        setServerErr("An account with this email already exists.");
        setLoading(false);
        return;
      }
      pushUser({ name: form.name, email: form.email, password: form.password });
      setSuccess("Account created! Redirecting to login…");
      setLoading(false);
      setTimeout(() => switchMode("login"), 1200);
    } else {
      // ── Admin login ──────────────────────────────────────────────────────
      if (isAdmin) {
        const ok = adminLogin(form.email, form.password);
        setLoading(false);
        if (ok) {
          navigate("/admin/dashboard");
        } else {
          setServerErr("Invalid admin credentials.");
        }
        return;
      }
      // ── User login ───────────────────────────────────────────────────────
      const found = users.find((u) => u.email === form.email && u.password === form.password);
      if (!found) {
        setServerErr("Invalid email or password.");
        setLoading(false);
        return;
      }
      login({ name: found.name, email: found.email });
      recordLogin();
      setLoading(false);
      navigate("/");
    }
  };

  /* ── render ─────────────────────────────────────────────────────────── */
  return (
    <div className="auth-page-enter relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

      {/* background image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="auth-bg-zoom absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80')" }} />
      </div>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-blue-900/40 to-purple-900/50" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed pointer-events-none" />

      {/* glass card */}
      <div className="auth-card-enter relative z-10 w-full max-w-md">

        {/* logo */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2.5 group mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-2xl group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/20">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white drop-shadow-lg tracking-tight">CollegeFinder</span>
          </Link>
          <p className="text-white/70 text-sm font-medium">
            {mode === "signup"
              ? "Join thousands of students finding their dream college."
              : isAdmin
              ? "🛠 Logging in as Admin"
              : "Welcome back! Sign in to continue."}
          </p>
        </div>

        {/* card */}
        <div className="rounded-3xl p-8 shadow-2xl border border-white/20"
          style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>

          {/* Login / Sign Up tabs */}
          <div className="flex rounded-2xl bg-white/10 p-1 mb-4 gap-1">
            {["login", "signup"].map((m) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-3 rounded-xl text-base font-bold tracking-wide transition-all duration-300
                  hover:scale-[1.03] active:scale-[0.97] ${
                  mode === m
                    ? "bg-white text-indigo-700 shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/15"
                }`}>
                {m === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* User / Admin toggle (login only) */}
          {mode === "login" && (
            <div className="flex rounded-xl bg-white/8 border border-white/15 p-0.5 mb-5 gap-0.5">
              {[
                { key: false, label: "User",  Icon: User },
                { key: true,  label: "Admin", Icon: ShieldCheck },
              ].map(({ key, label, Icon }) => (
                <button key={String(key)} type="button"
                  onClick={() => { setIsAdmin(key); setServerErr(""); setErrors({}); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isAdmin === key
                      ? key
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                      : "text-white/55 hover:text-white/80"
                  }`}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          )}

          {serverErr && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-200 rounded-xl px-4 py-3 mb-4 text-sm backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />{serverErr}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 rounded-xl px-4 py-3 mb-4 text-sm backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" />{success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-1.5">Full Name</label>
                <input type="text" value={form.name} onChange={set("name")} placeholder="Your full name"
                  className={`w-full px-[14px] py-[14px] h-[58px] rounded-xl text-lg text-white
                    placeholder-white/50 outline-none bg-white/10 border backdrop-blur-sm
                    transition-all duration-200 focus:bg-white/15
                    focus:shadow-[0_0_0_2px_rgba(99,102,241,0.55),0_0_12px_rgba(99,102,241,0.25)]
                    hover:border-white/50
                    ${errors.name ? "border-red-400/70 shadow-[0_0_0_2px_rgba(248,113,113,0.35)]" : "border-white/30"}`} />
                {errors.name && <p className="text-red-300 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="you@gmail.com"
                className={`w-full px-[14px] py-[14px] h-[58px] rounded-xl text-lg text-white
                  placeholder-white/50 outline-none bg-white/10 border backdrop-blur-sm
                  transition-all duration-200 focus:bg-white/15
                  focus:shadow-[0_0_0_2px_rgba(99,102,241,0.55),0_0_12px_rgba(99,102,241,0.25)]
                  hover:border-white/50
                  ${errors.email ? "border-red-400/70 shadow-[0_0_0_2px_rgba(248,113,113,0.35)]" : "border-white/30"}`} />
              {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="••••••••"
                  className={`w-full px-[14px] py-[14px] h-[58px] pr-14 rounded-xl text-lg text-white
                    placeholder-white/50 outline-none bg-white/10 border backdrop-blur-sm
                    transition-all duration-200 focus:bg-white/15
                    focus:shadow-[0_0_0_2px_rgba(99,102,241,0.55),0_0_12px_rgba(99,102,241,0.25)]
                    hover:border-white/50
                    ${errors.password ? "border-red-400/70 shadow-[0_0_0_2px_rgba(248,113,113,0.35)]" : "border-white/30"}`} />
                <button type="button" onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-200">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
              {mode === "signup" && <StrengthBar password={form.password} />}
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-4 mt-2 rounded-xl text-lg font-bold tracking-wide text-white
                ${isAdmin && mode === "login"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_2px_12px_rgba(147,51,234,0.5)] hover:shadow-[0_4px_20px_rgba(147,51,234,0.65)]"
                  : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 shadow-[0_2px_12px_rgba(99,102,241,0.5)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.65)]"}
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
                flex items-center justify-center gap-2`}>
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {mode === "login" ? (isAdmin ? "Signing in as Admin…" : "Signing in…") : "Creating account…"}</>
              ) : (
                mode === "login"
                  ? (isAdmin ? <><ShieldCheck className="h-4 w-4" /> Sign In as Admin</> : "Sign In")
                  : "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/60 mt-5">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="text-white font-bold underline underline-offset-2 hover:text-indigo-300 transition-colors duration-200">
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>

          <div className="text-center mt-3">
            <Link to="/" className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
