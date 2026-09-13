import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem("stockflow_theme") || "light";
    } catch (e) {
      return "light";
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState("light");

  const setTheme = (newTheme) => {
    try {
      localStorage.setItem("stockflow_theme", newTheme);
    } catch (e) {
      console.error("Failed to save theme to localStorage", e);
    }
    setThemeState(newTheme);
  };

  useEffect(() => {
    const updateResolvedTheme = () => {
      let activeTheme = theme;
      if (theme === "system") {
        activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      setResolvedTheme(activeTheme);
      
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(activeTheme);
    };

    updateResolvedTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateResolvedTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
