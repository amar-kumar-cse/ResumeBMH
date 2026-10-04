"use client";

import React from "react";
import { cn } from "./primitives";

export { cn };

// ---------------------------------------------------------------------------
// 1. GlassCard
// ---------------------------------------------------------------------------
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "gold" | "subtle";
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default: "glass-surface",
      interactive: "glass-surface-interactive cursor-pointer",
      gold: "glass-surface-gold",
      subtle: "bg-white/40 border border-white/60 backdrop-blur-md shadow-sm",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6 relative overflow-hidden transition-all duration-300",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

// ---------------------------------------------------------------------------
// 2. GlassPanel
// ---------------------------------------------------------------------------
export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  actions?: React.ReactNode;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, header, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("glass-surface rounded-2xl p-6 sm:p-7 space-y-4", className)}
        {...props}
      >
        {(header || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
            {header && <h2 className="text-base font-bold text-slate-900 font-heading">{header}</h2>}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";

// ---------------------------------------------------------------------------
// 3. GlassButton
// ---------------------------------------------------------------------------
export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  isLoading?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", loading, isLoading, disabled, children, ...props }, ref) => {
    const isSpinning = loading || isLoading;
    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
      md: "px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl gap-2",
      lg: "px-6 py-3.5 text-sm sm:text-base font-bold rounded-xl gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white shadow-md shadow-blue-500/25 border border-blue-400/30",
      secondary:
        "bg-white/85 hover:bg-white active:scale-98 text-slate-800 border border-slate-200/90 shadow-sm backdrop-blur-md",
      gold:
        "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 active:scale-95 text-slate-950 font-bold shadow-md shadow-amber-500/25 border border-amber-300",
      outline:
        "bg-white/70 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm backdrop-blur-md",
      ghost:
        "bg-transparent hover:bg-white/60 text-slate-600 hover:text-slate-900 border border-transparent",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 shadow-sm active:scale-95",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isSpinning}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isSpinning && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    );
  }
);
GlassButton.displayName = "GlassButton";

// ---------------------------------------------------------------------------
// 4. GlassInput & GlassTextarea
// ---------------------------------------------------------------------------
export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full bg-white/90 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 backdrop-blur-md transition-all duration-200 shadow-sm",
          className
        )}
        {...props}
      />
    );
  }
);
GlassInput.displayName = "GlassInput";

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-white/90 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 backdrop-blur-md transition-all duration-200 leading-relaxed shadow-sm",
          className
        )}
        {...props}
      />
    );
  }
);
GlassTextarea.displayName = "GlassTextarea";

// ---------------------------------------------------------------------------
// 5. GlassBadge
// ---------------------------------------------------------------------------
export interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "violet" | "emerald" | "amber" | "gold" | "rose";
}

export const GlassBadge = React.forwardRef<HTMLSpanElement, GlassBadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-slate-100/90 text-slate-700 border-slate-200/80",
      violet: "bg-indigo-50/90 text-indigo-700 border-indigo-200/80",
      emerald: "bg-emerald-50/90 text-emerald-800 border-emerald-200/80",
      amber: "bg-amber-50/90 text-amber-900 border-amber-200/80",
      gold: "bg-gradient-to-r from-amber-100/90 to-amber-50/90 text-amber-900 border-amber-300/80",
      rose: "bg-rose-50/90 text-rose-800 border-rose-200/80",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md tracking-wide select-none",
          variantStyles[variant] || variantStyles.default,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
GlassBadge.displayName = "GlassBadge";

// ---------------------------------------------------------------------------
// 6. GlassModal
// ---------------------------------------------------------------------------
export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function GlassModal({ isOpen, onClose, title, icon, children }: GlassModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg p-6 rounded-2xl border border-white/80 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
