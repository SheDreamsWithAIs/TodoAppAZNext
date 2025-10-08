"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Mail, Lock, User } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const { signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsSubmitting(true);
    await signup(email, password, name);
    setIsSubmitting(false);
    router.push("/dashboard");
  };

  // Dev helper: allow skip from signup via direct url param in dev mode
  // Example: /auth/signup?dev=1
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("dev") && process.env.NEXT_PUBLIC_DEV_MODE === "true") {
      try { localStorage.setItem("peachy-dev-bypass", "1"); } catch {}
    }
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen transition-colors ${
        darkMode ? "peachy-gradient-dark" : "peachy-gradient-light"
      }`}>
        <div className="fixed top-6 left-6 right-6 flex items-center justify-between">
          <Link href="/" className={darkMode ? "text-amber-200" : "text-orange-700"}>
            🍑 Peachy Task
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-2xl mx-auto px-6 py-20">
          <div className={`rounded-2xl shadow-2xl border-2 p-10 ${
            darkMode
              ? "bg-stone-900/90 border-amber-900/50 backdrop-blur-sm"
              : "bg-white/90 border-orange-200/50 backdrop-blur-sm"
          }`}>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ${
                    darkMode ? "bg-gradient-to-br from-amber-800 to-orange-900" : ""
                  }`}
                  style={darkMode ? {} : { backgroundColor: "#fce4d2" }}
                >
                  <span className="text-5xl">🍑</span>
                </div>
              </div>
              <h1 className={`text-3xl font-bold ${
                darkMode
                  ? "bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
              }`}>
                Join Peachy Task
              </h1>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-amber-200" : "text-gray-700"
                }`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? "text-amber-500/50" : "text-gray-400"
                  }`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Peachy"
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

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-amber-200" : "text-gray-700"
                }`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? "text-amber-500/50" : "text-gray-400"
                  }`} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                className={`w-full py-4 rounded-lg transition font-semibold text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                  darkMode
                    ? "bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-amber-50"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                }`}
              >
                <Check className="w-5 h-5" />
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>

              <p className={`text-center text-sm ${
                darkMode ? "text-amber-400/60" : "text-gray-600"
              }`}>
                Already have an account? {" "}
                <Link href="/auth/login" className={darkMode ? "text-amber-300" : "text-orange-700"}>
                  Sign in instead
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


