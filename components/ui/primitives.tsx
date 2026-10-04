"use client";

import React from "react";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// 1. Container
// ---------------------------------------------------------------------------
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "narrow" | "default" | "wide";
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
      className={cn("w-full mx-auto px-4 sm:px-6 lg:px-8", sizeMap[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Section
// ---------------------------------------------------------------------------
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
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
    subtle: "bg-white/40 backdrop-blur-md border-y border-white/60",
    white: "bg-white/75 backdrop-blur-xl border-y border-white/70",
  };

  return (
    <section
      id={id}
      className={cn("py-12 sm:py-16", bgStyles[background], className)}
      {...props}
    >
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2.1 SectionHeading
// ---------------------------------------------------------------------------
export interface SectionHeadingProps {
  badge?: string;
  tag?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  badge,
  tag,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const badgeText = tag || badge;

  return (
    <div
      className={cn(
        "space-y-3 mb-10 sm:mb-14",
        align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl",
        className
      )}
    >
      {badgeText && (
        <Badge variant="accent" size="sm">
          {badgeText}
        </Badge>
      )}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-ink font-heading tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans">
          {description}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Card & Panel
// ---------------------------------------------------------------------------
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", hoverable = false, padding = "md", ...props }, ref) => {
    const padStyles = {
      none: "p-0",
      sm: "p-4 sm:p-5",
      md: "p-6 sm:p-7",
      lg: "p-8 sm:p-10",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white/85 backdrop-blur-xl rounded-2xl border border-white/85 shadow-[0_10px_30px_-5px_rgba(30,58,138,0.06),0_4px_12px_-2px_rgba(0,0,0,0.02)] text-ink transition-all duration-300",
          hoverable && "hover:bg-white/95 hover:border-blue-300/60 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.12),0_6px_16px_-2px_rgba(0,0,0,0.04)] hover:-translate-y-1",
          padStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  header?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ header, title, subtitle, actions, children, className = "", ...props }, ref) => {
    const displayHeader = header || (title && (
      <div>
        <div className="text-base sm:text-lg font-bold text-ink font-heading">{title}</div>
        {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
    ));

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white/90 backdrop-blur-xl rounded-2xl border border-white/85 shadow-[0_10px_30px_-5px_rgba(30,58,138,0.06)] p-6 sm:p-7 space-y-4",
          className
        )}
        {...props}
      >
        {(displayHeader || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            {displayHeader && <div>{displayHeader}</div>}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }
);
Panel.displayName = "Panel";

// ---------------------------------------------------------------------------
// 4. Button
// ---------------------------------------------------------------------------
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 active:scale-[0.99]",
      secondary:
        "bg-white/85 hover:bg-white text-ink border border-slate-200/80 shadow-sm active:scale-[0.99] backdrop-blur-sm",
      outline:
        "bg-white/70 text-ink border border-slate-200/90 hover:bg-white hover:border-slate-300 shadow-sm active:scale-[0.99] backdrop-blur-sm",
      ghost:
        "text-ink-muted hover:text-ink hover:bg-white/60",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 shadow-sm active:scale-[0.99] focus-visible:ring-rose-500",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// ---------------------------------------------------------------------------
// 5. Badge
// ---------------------------------------------------------------------------
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "neutral"
    | "accent"
    | "success"
    | "warning"
    | "danger"
    | "brand"
    | "emerald"
    | "amber"
    | "rose"
    | "violet"
    | "default"
    | "gold";
  size?: "sm" | "md";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className = "", variant = "accent", size = "sm", ...props }, ref) => {
    const variantStyles = {
      neutral: "bg-slate-100 text-slate-700 border-slate-200",
      default: "bg-slate-100 text-slate-700 border-slate-200",
      accent: "bg-blue-50 text-[#1e3a8a] border-blue-200",
      brand: "bg-blue-50 text-[#1e3a8a] border-blue-200",
      violet: "bg-indigo-50 text-indigo-700 border-indigo-200",
      success: "bg-emerald-50 text-emerald-800 border-emerald-200",
      emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
      warning: "bg-amber-50 text-amber-900 border-amber-200",
      amber: "bg-amber-50 text-amber-900 border-amber-200",
      gold: "bg-amber-50 text-amber-900 border-amber-200",
      danger: "bg-rose-50 text-rose-800 border-rose-200",
      rose: "bg-rose-50 text-rose-800 border-rose-200",
    };

    const sizeStyles = {
      sm: "px-2.5 py-0.5 text-xs",
      md: "px-3 py-1 text-xs",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md font-semibold border select-none",
          variantStyles[variant] || variantStyles.accent,
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

// ---------------------------------------------------------------------------
// 6. Form Controls: Input, Textarea, Select
// ---------------------------------------------------------------------------
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = "", required, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-ink tracking-tight"
          >
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={cn(errorId, helperId) || undefined}
          className={cn(
            "w-full h-11 px-3.5 rounded-lg border bg-white text-ink text-sm transition-all",
            "placeholder:text-ink-subtle",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
            "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
            error
              ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500"
              : "border-slate-200 hover:border-slate-300",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs font-medium text-rose-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-ink-subtle">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, className = "", required, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    const errorId = error && textareaId ? `${textareaId}-error` : undefined;
    const helperId = helperText && textareaId ? `${textareaId}-helper` : undefined;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-ink tracking-tight"
          >
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={cn(errorId, helperId) || undefined}
          className={cn(
            "w-full p-3.5 rounded-lg border bg-white text-ink text-sm transition-all resize-y",
            "placeholder:text-ink-subtle",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
            "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
            error
              ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500"
              : "border-slate-200 hover:border-slate-300",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs font-medium text-rose-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-ink-subtle">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, id, className = "", required, children, ...props }, ref) => {
    const inputId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-ink tracking-tight"
          >
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={cn(errorId, helperId) || undefined}
          className={cn(
            "w-full h-11 px-3.5 rounded-lg border bg-white text-ink text-sm transition-all",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
            "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
            error
              ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500"
              : "border-slate-200 hover:border-slate-300",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p id={errorId} className="text-xs font-medium text-rose-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-ink-subtle">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

// ---------------------------------------------------------------------------
// 7. PageHeader & EmptyState & Skeleton
// ---------------------------------------------------------------------------
export interface PageHeaderProps {
  badge?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  badge,
  title,
  description,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80",
        className
      )}
    >
      <div className="space-y-1.5 max-w-2xl">
        {badge && (typeof badge === "string" ? <Badge variant="accent">{badge}</Badge> : badge)}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-heading tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          {actions}
        </div>
      )}
    </div>
  );
}

export interface EmptyStateProps {
  icon?: React.ReactNode | React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "p-10 sm:p-14 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center max-w-lg mx-auto",
        className
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-ink-subtle flex items-center justify-center mb-4">
          {React.isValidElement(Icon) ? (
            Icon
          ) : typeof Icon === "function" ? (
            React.createElement(Icon as React.ComponentType<{ className?: string }>, {
              className: "w-6 h-6",
            })
          ) : null}
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-muted mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-slate-200/70", className)}
      aria-hidden="true"
    />
  );
}
