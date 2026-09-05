"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed right-5 top-5 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg text-text transition-colors hover:border-accent"
    >
      {mounted && (
        <span className="text-base leading-none">{isDark ? "☾" : "☀"}</span>
      )}
    </button>
  );
}
