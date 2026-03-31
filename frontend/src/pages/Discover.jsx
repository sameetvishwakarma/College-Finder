import { useState, useMemo, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CollegeFilters from "../components/CollegeFilters";
import CollegeCard from "../components/CollegeCard";
import CollegeQuiz from "../components/CollegeQuiz";
import ApplicationChecklist from "../components/ApplicationChecklist";
import { School, Filter, Loader2, Heart, Sparkles, ClipboardList, X } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import WishlistToast from "../components/WishlistToast";
import LoginPromptModal from "../components/LoginPromptModal";
import { useAuth } from "../context/AuthContext";

// ─── Fee ranges used by the filter ──────────────────────────────────────────
const feeRanges = [
  { value: "0-5000", label: "Under ₹5,000", min: 0, max: 5000 },
  { value: "5000-10000", label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { value: "10000-20000", label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { value: "20000+", label: "Above ₹20,000", min: 20000, max: null },
];

// ─── Transform raw API college into the shape filter logic expects ───────────
//
// Root-cause fix: the DB stores meritYears INSIDE each fundingType entry.
// Many streams have no AIDED funding — only UNAIDED / SELF_FINANCED.
// Previously we only looked at the AIDED entry, so cutoff & fee were 0
// for most streams, causing the quiz budget filter to eliminate everything.
//
// Fix: scan ALL fundingTypes in priority order (AIDED → UNAIDED → any)
// to find the best available cutoff and the lowest base fee.
const toNum = (v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseInt(v.replace(/[^0-9]/g, "")) || 0;
  return 0;
};

const FUNDING_PRIORITY = ["AIDED", "UNAIDED", "SELF_FINANCED", "MINORITY"];

const transformCollege = (college) => ({
  ...college,
  streams: (college.streams ?? []).map((s) => {
    const fundingTypes = s.fundingTypes ?? [];

    // Sort funding types by priority so AIDED is preferred
    const sorted = [...fundingTypes].sort(
      (a, b) =>
        FUNDING_PRIORITY.indexOf(a.type?.toUpperCase()) -
        FUNDING_PRIORITY.indexOf(b.type?.toUpperCase())
    );

    // Pick the first funding type that has cutoff data; fall back to first available
    const withCutoff = sorted.find(
      (f) => f.meritYears?.length > 0 && f.meritYears[0]?.rounds?.length > 0
    );
    const primary = withCutoff ?? sorted[0];

    // Extract cutoff — prefer Round 1 of the latest year
    let cutoff = 0;
    if (primary?.meritYears?.length > 0) {
      const latestYear = primary.meritYears[primary.meritYears.length - 1];
      const round1 = latestYear?.rounds?.find((r) => r.roundNumber === 1) ?? latestYear?.rounds?.[0];
      cutoff = toNum(round1?.cutoffPercentage ?? 0);
    }

    // Use the lowest NON-ZERO baseFee across all funding types so budget filter is fair.
    // If every funding type has baseFee 0 / missing, set baseFee = -1 as a sentinel
    // meaning "fee unknown" — the quiz budget filter will skip the fee check for these.
    const lowestFee = sorted.reduce((min, f) => {
      const fee = toNum(f.baseFee);
      return fee > 0 && fee < min ? fee : min;
    }, Infinity);
    const baseFee = lowestFee === Infinity ? -1 : lowestFee;

    console.debug(
      `[transform] ${college.name} | ${s.name} → cutoff: ${cutoff}, fee: ${baseFee}, fundingTypes: ${fundingTypes.map((f) => f.type + "(" + toNum(f.baseFee) + ")").join(",")}`
    );

    return { stream: s.name, cutoff, fee: baseFee, _raw: s };
  }),
});
// ────────────────────────────────────────────────────────────────────────────

// ─── Checklist modal ─────────────────────────────────────────────────────────
function ChecklistModal({ collegeName, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate pr-4">{collegeName}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ApplicationChecklist />
      </div>
    </div>
  );
}

// ─── College card wrapper with wishlist + checklist + best match ─────────────
function CollegeCardWrapper({ college, filteredStreams, collegeStreamSelection, setCollegeStreamSelection, isBestMatch, onToast }) {
  const { toggle, isSaved } = useWishlist();
  const saved = isSaved(college._id);
  const [showChecklist, setShowChecklist] = useState(false);

  const handleWishlist = () => {
    const added = toggle(college);
    // toggle returns true if added, false if removed
    // Because setState is async, we derive from current saved state
    onToast({ added: !saved, name: college.name });
  };

  return (
    <div className="relative group">
      {/* Best Match badge */}
      {isBestMatch && (
        <div className="absolute -top-3 left-4 z-10 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold shadow-lg">
          <Sparkles className="h-3 w-3" /> Best Match
        </div>
      )}

      {/* Action buttons — always visible on mobile, hover-reveal on desktop */}
      <div className="absolute top-3 right-3 z-10 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
        {/* Checklist */}
        <button
          onClick={() => setShowChecklist(true)}
          title="View Application Checklist"
          className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 shadow-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 hover:scale-110"
        >
          <ClipboardList className="h-4 w-4" />
        </button>

        {/* Heart / Wishlist — always visible */}
        <button
          onClick={handleWishlist}
          title={saved ? "Remove from saved" : "Save to wishlist"}
          className={`p-2 rounded-xl border shadow-md transition-all duration-200 hover:scale-110 active:scale-95 ${saved
              ? "bg-rose-500 border-rose-500 text-white hover:bg-rose-600 hover:border-rose-600"
              : "bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-600 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-300 hover:text-rose-500"
            }`}
        >
          <Heart className={`h-4 w-4 transition-all duration-200 ${saved ? "fill-white" : ""}`} />
        </button>
      </div>

      <CollegeCard
        college={college}
        filteredStreams={filteredStreams}
        selectedStream={collegeStreamSelection[college._id]}
        onStreamSelect={(stream) =>
          setCollegeStreamSelection((prev) => ({ ...prev, [college._id]: stream }))
        }
      />

      {showChecklist && (
        <ChecklistModal collegeName={college.name} onClose={() => setShowChecklist(false)} />
      )}
    </div>
  );
}

// ─── Main Discover page ───────────────────────────────────────────────────────
const Discover = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [percentageRange, setPercentageRange] = useState("all");
  const [feeRange, setFeeRange] = useState("all");
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [collegeStreamSelection, setCollegeStreamSelection] = useState({});

  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [toast, setToast] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { user } = useAuth();

  // Guard: if not logged in, show modal and return true (caller should bail out)
  const guard = () => {
    if (!user) { setShowLoginPrompt(true); return true; }
    return false;
  };

  // ─── Fetch colleges from API ─────────────────────────────────────────────
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://college-finder-7xrp.onrender.com/api/colleges/allcolleges");
        if (!response.ok) throw new Error(`Failed to fetch colleges (${response.status})`);
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setColleges(list.map(transformCollege));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  // College names for autocomplete
  const collegeNames = useMemo(() => colleges.map((c) => c.name), [colleges]);

  // ─── Smart filter logic ───────────────────────────────────────────────────
  // When user picks "70% – 75%", show ALL colleges with cutoff <= 75
  // (i.e. student scoring in that range can get admission)
  const filteredColleges = useMemo(() => {
    // If quiz results are active, use those instead
    if (quizResults) return quizResults.results;

    const results = [];

    for (const college of colleges) {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !college.name.toLowerCase().includes(query) &&
          !college.code?.toLowerCase().includes(query)
        ) continue;
      }

      // Filter streams within each college (exclude Bifocal)
      const matchingStreams = college.streams.filter((streamData) => {
        const streamName = streamData.stream?.toLowerCase();
        if (streamName === "bifocal") return false;

        // Stream filter
        if (
          selectedStreams.length > 0 &&
          !selectedStreams.some((s) => s.toLowerCase() === streamName)
        ) return false;

        // ── Smart percentage filter ──────────────────────────────────────
        // Parse "70% – 75%" → maxPercentage = 75
        // Show colleges where cutoff <= maxPercentage (student can get in)
        if (percentageRange !== "all") {
          const parts = percentageRange.split(/\s*[–-]\s*/);
          if (parts.length === 2) {
            const maxPercentage = parseInt(parts[1].replace(/[^0-9]/g, "")) || 100;
            let cutoff = streamData.cutoff;
            if (typeof cutoff === "string") cutoff = parseInt(cutoff.replace(/[^0-9]/g, "")) || 0;
            // Only show if cutoff <= student's max marks (student is eligible)
            if (cutoff > maxPercentage) return false;
          }
        }

        // Fee range filter
        if (feeRange !== "all") {
          const selectedFeeRange = feeRanges.find((f) => f.value === feeRange);
          if (selectedFeeRange) {
            let streamFee = streamData.fee;
            if (typeof streamFee === "string") streamFee = parseInt(streamFee.replace(/[^0-9]/g, "")) || 0;
            if (selectedFeeRange.max !== null && streamFee >= selectedFeeRange.max) return false;
            if (streamFee < selectedFeeRange.min) return false;
          }
        }

        return true;
      });

      if (matchingStreams.length > 0) {
        results.push({ college, filteredStreams: matchingStreams, isBestMatch: false });
      }
    }

    return results;
  }, [colleges, searchQuery, percentageRange, feeRange, selectedStreams, quizResults]);

  const totalStreamsCount = filteredColleges.reduce((acc, item) => acc + item.filteredStreams.length, 0);

  // Handle quiz completion
  const handleQuizResults = (results, params) => {
    setQuizResults({ results, params });
    setShowQuiz(false);
  };

  // Clear quiz results and go back to normal filters
  const clearQuiz = () => {
    setQuizResults(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      {/* Wishlist toast notification */}
      <WishlistToast toast={toast} onDone={() => setToast(null)} />
      {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}

      <main className="flex-1">
        {/* Page Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 border-b border-slate-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
          <div className="absolute top-10 right-10 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse-slow" />
          <div className="w-full px-6 md:px-10 py-12 relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/20">
                <School className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg" style={{ letterSpacing: "0.01em" }}>
                Discover Colleges
              </h1>
            </div>
            <p className="text-white/95 text-lg drop-shadow font-medium" style={{ lineHeight: "1.75" }}>
              Filter and find junior colleges based on your eligibility and preferences.
            </p>
            {/* Quiz trigger button */}
            <button
              onClick={() => {
                if (guard()) return;
                setShowQuiz((v) => !v);
                clearQuiz();
              }}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-bold backdrop-blur-sm transition-all duration-200 hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" />
              {showQuiz ? "Hide Quiz" : "🎯 Find My College (Quiz)"}
            </button>
          </div>
        </div>

        {/* Filters & Results */}
        <div className="w-full px-6 md:px-10 py-8">

          {/* Multi-step Quiz */}
          {showQuiz && (
            <CollegeQuiz
              colleges={colleges}
              onResults={handleQuizResults}
              onClose={() => setShowQuiz(false)}
              onAuthRequired={guard}
            />
          )}

          {/* Quiz results banner */}
          {quizResults && (
            <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl px-5 py-3 mb-6 transition-colors duration-300">
              <div className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300 font-semibold">
                <Sparkles className="h-4 w-4" />
                Showing quiz results — {quizResults.params.marks}% · {quizResults.params.stream} · {quizResults.params.budget} budget
                <span className="ml-1 font-normal text-indigo-500 dark:text-indigo-400">({quizResults.results.length} colleges found)</span>
              </div>
              <button
                onClick={clearQuiz}
                className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200 underline transition-colors"
              >
                Clear & use filters
              </button>
            </div>
          )}

          {/* Normal filters — hidden when quiz results are active */}
          {!quizResults && (
            <CollegeFilters
              searchQuery={searchQuery}
              setSearchQuery={(v) => { if (guard()) return; setSearchQuery(v); }}
              percentageRange={percentageRange}
              setPercentageRange={(v) => { if (guard()) return; setPercentageRange(v); }}
              feeRange={feeRange}
              setFeeRange={(v) => { if (guard()) return; setFeeRange(v); }}
              selectedStreams={selectedStreams}
              setSelectedStreams={(v) => { if (guard()) return; setSelectedStreams(v); }}
              collegeNames={collegeNames}
            />
          )}

          {/* Results Header */}
          {!loading && !error && (
            <div className="flex items-center justify-between mb-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-xl p-5 shadow-xl border border-indigo-100/50 dark:border-slate-700 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-indigo-600" />
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  Showing{" "}
                  <span className="font-bold text-indigo-600">{filteredColleges.length}</span>{" "}
                  colleges ·{" "}
                  <span className="font-bold text-indigo-600">{totalStreamsCount}</span>{" "}
                  streams
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-indigo-100/50 dark:border-slate-700">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">Loading colleges...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-red-100/50 dark:border-slate-700">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                <School className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Failed to load colleges</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 font-bold hover:scale-[1.03] shadow-lg hover:shadow-xl"
              >
                Retry
              </button>
            </div>
          )}

          {/* College Grid */}
          {!loading && !error && filteredColleges.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredColleges.map(({ college, filteredStreams, isBestMatch }, index) => (
                <div
                  key={college._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CollegeCardWrapper
                    college={college}
                    filteredStreams={filteredStreams}
                    collegeStreamSelection={collegeStreamSelection}
                    setCollegeStreamSelection={setCollegeStreamSelection}
                    isBestMatch={!!isBestMatch}
                    onToast={setToast}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredColleges.length === 0 && (
            <div className="text-center py-16 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-indigo-100/50 dark:border-slate-700">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 mb-6 shadow-lg">
                <School className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">No colleges found</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {quizResults
                  ? "No colleges found based on your preferences. Try a higher budget range or different stream."
                  : "Try adjusting your filters. You might need to expand your percentage range or select different streams."}
              </p>
              {quizResults && (
                <button onClick={clearQuiz} className="mt-4 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors">
                  Back to Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Discover;
