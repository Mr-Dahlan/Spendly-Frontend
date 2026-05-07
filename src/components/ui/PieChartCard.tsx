import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const PIE_COLORS = [
  "#7C3AED", "#EC4899", "#F59E0B", "#EF4444",
  "#10B981", "#3B82F6", "#F97316", "#06B6D4",
];

export interface CategoryDataItem {
  name: string;
  value: number;
  percentage: number;
}

interface PieChartCardProps {
  data: CategoryDataItem[];
  totalExpense: number;
  formatIDR: (value: number) => string;
}

export default function PieChartCard({ data, totalExpense, formatIDR }: PieChartCardProps) {
  return (
    <div className="bg-[var(--card)] p-6 rounded-2xl shadow-sm border border-[var(--border)]/30">
      <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Spending by Category</h2>

      {data.length > 0 ? (
        <div className="flex flex-col h-full">
          {/* Pie Chart */}
          <div className="relative flex justify-center items-center h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={65}
                  outerRadius={90}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                  animationBegin={300}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute text-center pointer-events-none flex flex-col items-center justify-center">
              <span className="text-xs text-[var(--text-secondary)] block">Total</span>
              <strong className="text-base font-bold text-[var(--text)] block px-4 leading-tight">
                IDR {formatIDR(totalExpense)}
              </strong>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-col gap-3 flex-1 overflow-y-auto max-h-[160px] pr-2 scrollbar-hide">
            {data.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-[var(--text)] truncate max-w-[100px]">{cat.name}</span>
                </div>
                <span className="font-semibold text-[var(--text)]">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-sm text-[var(--text-secondary)]">
          No expense data available
        </div>
      )}
    </div>
  );
}