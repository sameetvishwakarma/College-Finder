import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, School, MapPin, GraduationCap, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WishlistToast from "../components/WishlistToast";
import { useWishlist } from "../context/WishlistContext";

/* stream → colour mapping for badges */
const STREAM_COLORS = {
  Science:  { bg: "bg-blue-100 dark:bg-blue-900/30",   text: "text-blue-700 dark:text-blue-300",   dot: "bg-blue-500"   },
  Commerce: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  Arts:     { bg: "bg-purple-100 dark:bg-purple-900/30",text: "text-purple-700 dark:text-purple-300",dot: "bg-purple-500"},
};
const defaultColor = { bg: "bg-slate-100 dark:bg-slate-700", text: "text-slate-600 dark:text-slate-300", dot: "bg-slate-400" };

export default function SavedColleges() {
  const { wishlist, toggle } = useWishlist();
  const [toast, setToast]   = useState(null);

  const handleRemove = (college) => {
    toggle(college);
    setToast({ added: false, name: college.name });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      <WishlistToast toast={toast} onDone={() => setToast(null)} />

      <main className="flex-1 w-full px-6 md:px-10 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Saved Colleges</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {wishlist.length > 0
                    ? `${wishlist.length} college${wishlist.length !== 1 ? "s" : ""} in your wishlist`
                    : "Your wishlist is empty"}
                </p>
              </div>
            </div>
            {wishlist.length > 0 && (
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-200"
              >
                Browse more <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Empty state */}
          {wishlist.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-600 p-16 text-center transition-colors duration-300 shadow-sm">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20 mb-5 shadow-inner">
                <Heart className="h-9 w-9 text-rose-300 dark:text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No saved colleges yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
                Tap the ❤️ on any college card to save it here for quick access.
              </p>
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <GraduationCap className="h-4 w-4" /> Explore Colleges
              </Link>
            </div>
          )}

          {/* College grid */}
          {wishlist.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlist.map((college) => {
                const streams = (college.streams || []).filter(
                  (s) => s.stream?.toLowerCase() !== "bifocal"
                );
                return (
                  <div
                    key={college._id}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Card top accent bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400" />

                    <div className="p-5">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center mt-0.5">
                            <School className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                              {college.name}
                            </h3>
                            {college.code && (
                              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Code: {college.code}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove heart button */}
                        <button
                          onClick={() => handleRemove(college)}
                          title="Remove from wishlist"
                          className="shrink-0 p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:text-rose-600 transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                          <Heart className="h-4 w-4 fill-rose-500" />
                        </button>
                      </div>

                      {/* Location */}
                      {(college.address?.area || college.address?.city) && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {[college.address?.area, college.address?.city].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}

                      {/* Stream badges */}
                      {streams.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {streams.map((s) => {
                            const c = STREAM_COLORS[s.stream] ?? defaultColor;
                            return (
                              <span
                                key={s.stream}
                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                                {s.stream}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
