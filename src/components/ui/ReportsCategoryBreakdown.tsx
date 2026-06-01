// src/components/ui/ReportsCategoryBreakdown.tsx
import React, {  useMemo } from "react";
import type { Transaction } from "../../types/transaction";
import type { Category } from "../../types/category";
import type { Budget } from "../../types/budget";
import { formatCurrency } from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

interface ReportsCategoryBreakdownProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  isLoading: boolean;
  selectedMonth: number;
  selectedYear: number;
}

interface BreakdownRow {
  categoryId: number;
  categoryName: string;
  icon: string;
  amountSpent: number;
  percentage: number;
  budgetStatus: "exceeded" | "warning" | "safe" | "no_budget";
  budgetLimit: number | null;
}

const STATUS_CONFIG = {
  exceeded: {
    label: "OVER BUDGET",
    className: "bg-red-50 text-red-600 border border-red-200",
    barColor: "bg-red-400",
  },
  warning: {
    label: "WARNING",
    className: "bg-amber-50 text-amber-600 border border-amber-200",
    barColor: "bg-amber-400",
  },
  safe: {
    label: "UNDER BUDGET",
    className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    barColor: "bg-violet-400",
  },
  no_budget: {
    label: "NO BUDGET",
    className: "bg-gray-50 text-gray-400 border border-gray-200",
    barColor: "bg-gray-300",
  },
};

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-50">
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-xl" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
    </td>
    <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
    <td className="py-4 px-4"><div className="h-2 bg-gray-200 rounded-full w-full" /></td>
    <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-8" /></td>
    <td className="py-4 px-4"><div className="h-6 bg-gray-200 rounded-full w-24" /></td>
  </tr>
);

const SkeletonCard = () => (
  <div className="animate-pulse px-4 py-3.5 border-b border-gray-50 flex items-center gap-3">
    <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-gray-200 rounded w-32" />
      <div className="h-2 bg-gray-200 rounded-full w-full" />
      <div className="h-3 bg-gray-200 rounded w-20" />
    </div>
    <div className="flex flex-col items-end gap-1.5">
      <div className="h-4 bg-gray-200 rounded w-20" />
      <div className="h-5 bg-gray-200 rounded-full w-20" />
    </div>
  </div>
);

const ReportsCategoryBreakdown: React.FC<ReportsCategoryBreakdownProps> = ({
  transactions,
  categories,
  budgets,
  isLoading,
  selectedMonth,
  selectedYear,
}) => {
  const rows: BreakdownRow[] = useMemo(() => {
    const categoryMap = new Map<number, Category>(
      categories.map((c) => [c.category_id, c]),
    );
    const budgetMap = new Map<number, Budget>(
      budgets.map((b) => [b.category_id, b]),
    );

    const totals: Record<number, number> = {};

    transactions.forEach((tx) => {
      if (tx.type !== "expense") return;
      const date = new Date(tx.transaction_date);
      if (date.getMonth() !== selectedMonth || date.getFullYear() !== selectedYear) return;
      const amount = parseFloat(tx.amount);
      if (isNaN(amount)) return;
      totals[tx.category_id] = (totals[tx.category_id] ?? 0) + amount;
    });

    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

    return Object.entries(totals)
      .map(([catIdStr, amountSpent]): BreakdownRow => {
        const catId = Number(catIdStr);
        const category = categoryMap.get(catId);
        const budget = budgetMap.get(catId);
        const percentage = grandTotal > 0 ? Math.round((amountSpent / grandTotal) * 100) : 0;

        let budgetStatus: BreakdownRow["budgetStatus"] = "no_budget";
        let budgetLimit: number | null = null;

        if (budget) {
          budgetLimit = budget.usage.amount_limit;
          if (budget.usage.is_exceeded) budgetStatus = "exceeded";
          else if (budget.usage.is_warning) budgetStatus = "warning";
          else budgetStatus = "safe";
        }

        return {
          categoryId: catId,
          categoryName: category?.nama ?? `Category ${catId}`,
          icon: category?.icon ?? "📦",
          amountSpent,
          percentage,
          budgetStatus,
          budgetLimit,
        };
      })
      .sort((a, b) => b.amountSpent - a.amountSpent);
  }, [transactions, categories, budgets, selectedMonth, selectedYear]);

  const navigate = useNavigate();

  const onViewAll = () => {
    navigate("/transactions");
  };

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-gray-100 overflow-hidden shadow-[var(--boxShadow)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-lg font-semibold text-[var(--text)]">Category Breakdown</h3>
        <button onClick={onViewAll} className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">
          View All Details
        </button>
      </div>

      {/* ── DESKTOP TABLE (md and above) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["CATEGORY", "AMOUNT SPENT", "PERCENTAGE OF TOTAL", "%", "BUDGET STATUS"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] font-semibold tracking-widest text-[var(--text-secondary)] uppercase py-2 px-4"
                >
                  {h === "%" ? "" : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[var(--text-secondary)] text-sm">
                  No expense data for this period
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const cfg = STATUS_CONFIG[row.budgetStatus] ?? STATUS_CONFIG.no_budget;
                const barPct = row.budgetLimit
                  ? Math.min((row.amountSpent / row.budgetLimit) * 100, 100)
                  : row.percentage;

                return (
                  <tr
                    key={row.categoryId}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/100 flex items-center justify-center text-base flex-shrink-0">
                          {row.icon}
                        </div>
                        <span className="font-medium text-[var(--text-secondary)] whitespace-nowrap">
                          {row.categoryName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[var(--text-secondary)] whitespace-nowrap">
                      {formatCurrency(row.amountSpent)}
                    </td>
                    <td className="py-3.5 px-4 min-w-[120px]">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-secondary)] font-medium">
                      {row.percentage}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARD LIST (below md) ── */}
      <div className="md:hidden">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-[var(--text-secondary)] text-sm">
            No expense data for this period
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map((row) => {
              const cfg = STATUS_CONFIG[row.budgetStatus] ?? STATUS_CONFIG.no_budget;
              const barPct = row.budgetLimit
                ? Math.min((row.amountSpent / row.budgetLimit) * 100, 100)
                : row.percentage;

              return (
                <div key={row.categoryId} className="px-4 py-3.5 flex items-center gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[var(--card-secondery)] flex items-center justify-center text-lg flex-shrink-0">
                    {row.icon}
                  </div>

                  {/* Middle: name, bar, amount */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-[var(--text)] truncate">
                        {row.categoryName}
                      </span>
                      <span className="text-sm font-bold text-[var(--text-secondary)] flex-shrink-0">
                        {formatCurrency(row.amountSpent)}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    {/* Bottom row: percentage + status badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {row.percentage}% of total
                      </span>
                      <span className={`text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsCategoryBreakdown;