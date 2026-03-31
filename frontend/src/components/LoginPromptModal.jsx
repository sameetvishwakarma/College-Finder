import { useNavigate } from "react-router-dom";
import { Lock, X } from "lucide-react";
import { useEffect } from "react";

/**
 * Shown whenever a guest tries to use search / filters / quiz.
 * Props:
 *   onClose — called when user dismisses without logging in
 */
export default function LoginPromptModal({ onClose }) {
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-sm p-7 transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Lock icon */}
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-indigo-50 dark:bg-indigo-900/30 mx-auto mb-4">
          <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 text-center mb-1">
          Login Required
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 leading-relaxed">
          Please login first to search colleges, apply filters, or use the quiz.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => { onClose(); navigate("/auth"); }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
