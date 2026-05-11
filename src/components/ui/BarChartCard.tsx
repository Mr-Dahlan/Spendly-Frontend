import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface MonthlyDataItem {
  name: string;
  income: number;
  expense: number;
}

interface BarChartCardProps {
  data: MonthlyDataItem[];
  formatIDR: (value: number) => string;
}

export default function BarChartCard({ data, formatIDR }: BarChartCardProps) {
  return (
    <div className="lg:col-span-2 bg-[var(--card)] p-6 rounded-2xl shadow-sm border border-[var(--border)]/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-[var(--text)]">Income vs Expenses</h2>
        <div className="flex gap-4 text-[13px] text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Expense
          </span>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-[250px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} barGap={4} barCategoryGap="20%">
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-[var(--card)] px-4 py-3 rounded-xl shadow-lg text-sm text-[var(--text)] border border-[var(--border)]">
                      <p className="font-bold mb-2">{label}</p>
                      {payload.map((p: any, i: number) => (
                        <p key={i} style={{ color: p.fill }} className="my-1 font-medium">
                          {p.name === "income" ? "Income" : "Expense"}: IDR {formatIDR(p.value ?? 0)}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Bar dataKey="income" fill="#4F46E5" radius={[6, 6, 0, 0]} animationDuration={1200} animationBegin={100} />
              <Bar dataKey="expense" fill="#EF4444" radius={[6, 6, 0, 0]} animationDuration={1200} animationBegin={400} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-10 text-sm text-[var(--text-secondary)]">
          No transaction data available
        </div>
      )}
    </div>
  );
}