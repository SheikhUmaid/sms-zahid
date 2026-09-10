import React, { SelectHTMLAttributes, forwardRef } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder = "Select an option",
      error,
      helperText,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`block w-full rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 px-3.5 py-2.5 bg-white ${
            error
              ? "border-red-400 text-red-900 focus:border-red-500 focus:ring-red-200"
              : "border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-indigo-200"
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

