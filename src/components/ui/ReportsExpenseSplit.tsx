// src/components/ui/ReportsExpenseSplit.tsx
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Transaction } from "../../types/transaction";
import type { Category } from "../../types/category";

interface ReportsExpenseSplitProps {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  selectedMonth: number;
  selectedYear: number;
}

const COLORS = [
  "#7c3aed", // violet
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f43f5e", // rose
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#84cc16", // lime
];

interface SliceData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d: SliceData = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700">{d.name}</p>
      <p className="text-gray-500">
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(d.value)}
      </p>
      <p className="text-violet-600 font-bold">{d.percentage}%</p>
    </div>
  );
};

const SkeletonDonut = () => (
  <div className="animate-pulse flex flex-col items-center gap-4">
    <div className="w-36 h-36 rounded-full bg-gray-100" />
    <div className="space-y-2 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-100 rounded w-8" />
        </div>
      ))}
    </div>
  </div>
);

const ReportsExpenseSplit: React.FC<ReportsExpenseSplitProps> = ({
  transactions,
  categories,
  isLoading,
  selectedMonth,
  selectedYear,
}) => {
  const slices: SliceData[] = useMemo(() => {
    const categoryMap = new Map<number, string>(
      categories.map((c) => [c.category_id, c.nama]),
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
    if (grandTotal === 0) return [];

    return Object.entries(totals)
      .map(([catId, value], idx) => ({
        name: categoryMap.get(Number(catId)) ?? `Category ${catId}`,
        value,
        percentage: Math.round((value / grandTotal) * 100),
        color: COLORS[idx % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories, selectedMonth, selectedYear]);

  // const totalExpense = slices.reduce((a, b) => a + b.value, 0);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Expense Split
        </h3>
        <SkeletonDonut />
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 border border-gray-100 flex flex-col shadow-[var(--boxShadow)]">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Expense Split
        </h3>
        <p className="text-xs text-[var(--text-secondary)]">
          Proportional spending by category
        </p>
      </div>

      {slices.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[var(--text)] text-sm py-8">
          No expense data
        </div>
      ) : (
        <>
          {/* Donut */}
          <div className="relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={slices}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={74}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {slices.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ zIndex: 9999 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none ">
              <span className="text-lg font-bold text-[var(--text)] z-1">
                100%
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] z-1 uppercase tracking-widest">
                Analyzed
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-2 space-y-2">
            {slices.slice(0, 5).map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-[var(--text-secondary)] truncate max-w-[100px]">
                    {s.name}
                  </span>
                </div>
                <span className="font-semibold text-[var(--text-secondary)]">
                  {s.percentage}%
                </span>
              </div>
            ))}
            {slices.length > 5 && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300 flex-shrink-0" />
                  <span className="text-gray-400">Others</span>
                </div>
                <span className="font-semibold text-gray-500">
                  {slices.slice(5).reduce((a, b) => a + b.percentage, 0)}%
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsExpenseSplit;

