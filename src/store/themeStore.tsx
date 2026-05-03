// src/store/themeStore.ts
import { create } from "zustand";

type Mode = "light" | "dark";

type ThemeStore = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: (updateFn?: (mode: Mode) => Promise<void>) => Promise<void>;
  syncFromUser: (mode: Mode) => void;
};

const applyTheme = (mode: Mode) => {
  const root = document.documentElement;

  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  root.setAttribute("data-theme", mode);
};

const getSavedMode = (): Mode => {
  const saved = localStorage.getItem("mode");
  return saved === "dark" ? "dark" : "light";
};

const useThemeStore = create<ThemeStore>((set, get) => {
  const initialMode = getSavedMode();
  applyTheme(initialMode);

  return {
    mode: initialMode,

    setMode: (mode) => {
      localStorage.setItem("mode", mode);
      applyTheme(mode);
      set({ mode });
    },

    toggleMode: async (updateFn) => {
  const current = get().mode;
  const newMode: Mode = current === "dark" ? "light" : "dark";

  // update UI dulu (biar cepat)
  localStorage.setItem("mode", newMode);
  applyTheme(newMode);
  set({ mode: newMode });

  // sync ke backend kalau ada function-nya
  if (updateFn) {
    await updateFn(newMode);
  }
},

    syncFromUser: (mode) => {
      localStorage.setItem("mode", mode);
      applyTheme(mode);
      set({ mode });
    },
  };
});

export default useThemeStore;
