// No TypeScript interfaces in JSX

export const streams = ["Science", "Commerce", "Arts"];

export const allSubjects = [
  "Computer Science / IT",
  "Electronics",
  "Mechanical",
  "Mathematics",
  "Biology",
  "Hindi",
  "Marathi",
  "French",
];

export const colleges = [
  {
    id: "1",
    name: "R.J. College of Arts, Science & Commerce",
    type: "Aided",
    area: "Ghatkopar",
    streams: [
      {
        stream: "Science",
        subjects: ["Computer Science / IT", "Mathematics", "Biology"],
        cutoffs: { open: 85, obc: 80, sc: 70, st: 65, vjnt: 72, ews: 82 },
        fees: { open: 9500, reserved: 5000 },
      },
      {
        stream: "Commerce",
        subjects: ["Computer Science / IT", "Mathematics", "Hindi"],
        cutoffs: { open: 78, obc: 73, sc: 63, st: 58, vjnt: 65, ews: 75 },
        fees: { open: 8500, reserved: 4500 },
      },
      {
        stream: "Arts",
        subjects: ["Hindi", "Marathi", "French"],
        cutoffs: { open: 65, obc: 60, sc: 50, st: 45, vjnt: 52, ews: 62 },
        fees: { open: 7500, reserved: 4000 },
      },
    ],
  },
  {
    id: "2",
    name: "Vidyavihar Junior College",
    type: "Aided",
    area: "Vidyavihar",
    streams: [
      {
        stream: "Science",
        subjects: ["Mathematics", "Biology", "Electronics"],
        cutoffs: { open: 78, obc: 73, sc: 63, st: 58, vjnt: 65, ews: 75 },
        fees: { open: 7000, reserved: 3800 },
      },
      {
        stream: "Commerce",
        subjects: ["Computer Science / IT", "Hindi", "Marathi"],
        cutoffs: { open: 72, obc: 67, sc: 57, st: 52, vjnt: 59, ews: 69 },
        fees: { open: 6500, reserved: 3500 },
      },
      {
        stream: "Bifocal",
        subjects: ["Computer Science / IT", "Electronics"],
        cutoffs: { open: 75, obc: 70, sc: 60, st: 55, vjnt: 62, ews: 72 },
        fees: { open: 8500, reserved: 4500 },
      },
    ],
  },
  {
    id: "3",
    name: "Kurla Junior College of Science",
    type: "Unaided",
    area: "Kurla",
    streams: [
      {
        stream: "Science",
        subjects: ["Computer Science / IT", "Electronics", "Mathematics", "Biology"],
        cutoffs: { open: 72, obc: 67, sc: 57, st: 52, vjnt: 60, ews: 69 },
        fees: { open: 15000, reserved: 12000 },
      },
      {
        stream: "Bifocal",
        subjects: ["Mechanical", "Electronics", "Computer Science / IT"],
        cutoffs: { open: 68, obc: 63, sc: 53, st: 48, vjnt: 55, ews: 65 },
        fees: { open: 16000, reserved: 13000 },
      },
    ],
  },
  {
    id: "4",
    name: "Ghatkopar Education Society Junior College",
    type: "Self-Financed",
    area: "Ghatkopar",
    streams: [
      {
        stream: "Commerce",
        subjects: ["Computer Science / IT", "French", "Hindi"],
        cutoffs: { open: 65, obc: 60, sc: 50, st: 45, vjnt: 52, ews: 62 },
        fees: { open: 22000, reserved: 18000 },
      },
      {
        stream: "Arts",
        subjects: ["French", "Hindi", "Marathi"],
        cutoffs: { open: 55, obc: 50, sc: 40, st: 35, vjnt: 42, ews: 52 },
        fees: { open: 20000, reserved: 16000 },
      },
    ],
  },
  {
    id: "5",
    name: "S.K. Somaiya Vidyavihar",
    type: "Aided",
    area: "Vidyavihar",
    streams: [
      {
        stream: "Science",
        subjects: ["Computer Science / IT", "Mathematics", "Biology", "Electronics"],
        cutoffs: { open: 90, obc: 85, sc: 75, st: 70, vjnt: 78, ews: 87 },
        fees: { open: 10500, reserved: 5500 },
      },
      {
        stream: "Commerce",
        subjects: ["Computer Science / IT", "Mathematics", "Hindi"],
        cutoffs: { open: 85, obc: 80, sc: 70, st: 65, vjnt: 72, ews: 82 },
        fees: { open: 9500, reserved: 5000 },
      },
      {
        stream: "Arts",
        subjects: ["Hindi", "Marathi", "French"],
        cutoffs: { open: 75, obc: 70, sc: 60, st: 55, vjnt: 62, ews: 72 },
        fees: { open: 8500, reserved: 4500 },
      },
    ],
  },
  {
    id: "6",
    name: "Model Junior College Kurla",
    type: "Unaided",
    area: "Kurla",
    streams: [
      {
        stream: "Science",
        subjects: ["Mathematics", "Biology", "Computer Science / IT"],
        cutoffs: { open: 68, obc: 63, sc: 53, st: 48, vjnt: 55, ews: 65 },
        fees: { open: 18000, reserved: 15000 },
      },
      {
        stream: "Bifocal",
        subjects: ["Computer Science / IT", "Electronics"],
        cutoffs: { open: 65, obc: 60, sc: 50, st: 45, vjnt: 52, ews: 62 },
        fees: { open: 19000, reserved: 16000 },
      },
    ],
  },
  {
    id: "7",
    name: "Pragati Junior College",
    type: "Self-Financed",
    area: "Ghatkopar",
    streams: [
      {
        stream: "Commerce",
        subjects: ["Computer Science / IT", "Hindi", "Marathi"],
        cutoffs: { open: 55, obc: 50, sc: 40, st: 35, vjnt: 42, ews: 52 },
        fees: { open: 25000, reserved: 22000 },
      },
      {
        stream: "Arts",
        subjects: ["Hindi", "Marathi"],
        cutoffs: { open: 45, obc: 40, sc: 30, st: 25, vjnt: 32, ews: 42 },
        fees: { open: 23000, reserved: 20000 },
      },
    ],
  },
  {
    id: "8",
    name: "Vidyavihar Science & Commerce College",
    type: "Aided",
    area: "Vidyavihar",
    streams: [
      {
        stream: "Science",
        subjects: ["Computer Science / IT", "Electronics", "Mathematics", "Biology"],
        cutoffs: { open: 82, obc: 77, sc: 67, st: 62, vjnt: 69, ews: 79 },
        fees: { open: 8000, reserved: 4200 },
      },
      {
        stream: "Commerce",
        subjects: ["Computer Science / IT", "Mathematics", "Hindi", "Marathi"],
        cutoffs: { open: 75, obc: 70, sc: 60, st: 55, vjnt: 62, ews: 72 },
        fees: { open: 7500, reserved: 4000 },
      },
    ],
  },
  {
    id: "9",
    name: "Kurla Central Junior College",
    type: "Unaided",
    area: "Kurla",
    streams: [
      {
        stream: "Science",
        subjects: ["Mathematics", "Biology", "Computer Science / IT"],
        cutoffs: { open: 70, obc: 65, sc: 55, st: 50, vjnt: 57, ews: 67 },
        fees: { open: 16500, reserved: 13500 },
      },
      {
        stream: "Commerce",
        subjects: ["Computer Science / IT", "Hindi"],
        cutoffs: { open: 62, obc: 57, sc: 47, st: 42, vjnt: 49, ews: 59 },
        fees: { open: 15500, reserved: 12500 },
      },
      {
        stream: "Arts",
        subjects: ["French", "Hindi", "Marathi"],
        cutoffs: { open: 55, obc: 50, sc: 40, st: 35, vjnt: 42, ews: 52 },
        fees: { open: 14500, reserved: 11500 },
      },
      {
        stream: "Bifocal",
        subjects: ["Mechanical", "Electronics"],
        cutoffs: { open: 65, obc: 60, sc: 50, st: 45, vjnt: 52, ews: 62 },
        fees: { open: 17500, reserved: 14500 },
      },
    ],
  },
  {
    id: "10",
    name: "New Era Junior College",
    type: "Self-Financed",
    area: "Ghatkopar",
    streams: [
      {
        stream: "Commerce",
        subjects: ["Computer Science / IT", "French", "Hindi", "Marathi"],
        cutoffs: { open: 60, obc: 55, sc: 45, st: 40, vjnt: 47, ews: 57 },
        fees: { open: 28000, reserved: 25000 },
      },
      {
        stream: "Arts",
        subjects: ["French", "Hindi", "Marathi"],
        cutoffs: { open: 50, obc: 45, sc: 35, st: 30, vjnt: 37, ews: 47 },
        fees: { open: 26000, reserved: 23000 },
      },
    ],
  },
];

export const percentageRanges = [
  "40% – 45%",
  "45% – 50%",
  "50% – 55%",
  "55% – 60%",
  "60% – 65%",
  "65% – 70%",
  "70% – 75%",
  "75% – 80%",
  "80% – 85%",
  "85% – 90%",
  "90% – 95%",
  "95% – 100%",
];

export const categories = [
  { value: "open", label: "Open" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "vjnt", label: "VJ / NT" },
  { value: "ews", label: "EWS" },
];

export const feeRanges = [
  { value: "below-5000", label: "Below ₹5,000", max: 5000 },
  { value: "5000-10000", label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { value: "10000-20000", label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { value: "above-20000", label: "Above ₹20,000", min: 20000 },
];
