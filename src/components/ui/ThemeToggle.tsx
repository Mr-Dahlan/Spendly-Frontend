// src/components/ThemeToggle.tsx
import useThemeStore from "../../store/themeStore";

export default function ThemeToggle() {
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === "dark";

  return (
    <div
      onClick={toggleMode}
      aria-label="Toggle theme"
      className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border 
                border-gray-200 dark:border-gray-700 
                bg-white dark:bg-gray-800 
                text-gray-600 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition-all duration-200 text-sm "
    >
      {/* Sun icon */}
      <svg
        className={`w-4 h-4 transition-opacity duration-200 ${isDark ? "opacity-40" : "opacity-100 text-yellow-500"}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.07-6.07-.71.71M6.64 17.36l-.71.71M17.66 17.36l.71.71M6.64 6.64l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z"
        />
      </svg>

      {/* Track toggle */}
      <div className={`relative w-8 h-4 rounded-full transition-colors duration-300 
                       ${isDark ? "bg-gray-600" : "bg-gray-300"}`}>
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow
                         transition-transform duration-300
                         ${isDark ? "translate-x-4" : "translate-x-0"}`}
        />
      </div>

      {/* Moon icon */}
      <svg
        className={`w-4 h-4 transition-opacity duration-200 ${isDark ? "opacity-100 text-blue-400" : "opacity-40"}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        />
      </svg>
    </div>
  );
}