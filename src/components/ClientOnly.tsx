"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Defers children until after mount.
 * Uses an empty shell with suppressHydrationWarning so browser extensions
 * (Bitdefender `bis_skin_checked`, Grammarly, etc.) that inject attributes
 * into SSR HTML don't trigger noisy hydration mismatches.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-black">
        {fallback}
      </div>
    );
  }

  return <>{children}</>;
}
