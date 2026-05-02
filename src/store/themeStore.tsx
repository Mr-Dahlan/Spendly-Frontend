// src/store/themeStore.ts
import { create } from "zustand";

type Mode = "light" | "dark";

type ThemeStore = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  syncFromUser: (mode: Mode) => void;
};

const applyTheme = (mode: Mode) => {
  const root = document.documentElement;

  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // Untuk CSS native variable
  root.setAttribute("data-theme", mode);
};

const getSavedMode = (): Mode => {
  const saved = localStorage.getItem("mode");
  return saved === "dark" ? "dark" : "light";
};

const useThemeStore = create<ThemeStore>((set) => {
  const initialMode = getSavedMode();
  applyTheme(initialMode);

  return {
    mode: initialMode,

    setMode: (mode) => {
      localStorage.setItem("mode", mode);
      applyTheme(mode);
      set({ mode });
    },

    toggleMode: () => {
      set((state) => {
        const newMode: Mode = state.mode === "dark" ? "light" : "dark";
        localStorage.setItem("mode", newMode);
        applyTheme(newMode);
        return { mode: newMode };
      });
    },

    // Dipanggil dari AuthContext setelah dapat data user dari DB
    syncFromUser: (mode) => {
      localStorage.setItem("mode", mode);
      applyTheme(mode);
      set({ mode });
    },
  };
});

export default useThemeStore;