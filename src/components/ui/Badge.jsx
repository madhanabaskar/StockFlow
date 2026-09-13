import React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-primary-light text-primary",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
};

const statusToVariantMap = {
  "In Stock": "success",
  "Low Stock": "warning",
  "Out of Stock": "danger",
  "Active": "success",
  "Inactive": "default",
  "Stock In": "primary",
  "Stock Out": "default",
};

export function Badge({ className, variant, status, children, ...props }) {
  const finalVariant = variant || (status ? statusToVariantMap[status] : "default") || "default";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[finalVariant],
        className
      )}
      {...props}
    >
      {children || status}
    </div>
  );
}
