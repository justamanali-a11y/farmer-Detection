import React from "react";

export function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  const variants = {
    default:
      "bg-green-600 text-white hover:bg-green-700",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  const sizes = {
    default: "px-4 py-2",
    lg: "px-6 py-3 text-base",
    icon: "h-10 w-10 p-2",
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg font-medium transition ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}