"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MantineProvider } from "@mantine/core";

// Define the color scheme type
export type ColorScheme = "light" | "dark";

// Define the theme context type
interface ThemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}

// Create the theme context
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// ThemeProvider component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    // Check local storage for theme preference
    if (typeof window !== "undefined") {
      const storedScheme = localStorage.getItem("color-scheme") as ColorScheme;
      if (storedScheme) return storedScheme;
    }
    // Default to light theme
    return "light";
  });

  // Toggle the color scheme
  const toggleColorScheme = () => {
    setColorScheme((prevScheme: ColorScheme) =>
      prevScheme === "light" ? "dark" : "light"
    );
  };

  // Update the theme and local storage
  useEffect(() => {
    const root = window.document.documentElement;
    if (colorScheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("color-scheme", colorScheme);
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      <MantineProvider>{children}</MantineProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
