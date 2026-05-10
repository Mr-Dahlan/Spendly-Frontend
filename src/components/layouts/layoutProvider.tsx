import Sidebar from "../ui/Sidebar";
// import UserAccount from "../UserAccount"; // sesuaikan path

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      {/* Kolom kanan: topbar + konten */}
      <div className="flex flex-col flex-1 overflow-hidden relative">

        {/* Topbar floating kanan atas */}
        {/* <header className="absolute top-4 right-4 z-10 flex items-center gap-2 
    bg-background/80 backdrop-blur-sm border border-border 
    rounded-full px-3 py-2 shadow-sm w-fit">
          <ThemeToggle />
        </header> */}

        {/* Konten utama */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}