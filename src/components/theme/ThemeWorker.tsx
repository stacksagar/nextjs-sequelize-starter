"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeWorker() {
  const { colorScheme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <button
      onClick={toggleColorScheme}
      title="Toggle color scheme"
      className={`p-2 rounded-full transition-all durati dark:border-gray-700 ${
        isDark
          ? "bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20"
          : "bg-blue-400/10 text-blue-400 hover:bg-blue-400/20"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-black dark:text-white" />
      ) : (
        <Moon className="h-5 w-5 text-black dark:text-white" />
      )}
    </button>
  );
}
