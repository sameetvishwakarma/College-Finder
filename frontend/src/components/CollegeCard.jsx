import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const STREAM_COLORS = {
  Arts: { 
    bg: "linear-gradient(135deg, #fce7f3, #ede9fe)", 
    accent: "#c084fc", 
    light: "#faf5ff", 
    border: "#c084fc", 
    tag: "rgba(192, 132, 252, 0.1)",
    shadow: "0 8px 20px rgba(192, 132, 252, 0.15)",
    hoverShadow: "0 12px 28px rgba(192, 132, 252, 0.25)"
  },
  Science: { 
    bg: "linear-gradient(135deg, #e0f2fe, #dbeafe)", 
    accent: "#3b82f6", 
    light: "#eff6ff", 
    border: "#93c5fd", 
    tag: "rgba(59, 130, 246, 0.1)",
    shadow: "0 8px 20px rgba(59, 130, 246, 0.15)",
    hoverShadow: "0 12px 28px rgba(59, 130, 246, 0.25)"
  },
  Commerce: { 
    bg: "linear-gradient(135deg, #fef3c7, #fde68a)", 
    accent: "#f59e0b", 
    light: "#fffbeb", 
    border: "#f59e0b", 
    tag: "rgba(245, 158, 11, 0.1)",
    shadow: "0 8px 20px rgba(245, 158, 11, 0.15)",
    hoverShadow: "0 12px 28px rgba(245, 158, 11, 0.25)"
  },
};

const FUNDING_LABELS = {
  AIDED: "Aided",
  UNAIDED: "Unaided",
  SELF_FINANCED: "Self Financed",
  MINORITY: "Minority",
};

const GROUP_LABELS = {
  LANGUAGE: "Language",
  CORE: "Core",
  OPTIONAL: "Optional",
};

