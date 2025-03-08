import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-300 text-gray-900 dark:bg-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
      <span className="text-sm">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
};

export default ThemeSwitch;
