import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
           (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    } else if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
        className="sr-only"
      />
      <div className="relative w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full p-1 flex items-center">
        <div
          className={`absolute top-1 w-7 h-6 flex items-center justify-center bg-yellow-500 dark:bg-white rounded-full transition-transform ${darkMode ? "translate-x-5" : "translate-x-0"}`}
        >
          {darkMode ? <Moon className="text-gray-500" size={16} /> : <Sun className="text-zinc-700" size={16} />}
        </div>
      </div>
    </label>
  );
}
