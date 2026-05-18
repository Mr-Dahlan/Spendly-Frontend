const ICON_BG = [
  "bg-indigo-50", "bg-pink-50", "bg-yellow-50", "bg-red-50",
  "bg-emerald-50", "bg-blue-50", "bg-orange-50", "bg-cyan-50",
];
const ICON_FG = [
  "text-indigo-600", "text-pink-600", "text-yellow-600", "text-red-600",
  "text-emerald-600", "text-blue-600", "text-orange-600", "text-cyan-600",
];

export interface RecentTransaction {
  transaction_id: number;
  description: string;
  categoryName: string;
  categoryIcon: string;
  parsedAmount: number;
  type: "income" | "expense";
  transaction_date: string;
}

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  formatIDR: (value: number) => string;
  formatDate: (dateStr: string) => string;
  onViewAll: () => void;
}

export default function RecentTransactions({
  transactions,
  formatIDR,
  formatDate,
  onViewAll,
}: RecentTransactionsProps) {
  return (
    <div className="bg-[var(--card)] p-6 rounded-2xl shadow-[var(--boxShadow)] border border-[var(--border)]/30 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--text)]">Recent Transactions</h2>
        <button
          onClick={onViewAll}
          className="text-indigo-600 text-[13px] font-semibold hover:text-indigo-800 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col">
        {transactions.length > 0 ? (
          transactions.map((t, index) => (
            <div
              key={t.transaction_id}
              className="flex items-center gap-4 py-3.5 border-b border-[var(--border)]/50 last:border-0"
            >
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${ICON_BG[index % ICON_BG.length]} ${ICON_FG[index % ICON_FG.length]}`}
              >
                {t.categoryIcon || "💰"}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-[var(--text)] truncate">
                  {t.description}
                </span>
                <span className="block text-[12px] text-[var(--text-secondary)] mt-0.5 truncate">
                  {t.categoryName.toUpperCase()} • {formatDate(t.transaction_date)}
                </span>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <span
                  className={`text-sm font-bold ${
                    t.type === "income" ? "text-[var(--green-primary)]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}IDR {formatIDR(t.parsedAmount)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-sm text-[var(--text-secondary)]">
            No recent transactions
          </div>
        )}
      </div>
    </div>
  );
}