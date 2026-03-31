import { FileText, ListOrdered, CreditCard } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const DEFAULT_DOCUMENTS = [
  "SSC / 10th Marksheet (Original + 2 copies)",
  "School Leaving Certificate (Original)",
  "Aadhar Card (Original + 2 copies)",
  "Passport-size photographs (6 copies)",
  "Caste Certificate (if applicable)",
  "Income Certificate (if applicable)",
  "EWS / Non-Creamy Layer Certificate (if applicable)",
  "Migration Certificate (if from another board)",
];

const DEFAULT_STEPS = [
  "Register on the official college portal or visit in person.",
  "Fill out the online / offline application form.",
  "Upload or submit required documents.",
  "Pay the application fee (if applicable).",
  "Attend the merit list announcement and verify your name.",
  "Report to the college on the allotted date for document verification.",
  "Complete the admission formalities and pay the fees.",
  "Collect your admission receipt and ID card.",
];

const FEE_STEPS = [
  "Collect the fee challan from the college office or download from the portal.",
  "Visit the designated bank or use the online payment gateway.",
  "Pay the fees and collect the payment receipt.",
  "Submit a copy of the receipt to the college accounts department.",
  "Verify fee payment status on the college portal within 2 working days.",
];

function Section({ icon: Icon, title, color, children }) {
  return (
    <div className={`rounded-xl border p-5 ${color} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-700/60">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function ApplicationChecklist() {
  const { checklist } = useAdmin();
  const DOCUMENTS      = checklist?.documents      ?? DEFAULT_DOCUMENTS;
  const ADMISSION_STEPS = checklist?.admissionSteps ?? DEFAULT_STEPS;
  return (
    <div className="mt-6">
      <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        📋 Application Checklist
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Documents */}
        <Section icon={FileText} title="Documents Required" color="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
          <ul className="space-y-2">
            {DOCUMENTS.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                {doc}
              </li>
            ))}
          </ul>
        </Section>

        {/* Admission Steps */}
        <Section icon={ListOrdered} title="Admission Steps" color="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200">
          <ol className="space-y-2">
            {ADMISSION_STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-indigo-700 dark:text-indigo-300">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-indigo-200 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </Section>

        {/* Fee Payment Steps */}
        <Section icon={CreditCard} title="Fee Payment Steps" color="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200">
          <ol className="space-y-2">
            {FEE_STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-emerald-200 dark:bg-emerald-700 text-emerald-700 dark:text-emerald-200 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </div>
  );
}
