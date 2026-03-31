import { useEffect, useState } from "react";
import { Heart, HeartOff, X } from "lucide-react";

/**
 * Usage:
 *   const [toast, setToast] = useState(null);
 *   setToast({ added: true, name: "RJ College" });
 *   <WishlistToast toast={toast} onDone={() => setToast(null)} />
 */
export default function WishlistToast({ toast, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300); // wait for fade-out
    }, 2500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${
        toast.added
          ? "bg-indigo-600 border-indigo-500 text-white"
          : "bg-slate-800 border-slate-600 text-slate-100"
      }`}
      style={{ minWidth: 260, maxWidth: "90vw" }}
    >
      {toast.added
        ? <Heart className="h-4 w-4 fill-white shrink-0" />
        : <HeartOff className="h-4 w-4 shrink-0 text-slate-300" />
      }
      <span className="text-sm font-semibold truncate">
        {toast.added ? "Saved to wishlist ✅" : "Removed from wishlist"}
      </span>
      <button
        onClick={() => { setVisible(false); setTimeout(onDone, 300); }}
        className="ml-auto shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
