
import React from "react";

export function Badge({ children, className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}