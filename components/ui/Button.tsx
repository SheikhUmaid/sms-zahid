import React, { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";

  const variantStyles = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:ring-indigo-500 active:bg-indigo-800",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400 active:bg-slate-300",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500 active:bg-red-800",
    outline:
      "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus:ring-indigo-500",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

