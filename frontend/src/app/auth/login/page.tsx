"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogIn, Mail, Lock, Check } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { isDevMode, DEV_USER } from "@/lib/auth-dev";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState(DEV_USER.email);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
    router.push("/dashboard");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen transition-colors flex items-center justify-center ${
        darkMode
          ? "peachy-gradient-dark"
          : "peachy-gradient-light"
      }`}>
        {/* Header */}
        <div className="fixed top-6 left-6 right-6 flex items-center justify-between">
          <Link href="/" className={darkMode ? "text-amber-200" : "text-orange-700"}>
            🍑 Peachy Task
          </Link>
          <ThemeToggle />
        </div>

        {/* Card */}
        <div className="w-full max-w-md px-6">
          <div className={`rounded-2xl shadow-2xl border-2 p-8 ${
            darkMode
              ? "bg-stone-900/90 border-amber-900/50 backdrop-blur-sm"
              : "bg-white/90 border-orange-200/50 backdrop-blur-sm"
          }`}>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                    darkMode ? "bg-gradient-to-br from-amber-800 to-orange-900" : ""
                  }`}
                  style={darkMode ? {} : { backgroundColor: "#fce4d2" }}
                >
                  <span className="text-3xl">🍑</span>
                </div>
              </div>
              <h1 className={`text-2xl font-bold ${
                darkMode
                  ? "bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
              }`}>
                Sign in to Peachy Task
              </h1>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-amber-200" : "text-gray-700"
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? "text-amber-500/50" : "text-gray-400"
                  }`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-stone-800/50 border-amber-800/50 text-amber-100 placeholder-amber-500/40"
                        : "bg-white border-orange-200 text-gray-900 placeholder-gray-400 focus:border-orange-400"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-amber-200" : "text-gray-700"
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? "text-amber-500/50" : "text-gray-400"
                  }`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-stone-800/50 border-amber-800/50 text-amber-100 placeholder-amber-500/40"
                        : "bg-white border-orange-200 text-gray-900 placeholder-gray-400 focus:border-orange-400"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg transition font-semibold text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                  darkMode
                    ? "bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-amber-50"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                }`}
              >
                <LogIn className="w-5 h-5" />
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              {(isDevMode || process.env.NODE_ENV !== "production") && (
                <button
                  type="button"
                  onClick={() => {
                    try { localStorage.setItem("peachy-dev-bypass", "1"); } catch {}
                    router.push("/dashboard");
                  }}
                  className={`w-full py-3 rounded-lg transition font-medium border-2 ${
                    darkMode
                      ? "border-amber-700 text-amber-300 hover:bg-amber-900/30"
                      : "border-orange-300 text-orange-700 hover:bg-orange-50"
                  }`}
                >
                  <Check className="w-4 h-4 mr-2 inline" /> Skip Auth (Dev Only)
                </button>
              )}
            </form>

            <p className={`text-center text-sm mt-6 ${
              darkMode ? "text-amber-400/60" : "text-gray-600"
            }`}>
              Don&apos;t have an account? {" "}
              <Link href="/auth/signup" className={darkMode ? "text-amber-300" : "text-orange-700"}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


