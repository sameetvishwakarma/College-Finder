import { createContext, useContext, useState, useEffect } from "react";
import { colleges as SEED_COLLEGES } from "../data/colleges";

const ADMIN_EMAIL    = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin@123";

const ADMIN_KEY            = "cf_admin";
const COLLEGES_KEY         = "cf_admin_colleges";
const CHECKLIST_KEY        = "cf_admin_checklist";
const LOGIN_VISITS_KEY     = "cf_login_visits";
const LOGIN_HISTORY_KEY    = "cf_login_history";
const PAGE_VISITS_KEY      = "cf_page_visits";
const COLLEGES_VERSION     = "v2";
const COLLEGES_VERSION_KEY = "cf_admin_colleges_ver";

// ── One-time reset: clear old visit data so counts start fresh ───────────────
if (!localStorage.getItem("cf_analytics_reset_v1")) {
  localStorage.removeItem("cf_login_visits");
  localStorage.removeItem("cf_login_history");
  localStorage.removeItem("cf_page_visits");
  localStorage.removeItem("cf_visits");
  localStorage.setItem("cf_analytics_reset_v1", "1");
}

const AdminContext = createContext();

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ── Page visit tracker — call only for logged-in users, not admin ────────────
export function trackPageVisit() {
  const count = (parseInt(localStorage.getItem(PAGE_VISITS_KEY)) || 0) + 1;
  localStorage.setItem(PAGE_VISITS_KEY, String(count));
}

// ── Login-based visit tracker — only increments for user logins ──────────────
export function recordLogin() {
  const total = (parseInt(localStorage.getItem(LOGIN_VISITS_KEY)) || 0) + 1;
  localStorage.setItem(LOGIN_VISITS_KEY, String(total));

  const history = load(LOGIN_HISTORY_KEY, []);
  history.push({
    count: total,
    time:  new Date().toLocaleTimeString(),
    date:  new Date().toLocaleDateString(),
  });
  if (history.length > 30) history.splice(0, history.length - 30);
  save(LOGIN_HISTORY_KEY, history);
}

// ── College normalizer ────────────────────────────────────────────────────────
const normalizeCollege = (c, index) => {
  if (c.stream !== undefined || !c.streams?.length) {
    return { id: c.id ?? String(index), name: c.name ?? "", area: c.area ?? "", type: c.type ?? "Aided", stream: c.stream ?? "", cutoff: c.cutoff ?? "", fee: c.fee ?? "", subjects: c.subjects ?? "" };
  }
  const first = c.streams[0];
  return {
    id:       c.id ?? String(index),
    name:     c.name ?? "",
    area:     c.area ?? "",
    type:     c.type ?? "Aided",
    stream:   first?.stream ?? "",
    cutoff:   first?.cutoffs?.open ?? "",
    fee:      first?.fees?.open ?? "",
    subjects: (first?.subjects ?? []).join(", "),
    streams:  c.streams,
  };
};

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => load(ADMIN_KEY, null));

  const [colleges, setColleges] = useState(() => {
    const storedVersion = localStorage.getItem(COLLEGES_VERSION_KEY);
    if (storedVersion !== COLLEGES_VERSION) {
      localStorage.removeItem(COLLEGES_KEY);
      localStorage.setItem(COLLEGES_VERSION_KEY, COLLEGES_VERSION);
      return SEED_COLLEGES.map(normalizeCollege);
    }
    const stored = load(COLLEGES_KEY, null);
    if (!stored || stored.length === 0) return SEED_COLLEGES.map(normalizeCollege);
    const needsRenormalize = stored.some(
      (c) => c.stream === undefined && Array.isArray(c.streams) && c.streams.length > 0
    );
    return needsRenormalize ? SEED_COLLEGES.map(normalizeCollege) : stored;
  });

  const [checklist, setChecklist] = useState(() => load(CHECKLIST_KEY, {
    documents: [
      "SSC / 10th Marksheet (Original + 2 copies)",
      "School Leaving Certificate (Original)",
      "Aadhar Card (Original + 2 copies)",
      "Passport-size photographs (6 copies)",
      "Caste Certificate (if applicable)",
      "Income Certificate (if applicable)",
      "EWS / Non-Creamy Layer Certificate (if applicable)",
      "Migration Certificate (if from another board)",
    ],
    admissionSteps: [
      "Register on the official college portal or visit in person.",
      "Fill out the online / offline application form.",
      "Upload or submit required documents.",
      "Pay the application fee (if applicable).",
      "Attend the merit list announcement and verify your name.",
      "Report to the college on the allotted date for document verification.",
      "Complete the admission formalities and pay the fees.",
      "Collect your admission receipt and ID card.",
    ],
  }));

  useEffect(() => { save(COLLEGES_KEY, colleges); }, [colleges]);
  useEffect(() => { save(CHECKLIST_KEY, checklist); }, [checklist]);

  const adminLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const data = { email, role: "admin" };
      setAdmin(data);
      save(ADMIN_KEY, data);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_KEY);
  };

  const addCollege    = (college) => setColleges((prev) => [...prev, { ...college, id: Date.now().toString() }]);
  const updateCollege = (id, updates) => setColleges((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));
  const deleteCollege = (id) => setColleges((prev) => prev.filter((c) => c.id !== id));
  const updateChecklist = (updates) => setChecklist((prev) => ({ ...prev, ...updates }));

  return (
    <AdminContext.Provider value={{
      admin, adminLogin, adminLogout,
      colleges, addCollege, updateCollege, deleteCollege,
      checklist, updateChecklist,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
