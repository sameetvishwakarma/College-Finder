import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, Moon, Sun, Bookmark, User, LogOut, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { useDarkMode } from "../context/DarkModeContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

/* ── Logout confirmation dialog ─────────────────────────────────────────── */
function LogoutDialog({ onConfirm, onCancel }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-sm p-6 transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-red-50 dark:bg-red-900/20 mx-auto mb-4">
          <LogOut className="h-6 w-6 text-red-500" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 text-center mb-1">
          Sign out?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
          You'll be redirected to the login page.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Logout success toast ────────────────────────────────────────────────── */
function LogoutToast({ visible }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 bg-emerald-600 text-white transition-all duration-300 pointer-events-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ minWidth: 240 }}
    >
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <span className="text-sm font-semibold">Logged out successfully</span>
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────────────────────── */
const Header = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [showDialog,    setShowDialog]    = useState(false);
  const [showToast,     setShowToast]     = useState(false);
  const { dark, toggle } = useDarkMode();
  const { user, logout } = useAuth();
  const { wishlist }     = useWishlist();

  const isActive = (path) => location.pathname === path;

  /* Opens the confirmation dialog */
  const requestLogout = () => {
    setIsMenuOpen(false);
    setShowDialog(true);
  };

  /* Called when user confirms in the dialog */
  const confirmLogout = () => {
    setShowDialog(false);
    logout();                    // clears localStorage + auth state
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/auth");         // redirect to login page
    }, 1400);
  };

  return (
    <>
      {/* ── Confirmation dialog (rendered outside <header> in the fragment) ── */}
      {showDialog && (
        <LogoutDialog
          onConfirm={confirmLogout}
          onCancel={() => setShowDialog(false)}
        />
      )}

      {/* ── Logout toast (rendered outside <header> in the fragment) ── */}
      <LogoutToast visible={showToast} />

      {/* ── Actual header — unchanged structure & classes ── */}
      <header className="sticky top-0 z-50 w-full border-b border-blue-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-slate-900/95 shadow-lg transition-colors duration-300">
        <div className="w-full px-6 md:px-10 flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              CollegeFinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-all duration-300 relative group ${
                isActive("/") ? "text-indigo-600" : "text-slate-700 dark:text-slate-200 hover:text-indigo-600"
              }`}
            >
              Home
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-300 ${isActive("/") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
            <Link
              to="/discover"
              className={`text-sm font-semibold transition-all duration-300 relative group ${
                isActive("/discover") ? "text-indigo-600" : "text-slate-700 dark:text-slate-200 hover:text-indigo-600"
              }`}
            >
              Find Colleges
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-300 ${isActive("/discover") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>

            {/* Wishlist */}
            <Link to="/saved" className="relative text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors duration-200">
              <Bookmark className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 text-slate-700 dark:text-slate-200"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors duration-200"
                >
                  <User className="h-4 w-4" />
                  {user.name?.split(" ")[0]}
                </Link>
                {/* Logout button — now opens confirmation dialog */}
                <button
                  onClick={requestLogout}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 transition-colors duration-200"
                  aria-label="Logout"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              /* ── Desktop Login button ── */
              <Link
                to="/auth"
                className="inline-flex items-center px-5 py-2.5 rounded-xl text-base font-bold text-white
                  bg-gradient-to-r from-indigo-600 to-blue-500
                  hover:from-indigo-500 hover:to-blue-400
                  shadow-[0_2px_8px_rgba(99,102,241,0.45)]
                  hover:shadow-[0_4px_16px_rgba(99,102,241,0.55)]
                  hover:scale-105 active:scale-[0.97]
                  transition-all duration-200"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 text-slate-700 dark:text-slate-200"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
            <nav className="w-full px-6 py-4 flex flex-col gap-4">
              <Link to="/" className={`text-sm font-semibold transition-colors hover:text-indigo-600 ${isActive("/") ? "text-indigo-600" : "text-slate-700 dark:text-slate-200"}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/discover" className={`text-sm font-semibold transition-colors hover:text-indigo-600 ${isActive("/discover") ? "text-indigo-600" : "text-slate-700 dark:text-slate-200"}`} onClick={() => setIsMenuOpen(false)}>Find Colleges</Link>
              <Link to="/saved" className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <Bookmark className="h-4 w-4" /> Saved ({wishlist.length})
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-4 w-4" /> Dashboard
                  </Link>
                  {/* Mobile logout — also opens confirmation dialog */}
                  <button
                    onClick={requestLogout}
                    className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 w-fit"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                /* ── Mobile Login / Sign Up button ── */
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl text-base font-bold text-white
                    bg-gradient-to-r from-indigo-600 to-blue-500
                    hover:from-indigo-500 hover:to-blue-400
                    shadow-[0_2px_8px_rgba(99,102,241,0.45)]
                    hover:shadow-[0_4px_16px_rgba(99,102,241,0.55)]
                    hover:scale-105 active:scale-[0.97]
                    transition-all duration-200"
                >
                  Login / Sign Up
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
