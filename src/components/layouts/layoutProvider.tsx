// src/ui/LayoutProvider.tsx
import Sidebar from "../ui/Sidebar";
import { useLenis } from "../../hooks/useLenis";
import { LenisContext } from "../../context/LenisContext";

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { containerRef, lenisRef } = useLenis();
  return (
    <LenisContext.Provider value={lenisRef}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden relative min-w-0">
          <main ref={containerRef} className="flex-1 overflow-y-scroll">
            {children}
          </main>
        </div>
      </div>
    </LenisContext.Provider>
  );
}