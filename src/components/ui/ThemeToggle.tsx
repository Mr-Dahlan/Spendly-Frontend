// src/components/ThemeToggle.tsx

import useThemeStore from "../../store/themeStore";
import { useUser } from "../../hooks/useUser";
import UserInfoCard from "./UserInfoProfile";
import NotificationPanel from "./NotificationPanel";

export default function ThemeToggle() {
  const { updateMe } = useUser();
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === "dark";

  const handleToggle = async () => {
    await toggleMode((mode) => updateMe({ mode }));
  };

  return (
    <div className="flex flex-row items-center gap-2 border-none ">
      {/* User info avatar with hover popover */}
      <UserInfoCard />
      <NotificationPanel />

      {/* Theme toggle — 2 icon buttons */}
      <div
        className="flex items-center gap-1 p-1 rounded-full
                   bg-gray-100 dark:bg-gray-800
                    "
      >
        {/* Sun button */}
        <button
          onClick={isDark ? handleToggle : undefined}
          aria-label="Light mode"
          className={`
            p-1.5 rounded-full transition-all duration-200
            ${
              !isDark
                ? "bg-white shadow text-yellow-500 scale-110"
                : "text-gray-400 hover:text-yellow-400 hover:bg-white/10"
            }
          `}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.07-6.07-.71.71M6.64 17.36l-.71.71M17.66 17.36l.71.71M6.64 6.64l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z"
            />
          </svg>
        </button>

        {/* Moon button */}
        <button
          onClick={!isDark ? handleToggle : undefined}
          aria-label="Dark mode"
          className={`
            p-1.5 rounded-full transition-all duration-200
            ${
              isDark
                ? "bg-gray-700 shadow text-blue-400 scale-110"
                : "text-gray-400 hover:text-blue-400 hover:bg-black/5"
            }
          `}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

