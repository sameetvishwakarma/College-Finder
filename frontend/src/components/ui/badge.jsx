import * as React from "react";

// Simple utility function to combine class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Badge variants as a simple object
const badgeVariants = {
  default: "border-transparent bg-slate-900 text-white hover:bg-slate-800",
  secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
  destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
  outline: "text-slate-900 border-slate-200 hover:bg-slate-50",
  success: "border-transparent bg-green-100 text-green-800",
  info: "border-transparent bg-blue-100 text-blue-800",
  warning: "border-transparent bg-yellow-100 text-yellow-800",
  reviewing: "border-transparent bg-orange-100 text-orange-800",
};

function Badge({ className, variant = "default", ...props }) {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = badgeVariants[variant] || badgeVariants.default;

  return (
    <div
      className={cn(baseClasses, variantClasses, className)}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };