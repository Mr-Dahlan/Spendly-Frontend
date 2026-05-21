// src/components/ui/ReportsCategoryBreakdown.tsx
import React, { useMemo } from "react";
import type { Transaction } from "../../types/transaction";
import type { Category } from "../../types/category";
import type { Budget } from "../../types/budget";
import { useLenisPrevent } from "../../hooks/useLenisPrevent";
import { formatCurrency } from "../../utils/formatCurrency";

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
    <td className="py-4 px-4">
      <div className="h-4 bg-gray-200 rounded w-28" />
    </td>
    <td className="py-4 px-4">
      <div className="h-2 bg-gray-200 rounded-full w-full" />
    </td>
    <td className="py-4 px-4">
      <div className="h-4 bg-gray-200 rounded w-8" />
    </td>
    <td className="py-4 px-4">
      <div className="h-6 bg-gray-200 rounded-full w-24" />
    </td>
  </tr>
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
      if (
        date.getMonth() !== selectedMonth ||
        date.getFullYear() !== selectedYear
      )
        return;
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
        const percentage =
          grandTotal > 0 ? Math.round((amountSpent / grandTotal) * 100) : 0;

        let budgetStatus: BreakdownRow["budgetStatus"] = "no_budget";
        let budgetLimit: number | null = null;

        if (budget) {
          budgetLimit = budget.usage.amount_limit;
          budgetStatus = budget.usage.status as BreakdownRow["budgetStatus"];
          // Normalize backend status values
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

    const scrollRef = useLenisPrevent<HTMLDivElement>();

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-gray-100 overflow-hidden shadow-[var(--boxShadow)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-lg font-semibold text-[var(--text)]">
          Category Breakdown
        </h3>
        <button className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">
          View All Details
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "CATEGORY",
                "AMOUNT SPENT",
                "PERCENTAGE OF TOTAL",
                "%",
                "BUDGET STATUS",
              ].map((h) => (
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
                <td
                  colSpan={5}
                  className="py-10 text-center text-[var(--text-secondary)] text-sm"
                >
                  No expense data for this period
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const cfg =
                  STATUS_CONFIG[row.budgetStatus] ?? STATUS_CONFIG.no_budget;
                const barPct = row.budgetLimit
                  ? Math.min((row.amountSpent / row.budgetLimit) * 100, 100)
                  : row.percentage;

                return (
                  <tr
                    ref={scrollRef}
                    key={row.categoryId}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Category */}
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

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-semibold text-[var(--text-secondary)] whitespace-nowrap">
                      {formatCurrency(row.amountSpent)}
                    </td>

                    {/* Progress bar */}
                    <td className="py-3.5 px-4 min-w-[120px]">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </td>

                    {/* Percentage */}
                    <td className="py-3.5 px-4 text-[var(--text-secondary)] font-medium">
                      {row.percentage}%
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.className}`}
                      >
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
    </div>
  );
};

export default ReportsCategoryBreakdown;

