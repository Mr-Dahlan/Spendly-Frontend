import { formatCurrency } from "../../utils/formatCurrency";

interface BudgetOverviewHeaderProps {
  totalBudgeted: number;
  totalSpent: number;
  onAddNew: () => void;
}

export default function BudgetOverviewHeader({
  totalBudgeted,
  totalSpent,
  onAddNew,
}: BudgetOverviewHeaderProps) {
  const remaining = totalBudgeted - totalSpent;
  const percent =
    totalBudgeted > 0 ? Math.min((totalSpent / totalBudgeted) * 100, 100) : 0;

  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4">
      {/* Summary card */}
      <div className="flex-1 bg-[var(--card)] rounded-2xl p-5 shadow-[var(--boxShadow)] border border-gray-100 text-[var(--text)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide mb-1">
              Monthly Overview
            </p>
            <h2 className="text-2xl font-bold mb-4">Budget Summary</h2>
            <div className="flex gap-6">
              <div>
                <p className="text-xs  mb-0.5">Total Budgeted</p>
                <p className="text-lg font-bold ">{formatCurrency(totalBudgeted)}</p>
              </div>
              <div>
                <p className="text-xs  mb-0.5">Total Spent</p>
                <p className="text-lg font-bold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Budget
          </button>
        </div>
      </div>

      {/* Donut card */}
      <div className="bg-[var(--card)] rounded-2xl p-5 shadow-[var(--boxShadow)] border border-gray-100 flex flex-col items-center justify-center min-w-[160px]">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--blue-primary)"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#DC2626"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            className="transition-all duration-500"
          />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="var(--blue-primary)"
          >
            {100 - Math.round(percent)}%
          </text>
        </svg>
        <p className="text-xs text-gray-400 mt-1">Utilized</p>
        <p className="text-sm font-semibold text-indigo-600 mt-0.5">
          {formatCurrency(remaining)} left
        </p>
      </div>
    </div>
  );
}

