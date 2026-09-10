import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative rounded-md shadow-xs">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`block w-full rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
              icon ? "pl-10" : "pl-3.5"
            } pr-3.5 py-2.5 ${
              error
                ? "border-red-400 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-200"
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

