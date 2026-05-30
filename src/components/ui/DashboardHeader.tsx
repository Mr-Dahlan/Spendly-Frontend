import ThemeToggle from "./ThemeToggle";

interface DashboardHeaderProps {
  userName?: string;
  onAddTransaction: () => void;
}

export default function DashboardHeader({ userName, onAddTransaction }: DashboardHeaderProps) {
  return (
    <>
      <header className="fixed top-4 right-6 z-10 flex items-center gap-2 
          bg-background/80 backdrop-blur-lg
          rounded-full px-3 py-1 shadow-sm w-fit">
        <ThemeToggle />
      </header>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 ">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mt-16 sm:mt-0">
            Financial Overview
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Welcome back, {userName}.
          </p>
        </div>
        <button
          onClick={onAddTransaction}
          className="bg-[var(--blue-primary)] mt-2 sm:mt-14 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-indigo-500/40"
        >
          + Add Transaction
        </button>
      </div>
    </>
  );
}