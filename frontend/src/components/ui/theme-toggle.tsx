"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "header";
}

export function ThemeToggle({ className, variant = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const baseStyles = "p-2 rounded-lg transition-colors";
  const variantStyles = {
    default: theme === "dark" 
      ? "bg-amber-900/50 text-amber-200 hover:bg-amber-900" 
      : "bg-orange-100 text-orange-600 hover:bg-orange-200",
    header: theme === "dark"
      ? "bg-amber-800/50 text-amber-200 hover:bg-amber-800"
      : "bg-orange-400/30 text-white hover:bg-orange-600/40"
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(baseStyles, variantStyles[variant], className)}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
