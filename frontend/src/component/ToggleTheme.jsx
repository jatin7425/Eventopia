import React, { useContext, useEffect, useState } from 'react';
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from '../store/ThemeContext.jsx';
import { motion } from 'framer-motion';

// ✅ Simple Toggle Theme Button Component
export const SimpleToggleThemeBtn = ({ size = 14 }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <label htmlFor="dark-toggle" className={`flex items-center cursor-pointer gap-${size / 2}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    id="dark-toggle"
                    className="hidden"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                />
                <div className={`block border border-gray-800 dark:border-white w-${size} h-${size / 2} rounded-full`}></div>
                <div
                    className={`dot absolute left-1 top-1 w-${size / 3.5} h-${size / 3.5} rounded-full transition transform ${theme === 'dark' ? `translate-x-${size / 1.75} bg-white` : 'translate-x-0 bg-gray-800'}`}
                ></div>
            </div>
        </label>
    );
};

// ✅ Styled Toggle Theme Button Component
export const DesignedToggleBtn = ({ size = 12 }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className={`border border-gray-500 p-1 rounded-full flex justify-between w-${size * 3}`} onClick={toggleTheme}>
            <button
                type="button"
                className={`rounded-full py-1 px-2 text-sm font-semibold ${theme === 'light' ? 'bg-gray-500 text-white' : 'text-gray-400'}`}
            >
                Light
            </button>

            <button
                type="button"
                className={`rounded-full py-1 px-2 text-sm font-semibold ${theme === 'dark' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
            >
                Dark
            </button>
        </div>
    );
};

// ✅ Dynamic Size Toggle Theme Button Component
export const ToggleThemeBtn = ({ size = 10 }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <button
            onClick={toggleTheme}
            className={`relative w-${size * 2} h-${size} flex items-center justify-between rounded-full bg-gray-200 dark:bg-gray-600 p-1 transition-all duration-300`}
            aria-label="Toggle Dark Mode"
        >
            <span
                className={`absolute w-${size - 2} h-${size - 2} bg-white dark:bg-gray-800 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? `right-1` : 'left-1'}`}
            ></span>
        </button>
    );
};

export const ImagesToggleBtn = ({ size = 12 }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <button
            onClick={toggleTheme}
            className={`relative w-${size} h-${size} flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 shadow-md transition-all duration-300 focus:outline-none`}
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-${size / 1.5} h-${size / 1.5} text-yellow-400`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2m0 14v2m9-9h-2M5 12H3m16.364-7.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-${size / 1.5} h-${size / 1.5} text-blue-500`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z"
                    />
                </svg>
            )}
        </button>
    );
};


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
      <motion.label
        className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          className="sr-only"
        />
        <div className="relative w-12 h-3 bg-gray-400 dark:bg-gray-500 rounded-full p-1 flex items-center">
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-yellow-500 dark:bg-white rounded-full transition-transform ${darkMode ? "translate-x-5" : "-translate-x-1"}`}
          >
            {darkMode ? <Moon className="text-gray-500" size={16} /> : <Sun className="text-zinc-700" size={16} />}
          </div>
        </div>
      </motion.label>
    );
  }
  