import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { percentageRanges, feeRanges, streams } from "../data/colleges";

const CollegeFilters = ({
  searchQuery,
  setSearchQuery,
  percentageRange,
  setPercentageRange,
  feeRange,
  setFeeRange,
  selectedStreams,
  setSelectedStreams,
  // Optional: pass college names for autocomplete
  collegeNames = [],
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Build suggestions as user types
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2 && collegeNames.length > 0) {
      const filtered = collegeNames
        .filter((name) => name.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name) => {
    setSearchQuery(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleStreamChange = (stream, checked) => {
    if (checked) {
      setSelectedStreams([...selectedStreams, stream]);
    } else {
      setSelectedStreams(selectedStreams.filter((s) => s !== stream));
    }
  };

  return (
    <div className="filter-card mb-8 hover:shadow-xl transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
      <h2 className="text-lg font-bold text-foreground dark:text-slate-100 mb-4">Find Your College</h2>

      {/* Search Input with Autocomplete */}
      <div className="relative mb-6" ref={inputRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder="Search by college name..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="pl-10 pr-8 transition-all duration-300 focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(""); setSuggestions([]); setShowSuggestions(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Autocomplete dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {suggestions.map((name) => (
              <button
                key={name}
                onMouseDown={() => handleSuggestionClick(name)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 flex items-center gap-2"
              >
                <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {/* Highlight matching part */}
                {name.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
                  part.toLowerCase() === searchQuery.toLowerCase()
                    ? <strong key={i} className="text-indigo-600 dark:text-indigo-400">{part}</strong>
                    : part
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Percentage Range */}
        <div>
          <label className="text-sm font-bold text-foreground dark:text-slate-200 mb-1.5 block">
            Percentage Range
          </label>
          <Select value={percentageRange} onValueChange={setPercentageRange}>
            <SelectTrigger className="transition-all duration-300 hover:border-blue-400 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 shadow-lg z-[100]">
              <SelectItem value="all">All Percentages</SelectItem>
              {percentageRanges.map((range) => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fee Range */}
        <div>
          <label className="text-sm font-bold text-foreground dark:text-slate-200 mb-1.5 block">
            Fee Range
          </label>
          <Select value={feeRange} onValueChange={setFeeRange}>
            <SelectTrigger className="transition-all duration-300 hover:border-blue-400 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
              <SelectValue placeholder="Select fees" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 shadow-lg z-[100]">
              <SelectItem value="all">All Fee Ranges</SelectItem>
              {feeRanges.map((fee) => (
                <SelectItem key={fee.value} value={fee.value}>{fee.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stream Checkboxes */}
      <div>
        <label className="text-sm font-bold text-foreground dark:text-slate-200 mb-3 block">
          Stream Filter
        </label>
        <div className="flex flex-wrap gap-6">
          {streams.map((stream) => (
            <div key={stream} className="flex items-center space-x-2">
              <Checkbox
                id={`stream-${stream}`}
                checked={selectedStreams.includes(stream)}
                onCheckedChange={(checked) => handleStreamChange(stream, checked)}
              />
              <Label
                htmlFor={`stream-${stream}`}
                className="text-sm font-normal cursor-pointer dark:text-slate-300"
              >
                {stream}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollegeFilters;
