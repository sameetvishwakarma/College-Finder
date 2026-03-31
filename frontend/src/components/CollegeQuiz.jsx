import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

const STEPS = ["Marks", "Stream", "Budget"];

const BUDGET_MAP = {
  //  low  : fee < 10000
  //  medium: 10000 <= fee < 20000
  //  high : fee >= 20000
  low:    { min: 0,     max: 10000 },
  medium: { min: 10000, max: 20000 },
  high:   { min: 20000, max: Infinity },
};

// Safely coerce any value to a number
const toNum = (v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseInt(v.replace(/[^0-9]/g, "")) || 0;
  return 0;
};

// Return fee as-is (preserves -1 sentinel for unknown fee)
const getStreamFee    = (s) => (typeof s.fee === "number" ? s.fee : toNum(s.fee));
const getStreamCutoff = (s) => toNum(s.cutoff);

export default function CollegeQuiz({ colleges, onResults, onClose, onAuthRequired }) {
  const [step, setStep] = useState(0);
  const [marks, setMarks] = useState("");
  const [stream, setStream] = useState("");
  const [budget, setBudget] = useState("");
  const [marksError, setMarksError] = useState("");

  const next = () => {
    if (step === 0) {
      const val = parseFloat(marks);
      if (isNaN(val) || val < 0 || val > 100) {
        setMarksError("Please enter a valid percentage between 0 and 100.");
        return;
      }
      setMarksError("");
    }
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

  const handleFind = () => {
    const userMarks   = parseFloat(marks);
    const budgetRange = BUDGET_MAP[budget];

    // ── Debug: log user inputs ──────────────────────────────────────────────
    console.log("[Quiz] User inputs →", { marks: userMarks, stream, budget, budgetRange });
    console.log("[Quiz] Total colleges to scan:", colleges.length);

    const results = [];

    for (const college of colleges) {
      const matchingStreams = (college.streams || []).filter((s) => {
        // Exclude Bifocal
        if (s.stream?.toLowerCase() === "bifocal") return false;

        // 1. Stream match (case-insensitive exact match)
        if (stream && s.stream?.toLowerCase() !== stream.toLowerCase()) {
          console.debug(`[Quiz] SKIP ${college.name}/${s.stream}: stream mismatch (want "${stream}")`);
          return false;
        }

        // 2. Cutoff check: student marks must be >= cutoff
        const cutoff = getStreamCutoff(s);
        if (cutoff > userMarks) {
          console.debug(`[Quiz] SKIP ${college.name}/${s.stream}: cutoff ${cutoff} > marks ${userMarks}`);
          return false;
        }

        // 3. Budget check: skip entirely if fee is unknown (-1 sentinel)
        //    This handles colleges where baseFee is missing in the DB.
        const fee = getStreamFee(s);
        if (fee !== -1) {
          if (fee < budgetRange.min || fee >= budgetRange.max) {
            console.debug(`[Quiz] SKIP ${college.name}/${s.stream}: fee ${fee} outside [${budgetRange.min}, ${budgetRange.max})`);
            return false;
          }
        }

        console.debug(`[Quiz] MATCH ${college.name}/${s.stream}: cutoff ${cutoff}, fee ${fee}`);
        return true;
      });

      if (matchingStreams.length > 0) {
        // "Best Match": cutoff is within 5 percentage points of user marks
        const isBestMatch = matchingStreams.some(
          (s) => Math.abs(getStreamCutoff(s) - userMarks) <= 5
        );
        results.push({ college, filteredStreams: matchingStreams, isBestMatch });
      }
    }

    // Sort: best matches first, then by closest cutoff to user marks
    results.sort((a, b) => {
      if (b.isBestMatch !== a.isBestMatch) return b.isBestMatch ? 1 : -1;
      // Among equal best-match status, sort by how close the cutoff is
      const aCutoff = Math.max(...a.filteredStreams.map(getStreamCutoff));
      const bCutoff = Math.max(...b.filteredStreams.map(getStreamCutoff));
      return Math.abs(bCutoff - userMarks) - Math.abs(aCutoff - userMarks);
    });

    // ── Debug: log results ──────────────────────────────────────────────────
    console.log(
      "[Quiz] Results (",
      results.length,
      "):",
      results.map((r) => ({
        name:    r.college.name,
        streams: r.filteredStreams.map((s) => `${s.stream} cutoff:${getStreamCutoff(s)} fee:${getStreamFee(s)}`),
        best:    r.isBestMatch,
      }))
    );

    onResults(results, { marks: userMarks, stream, budget });
  };

  const progress = ((step) / STEPS.length) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-indigo-100 dark:border-slate-700 p-6 mb-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">🎯 Find My College</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold transition-colors">✕</button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progress + (100 / STEPS.length)}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-all duration-300 ${
              i < step ? "bg-indigo-600 text-white" : i === step ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 ring-2 ring-indigo-400" : "bg-slate-100 dark:bg-slate-700 text-slate-400"
            }`}>
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`h-px w-6 ${i < step ? "bg-indigo-400" : "bg-slate-200 dark:bg-slate-600"}`} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[120px]">
        {step === 0 && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">What are your marks (%)?</label>
            <input
              type="number"
              min="0"
              max="100"
              value={marks}
              onChange={(e) => { setMarks(e.target.value); setMarksError(""); }}
              placeholder="e.g. 78"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
            />
            {marksError && <p className="text-red-500 text-xs mt-1">{marksError}</p>}
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Which stream are you interested in?</label>
            <div className="grid grid-cols-3 gap-3">
              {["Science", "Commerce", "Arts"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStream(s)}
                  className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] ${
                    stream === s
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300"
                  }`}
                >
                  {s === "Science" ? "🔬" : s === "Commerce" ? "📊" : "🎨"} {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">What's your budget?</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "low", label: "Low", sub: "Under ₹10k" },
                { key: "medium", label: "Medium", sub: "₹10k–₹20k" },
                { key: "high", label: "High", sub: "Above ₹20k" },
              ].map(({ key, label, sub }) => (
                <button
                  key={key}
                  onClick={() => setBudget(key)}
                  className={`py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] ${
                    budget === key
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300"
                  }`}
                >
                  <div>{label}</div>
                  <div className="text-xs font-normal opacity-70 mt-0.5">{sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={back}
          disabled={step === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={next}
            disabled={step === 1 && !stream}
            className="flex items-center gap-1 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              if (onAuthRequired?.()) return; // guest — show login modal
              handleFind();
            }}
            disabled={!budget}
            className="flex items-center gap-1 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Find Colleges 🎯
          </button>
        )}
      </div>
    </div>
  );
}
