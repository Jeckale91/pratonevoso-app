import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-ski-blue/15 bg-white px-3.5 py-2.5 text-sm text-ski-ink outline-none ring-ski-blue/30 placeholder:text-ski-slate/60 focus:border-ski-blue focus:ring-2 ${className}`}
      {...props}
    />
  );
}

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-xl border border-ski-blue/15 bg-white px-3.5 py-2.5 text-sm text-ski-ink outline-none ring-ski-blue/30 placeholder:text-ski-slate/60 focus:border-ski-blue focus:ring-2 ${className}`}
      {...props}
    />
  );
}

export function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-ski-slate"
    >
      {children}
    </label>
  );
}
