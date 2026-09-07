import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "lime";

const variants: Record<Variant, string> = {
  primary:
    "bg-ski-blue text-white hover:bg-ski-blue-dark shadow-sm shadow-ski-blue/25",
  secondary:
    "bg-white text-ski-blue border border-ski-blue/20 hover:bg-ski-ice",
  ghost: "bg-transparent text-ski-slate hover:bg-ski-ice",
  danger: "bg-red-600 text-white hover:bg-red-700",
  lime: "bg-ski-lime text-ski-ink hover:brightness-95 font-semibold",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
