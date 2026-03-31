import { Beaker, Briefcase, Palette, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

const StreamCard = ({ streamData, selectedCategory }) => {
  const getCategoryKey = (cat) => {
    switch (cat) {
      case "obc":
        return "obc";
      case "sc":
        return "sc";
      case "st":
        return "st";
      case "vjnt":
        return "vjnt";
      case "ews":
        return "ews";
      default:
        return "open";
    }
  };

  const categoryKey = getCategoryKey(selectedCategory);
  const cutoff = streamData.cutoffs[categoryKey];

  const fee =
    selectedCategory === "open" || selectedCategory === "all"
      ? streamData.fees.open
      : streamData.fees.reserved;

  const getStreamIcon = (stream) => {
    switch (stream) {
      case "Science":
        return <Beaker className="h-4 w-4" />;
      case "Commerce":
        return <Briefcase className="h-4 w-4" />;
      case "Arts":
        return <Palette className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStreamColor = (stream) => {
    switch (stream) {
      case "Science":
        return "bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200";
      case "Commerce":
        return "bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700 border-teal-200";
      case "Arts":
        return "bg-gradient-to-br from-orange-50 to-amber-50 text-orange-700 border-orange-200";
      default:
        return "bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div
      className={`rounded-xl border-2 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${getStreamColor(
        streamData.stream
      )}`}
    >
      {/* Stream Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-white shadow-sm">
          {getStreamIcon(streamData.stream)}
        </div>
        <h4 className="font-bold text-base">{streamData.stream}</h4>
      </div>

      {/* Subjects */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-600 mb-2">
          Subjects Available
        </p>
        <div className="flex flex-wrap gap-2">
          {streamData.subjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center px-3 py-1 rounded-lg bg-white text-xs font-medium shadow-sm"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      {/* Eligibility Info */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-slate-600 mb-1 font-medium">
            Cut-off (
            {selectedCategory === "all"
              ? "Open"
              : selectedCategory.toUpperCase()}
            )
          </p>
          <p className="text-xl font-bold text-emerald-600">
            {cutoff}%
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-1 text-xs text-slate-600 mb-1 font-medium">
            <IndianRupee className="h-3 w-3" />
            <span>Approx. Fees</span>
          </div>
          <p className="text-xl font-bold text-slate-900">
            ₹{fee.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category-wise Cutoffs */}
      {selectedCategory === "all" && (
        <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Category-wise Cut-offs
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-slate-600">OBC:</span>{" "}
              <span className="font-bold text-slate-900">
                {streamData.cutoffs.obc}%
              </span>
            </div>
            <div>
              <span className="text-slate-600">SC:</span>{" "}
              <span className="font-bold text-slate-900">
                {streamData.cutoffs.sc}%
              </span>
            </div>
            <div>
              <span className="text-slate-600">ST:</span>{" "}
              <span className="font-bold text-slate-900">
                {streamData.cutoffs.st}%
              </span>
            </div>
            <div>
              <span className="text-slate-600">VJ/NT:</span>{" "}
              <span className="font-bold text-slate-900">
                {streamData.cutoffs.vjnt}%
              </span>
            </div>
            <div>
              <span className="text-slate-600">EWS:</span>{" "}
              <span className="font-bold text-slate-900">
                {streamData.cutoffs.ews}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <Button
        variant="outline"
        size="sm"
        className="w-full bg-white hover:bg-emerald-50 font-semibold border-2 hover:border-emerald-300 transition-all duration-300 hover:shadow-md text-emerald-700"
      >
        Check Eligibility
      </Button>
    </div>
  );
};

export default StreamCard;