function SubjectGroup({ group, color }) {
  if (!group?.subjects || group.subjects.length === 0) {
    return null;
  }
  
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: color.accent, background: color.tag, padding: "2px 8px", borderRadius: 20 }}>
          {GROUP_LABELS[group.groupType] || group.groupType}
        </span>
        <span style={{ fontSize: 11, color: "#888" }}>pick up to {group.maxSelectable || 1}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {group.subjects.map((s) => (
          <div key={s.name} style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 8, padding: "4px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{s.name}</span>
            {s.minPercentageRequired && <span style={{ color: "#aaa", fontSize: 11 }}>≥{s.minPercentageRequired}%</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CutoffTable({ meritYears }) {
  if (!meritYears || meritYears.length === 0) {
    return <div style={{ fontSize: 12, color: "#999", textAlign: "center", padding: "8px 0" }}>No cutoff data available</div>;
  }
  
  const [selectedYear, setSelectedYear] = useState(meritYears[0]?.year);
  const yearData = meritYears.find((y) => y.year === selectedYear);
  
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
        {meritYears.map((y) => (
          <button key={y.year} onClick={() => setSelectedYear(y.year)}
            style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: "none", cursor: "pointer", background: selectedYear === y.year ? "#1a1a1a" : "#f0f0f0", color: selectedYear === y.year ? "#fff" : "#555", transition: "all 0.15s" }}>
            {y.year}
          </button>
        ))}
      </div>
      {yearData?.rounds && yearData.rounds.length > 0 ? (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {yearData.rounds.map((r) => (
            <div key={r.roundNumber} style={{ flex: 1, minWidth: 80, textAlign: "center", background: "#f9f9f9", borderRadius: 8, padding: "6px 4px", border: "1px solid #ececec" }}>
              <div style={{ fontSize: 10, color: "#aaa", marginBottom: 2 }}>Round {r.roundNumber}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{r.cutoffPercentage}%</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: "#999", textAlign: "center", padding: "8px 0" }}>No rounds data</div>
      )}
    </div>
  );
}

function FundingCard({ funding, color }) {
  const [open, setOpen] = useState(false);
  const hasCutoffs = funding.meritYears && funding.meritYears.length > 0;
  return (
    <div style={{ border: `1px solid ${color.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 8, background: "#fff" }}>
      <div
        onClick={() => hasCutoffs && setOpen(!open)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", cursor: hasCutoffs ? "pointer" : "default", background: open ? color.tag : "#fff", transition: "background 0.15s" }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: color.accent }}>{FUNDING_LABELS[funding.type]}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a" }}>₹{funding.baseFee.toLocaleString()}/yr</span>
          {hasCutoffs && (
            <span style={{ fontSize: 16, color: color.accent, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
          )}
        </div>
      </div>
      {open && hasCutoffs && (
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${color.border}`, background: color.light }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Merit Cutoffs</div>
          <CutoffTable meritYears={funding.meritYears} />
        </div>
      )}
    </div>
  );
}

// stream here is the raw stream object { name, subjectGroups, fundingTypes }
function StreamCard({ stream, showToggle, onToggle, allStreams, selectedFilter }) {
  const color = STREAM_COLORS[stream.name] || STREAM_COLORS.Arts;
  const [tab, setTab] = useState("subjects");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="transition-all duration-300 hover:-translate-y-1"
      style={{ 
        border: `1px solid ${color.border}`, 
        borderRadius: 16, 
        overflow: "hidden", 
        background: color.bg,
        boxShadow: color.shadow,
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = color.hoverShadow}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = color.shadow}
    >
      <div style={{ background: "rgba(255,255,255,0.6)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: color.accent, letterSpacing: "0.02em" }}>{stream.name}</span>
        {showToggle && (
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="transition-all duration-300 hover:scale-105"
              style={{
                padding: "6px 12px",
                background: "rgba(255,255,255,0.8)",
                color: color.accent,
                border: `1px solid ${color.border}`,
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              {selectedFilter}
            </button>
            {isDropdownOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-xl z-50 py-2"
                style={{ 
                  border: '1px solid #e2e8f0',
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                {allStreams.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => {
                      onToggle(s.name);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      selectedFilter === s.name
                        ? 'text-white'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                    style={{
                      background: selectedFilter === s.name ? color.accent : 'transparent'
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${color.border}`, background: "rgba(255,255,255,0.5)" }}>
        {["subjects", "fees"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "10px 0", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", background: tab === t ? "#fff" : "transparent", color: tab === t ? color.accent : "#999", borderBottom: tab === t ? `3px solid ${color.accent}` : "3px solid transparent", textTransform: "capitalize", transition: "all 0.15s" }}>
            {t === "subjects" ? "Subjects" : "Fees & Cutoffs"}
          </button>
        ))}
      </div>
      <div style={{ padding: "16px 18px", background: "#fff" }}>
        {tab === "subjects" && stream.subjectGroups?.length > 0
          ? stream.subjectGroups.map((g) => (
            <SubjectGroup key={g.groupType} group={g} color={color} />
          ))
          : tab === "subjects" && (!stream.subjectGroups || stream.subjectGroups.length === 0)
          ? <div style={{ textAlign: "center", padding: "20px", color: "#999", fontSize: 13 }}>No subjects available</div>
          : null
        }
        {tab === "fees" && stream.fundingTypes?.length > 0
          ? stream.fundingTypes.map((f) => (
            <FundingCard key={f.type} funding={f} color={color} />
          ))
          : tab === "fees" && (!stream.fundingTypes || stream.fundingTypes.length === 0)
          ? <div style={{ textAlign: "center", padding: "20px", color: "#999", fontSize: 13 }}>No fee information available</div>
          : null
        }
      </div>
    </div>
  );
}

export default function CollegeCard({ college, filteredStreams, selectedStream, onStreamSelect }) {
  const [selectedStreamFilter, setSelectedStreamFilter] = useState(null);
  
  // Build a map from stream name → raw stream data for quick lookup
  const rawStreamMap = Object.fromEntries(
    (college.streams || []).map((s) => [s.stream, s._raw])
  );

  // Resolve which raw streams to render based on filteredStreams
  const streamsToRender = (filteredStreams || [])
    .map((fs) => rawStreamMap[fs.stream])
    .filter(Boolean);

  // Update selected stream when streamsToRender changes
  useEffect(() => {
    if (streamsToRender.length > 0) {
      // If current selection is not in the new list, reset to first stream
      const isCurrentValid = streamsToRender.some(s => s.name === selectedStreamFilter);
      if (!isCurrentValid) {
        setSelectedStreamFilter(streamsToRender[0].name);
      }
    } else {
      setSelectedStreamFilter(null);
    }
  }, [streamsToRender.map(s => s.name).join(',')]); // Re-run when stream names change

  // Show only selected stream
  const displayStreams = selectedStreamFilter
    ? streamsToRender.filter(s => s.name === selectedStreamFilter)
    : streamsToRender.slice(0, 1); // Fallback to first stream if none selected

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", borderRadius: 20, padding: "24px 28px", marginBottom: 24, color: "#fff", position: "relative", overflow: "hidden", minHeight: 200, display: "flex", flexDirection: "column", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -50, right: 60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>Junior College</div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.3, wordWrap: "break-word" }}>{college.name}</h1>
              <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 12, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span>📍</span>
                <span>{college.address.area}, {college.address.city}, {college.address.state} — {college.address.pincode}</span>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.12)", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Code</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0", marginTop: 2 }}>{college.code}</div>
            </div>
          </div>
          {/* Stream badges */}
          <div style={{ display: "flex", gap: 6, marginTop: "auto", paddingTop: 12, flexWrap: "wrap" }}>
            {streamsToRender.map((s) => (
              <span key={s.name} style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,0.1)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)" }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stream Cards Grid */}
      <div className="w-full" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        {displayStreams.length > 0 ? (
          displayStreams.map((stream) => (
            <div key={stream.name} className="animate-in fade-in duration-300 w-full">
              <StreamCard 
                stream={stream} 
                showToggle={streamsToRender.length > 1}
                onToggle={(streamName) => setSelectedStreamFilter(streamName)}
                allStreams={streamsToRender}
                selectedFilter={selectedStreamFilter}
              />
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "#f9fafb", borderRadius: 16, border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>No stream data available</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Stream information is not configured for this college</div>
          </div>
        )}
      </div>
    </div>
  );
}