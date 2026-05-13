import Sidebar from "../ui/Sidebar";
import { useLenis } from "../../hooks/useLenis"; // sesuaikan path

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const contentRef = useLenis();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Konten utama */}
        <main ref={contentRef} className="flex-1 overflow-y-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}