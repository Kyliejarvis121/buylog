"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcherBtn() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      className="text-lime-700 dark:text-lime-500"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}