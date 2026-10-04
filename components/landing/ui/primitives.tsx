import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

export function Container({
  children,
  className = "",
  size = "default",
  ...props
}: ContainerProps) {
  const sizeMap = {
    narrow: "max-w-3xl",
    default: "max-w-[1200px]",
    wide: "max-w-7xl",
  };

  return (
    <div
      className={`w-full ${sizeMap[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "subtle" | "white";
}

export function Section({
  children,
  className = "",
  id,
  background = "default",
  ...props
}: SectionProps) {
  const bgStyles = {
    default: "bg-transparent",
    subtle: "bg-slate-50/70 border-y border-slate-200/70",
    white: "bg-white",
  };

  return (
    <section
      id={id}
      className={`py-16 sm:py-24 ${bgStyles[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1e3a8a] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs font-semibold gap-1.5",
    md: "h-11 px-5 text-sm font-semibold gap-2",
    lg: "h-12 px-6 text-base font-bold gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#1e3a8a] text-white hover:bg-[#172554] shadow-sm active:scale-[0.98]",
    secondary:
      "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-[0.98]",
    ghost:
      "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  hoverEffect = false,
  hoverable = false,
  ...props
}: CardProps) {
  const isHoverable = hoverEffect || hoverable;

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${
        isHoverable
          ? "transition-all duration-200 hover:border-slate-300 hover:shadow-md"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "neutral" | "accent" | "success" | "warning";
}

export function Badge({
  children,
  className = "",
  variant = "accent",
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    accent: "bg-blue-50 text-[#1e3a8a] border-blue-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-900 border-amber-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  tag?: string;
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  tag,
  badge,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const displayBadge = badge || tag;

  return (
    <div
      className={`space-y-3 mb-12 sm:mb-16 ${
        isCenter ? "text-center max-w-2xl mx-auto" : "max-w-2xl"
      } ${className}`}
    >
      {displayBadge && <Badge variant="accent">{displayBadge}</Badge>}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-base text-slate-600 leading-relaxed font-sans">
          {description}
        </p>
      )}
    </div>
  );
}
