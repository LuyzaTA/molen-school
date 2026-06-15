"use client";

import { useEffect, useState } from "react";

/** True only after mount — guards client-only UI to avoid hydration mismatch. */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}