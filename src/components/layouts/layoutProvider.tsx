// src/ui/LayoutProvider.tsx
import Sidebar from "../ui/Sidebar";

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden relative min-w-0">
          <main className="flex-1 overflow-y-scroll h-auto">
            {children}
          </main>
        </div>
      </div>
  );
}