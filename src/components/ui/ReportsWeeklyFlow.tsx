// src/components/ui/ReportsWeeklyFlow.tsx
import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Transaction } from "../../types/transaction";

interface ReportsWeeklyFlowProps {
  transactions: Transaction[];
  isLoading: boolean;
  selectedMonth: number; // 0–11
  selectedYear: number;
}

interface WeeklyData {
  week: string;
  income: number;
  expense: number;
}

function getWeekOfMonth(date: Date): number {
  const day = date.getDate();
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const fmt = (v: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(v);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-600 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-gray-500 capitalize">{p.name}:</span>
          <span className="font-semibold text-gray-800">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const SkeletonChart = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
    <div className="h-48 bg-gray-100 rounded-xl" />
  </div>
);

const ReportsWeeklyFlow: React.FC<ReportsWeeklyFlowProps> = ({
  transactions,
  isLoading,
  selectedMonth,
  selectedYear,
}) => {
  const weeklyData: WeeklyData[] = useMemo(() => {
    const weeks: WeeklyData[] = [
      { week: "Week 1", income: 0, expense: 0 },
      { week: "Week 2", income: 0, expense: 0 },
      { week: "Week 3", income: 0, expense: 0 },
      { week: "Week 4", income: 0, expense: 0 },
    ];

    transactions.forEach((tx) => {
      const date = new Date(tx.transaction_date);
      if (
        date.getMonth() !== selectedMonth ||
        date.getFullYear() !== selectedYear
      )
        return;

      const weekIdx = getWeekOfMonth(date) - 1;
      const amount = parseFloat(tx.amount);
      if (isNaN(amount)) return;

      if (tx.type === "income") {
        weeks[weekIdx].income += amount;
      } else if (tx.type === "expense") {
        weeks[weekIdx].expense += amount;
      }
    });

    return weeks;
  }, [transactions, selectedMonth, selectedYear]);

  const hasData = weeklyData.some((w) => w.income > 0 || w.expense > 0);

  if (isLoading) return <SkeletonChart />;

  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 border border-gray-100 shadow-[var(--boxShadow)]">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">Weekly Flow</h3>
          <p className="text-xs text-[var(--text-secondary)]">Income vs Expenses over the month</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />
            Income
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            Expense
          </span>
        </div>
      </div>

      {!hasData ? (
        <div className="h-48 flex items-center justify-center text-gray-300 text-sm">
          No transaction data for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                new Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  maximumFractionDigits: 0,
                }).format(v)
              }
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#7c3aed"
              strokeWidth={2.5}
              fill="url(#incomeGrad)"
              dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#fb923c"
              strokeWidth={2.5}
              fill="url(#expenseGrad)"
              dot={{ r: 4, fill: "#fb923c", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ReportsWeeklyFlow;