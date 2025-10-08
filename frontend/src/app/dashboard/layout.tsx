"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { isDevMode } from "@/lib/auth-dev";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [devBypass, setDevBypass] = useState<boolean>(false);
  const [hasCheckedBypass, setHasCheckedBypass] = useState<boolean>(false);

  // Hard bypass in development: do NOT redirect at all
  // This ensures direct hits to /dashboard don't bounce back during UI verification
  if (isDevMode) {
    return <>{children}</>;
  }

  useEffect(() => {
    // Check dev bypass persistently (localStorage)
    try {
      const flag = typeof window !== "undefined" && localStorage.getItem("peachy-dev-bypass") === "1";
      setDevBypass(!!flag);
    } catch {}
    setHasCheckedBypass(true);
  }, []);

  useEffect(() => {
    if (!hasCheckedBypass) return; // avoid redirect until we know bypass state
    if (isAuthenticated) return;
    if (devBypass) return; // persistent dev bypass
    router.replace("/auth/login");
  }, [isAuthenticated, devBypass, hasCheckedBypass, router]);

  return <>{children}</>;
}


