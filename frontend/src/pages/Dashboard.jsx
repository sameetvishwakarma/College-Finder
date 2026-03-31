import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, DollarSign, Percent, Save } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const transformCollege = (college) => ({
  ...college,
  streams: (college.streams ?? []).map((s) => {
    const aided = s.fundingTypes?.find((f) => f.type?.toUpperCase() === "AIDED");
    let cutoff = aided?.meritYears?.[0]?.rounds?.[0]?.cutoffPercentage ?? 0;
    if (typeof cutoff === "string") cutoff = parseInt(cutoff.replace(/[^0-9]/g, "")) || 0;
    let baseFee = aided?.baseFee ?? 0;
    if (typeof baseFee === "string") baseFee = parseInt(baseFee.replace(/[^0-9]/g, "")) || 0;
    return { stream: s.name, cutoff, fee: baseFee, _raw: s };
  }),
});

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ marks: user?.marks || "", stream: user?.stream || "" });

  useEffect(() => {
    if (!user) return; // ProtectedRoute handles redirect
    fetch("http://localhost:5000/api/colleges/allcolleges")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setColleges(list.map(transformCollege));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const recommended = useMemo(() => {
    if (!user?.marks || !user?.stream) return [];
    const marks = parseFloat(user.marks);
    return colleges
      .filter((c) =>
        c.streams.some(
          (s) =>
            s.stream?.toLowerCase() === user.stream?.toLowerCase() &&
            s.cutoff <= marks &&
            s.stream?.toLowerCase() !== "bifocal"
        )
      )
      .slice(0, 6);
  }, [colleges, user]);

  const handleSave = () => {
    updateProfile({ marks: form.marks, stream: form.stream });
    setEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      <main className="flex-1 w-full px-6 md:px-10 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 mb-8 transition-colors duration-300">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing((e) => !e)}
                className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-200"
              >
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              {[
                { icon: Percent, label: "Marks", value: user.marks ? `${user.marks}%` : "Not set", color: "text-indigo-600 dark:text-indigo-400" },
                { icon: BookOpen, label: "Stream", value: user.stream || "Not set", color: "text-blue-600 dark:text-blue-400" },
                { icon: DollarSign, label: "Recommendations", value: recommended.length, color: "text-emerald-600 dark:text-emerald-400" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit form */}
            {editing && (
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Your Marks (%)</label>
                  <input
                    type="number" min="0" max="100"
                    value={form.marks}
                    onChange={(e) => setForm((f) => ({ ...f, marks: e.target.value }))}
                    placeholder="e.g. 82"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Preferred Stream</label>
                  <select
                    value={form.stream}
                    onChange={(e) => setForm((f) => ({ ...f, stream: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">Select stream</option>
                    {["Science", "Commerce", "Arts"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-sm font-bold shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Colleges */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
              🎓 Recommended Colleges for You
            </h2>

            {!user.marks || !user.stream ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-600 p-10 text-center transition-colors duration-300">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Set your marks and stream in your profile to see personalized recommendations.</p>
              </div>
            ) : loading ? (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">Loading recommendations...</div>
            ) : recommended.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-10 text-center transition-colors duration-300">
                <p className="text-slate-500 dark:text-slate-400 text-sm">No colleges found matching your profile. Try updating your marks or stream.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommended.map((college) => {
                  const matchStream = college.streams.find(
                    (s) => s.stream?.toLowerCase() === user.stream?.toLowerCase()
                  );
                  return (
                    <div key={college._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5 shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{college.name}</h3>
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                          ⭐ Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">📍 {college.address?.area}, {college.address?.city}</p>
                      {matchStream && (
                        <div className="flex gap-3 text-xs">
                          <span className="text-slate-600 dark:text-slate-300">Cutoff: <strong>{matchStream.cutoff}%</strong></span>
                          <span className="text-slate-600 dark:text-slate-300">Fee: <strong>₹{matchStream.fee?.toLocaleString()}</strong></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
