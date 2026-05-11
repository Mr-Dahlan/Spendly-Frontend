import type { Transaction } from "../../types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
  categoryMap: Record<number, { nama: string; icon: string }>;
  isLoading: boolean;
  currentPage: number;
  totalEntries: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TYPE_BADGE = {
  income: "text-emerald-600 bg-emerald-50",
  expense: "text-red-500 bg-red-50",
};

const TYPE_ICON = {
  income: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
  ),
  expense: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 7L7.8 16.2M7 7v10h10" />
    </svg>
  ),
};

export default function TransactionTable({
  transactions,
  categoryMap,
  isLoading,
  currentPage,
  totalEntries,
  perPage,
  onPageChange,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const formatIDR = (val: string) =>
    new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2 }).format(parseFloat(val));

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const totalPages = Math.ceil(totalEntries / perPage);
  const startEntry = (currentPage - 1) * perPage + 1;
  const endEntry = Math.min(currentPage * perPage, totalEntries);

  // Halaman yang ditampilkan di pagination (max 3 angka)
  const pageNumbers = () => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-[var(--card)] rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0">
            <div className="w-20 h-4 bg-gray-100 rounded-lg animate-pulse" />
            <div className="w-24 h-6 bg-gray-100 rounded-full animate-pulse" />
            <div className="flex-1 h-4 bg-gray-100 rounded-lg animate-pulse" />
            <div className="w-16 h-4 bg-gray-100 rounded-full animate-pulse" />
            <div className="w-24 h-4 bg-gray-100 rounded-lg animate-pulse ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[120px_1fr_1fr_190px_180px_80px] px-6 py-3 border-b border-gray-100 bg-[var(--card)]">
        {["DATE", "CATEGORY", "DESCRIPTION", "TYPE", "AMOUNT", "ACTIONS"].map((h) => (
          <span key={h} className="text-[11px] font-semibold text-[var(--text)] tracking-wider">{h}</span>
        ))}
      </div>

      {/* Rows */}
      {transactions.length === 0 ? (
        <div className="text-center py-16 text-[var(--text)]">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium">No transactions found</p>
        </div>
      ) : (
        transactions.map((t, idx) => {
          const cat = categoryMap[t.category_id];
          const isIncome = t.type === "income";
          return (
            <div
              key={t.transaction_id}
              className="grid grid-cols-[120px_1fr_1fr_190px_180px_80px] items-center px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-blue-500/60 transition-colors group"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Date */}
              <span className="text-sm text-[var(--text)]">{formatDate(t.transaction_date)}</span>

              {/* Category */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--card-secondery)] text-[var(--text)]">
                  {cat?.icon && <span>{cat.icon}</span>}
                  {cat?.nama ?? "Unknown"}
                </span>
              </div>

              {/* Description */}
              <span className="text-sm text-[var(--text)] truncate pr-4">{t.description}</span>

              {/* Type */}
              <div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${TYPE_BADGE[t.type as "income" | "expense"] ?? "bg-gray-100 text-gray-600"}`}>
                  {TYPE_ICON[t.type as "income" | "expense"]}
                  {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                </span>
              </div>

              {/* Amount */}
              <span className={`text-sm font-bold ${isIncome ? "text-[var(--green-primary)]" : "text-[var(--text)]"}`}>
                {isIncome ? "+" : "-"}IDR {formatIDR(t.amount)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(t)}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 flex items-center justify-center transition-colors"
                  title="Edit"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(t)}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 flex items-center justify-center transition-colors"
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Pagination */}
      {totalEntries > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] bg-[var(--card)] text-[var(--text)]">
          <span className="text-sm text-gray-300">
            Showing {startEntry} to {endEntry} of {totalEntries} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-[var(--text)] hover:bg-white hover:text-[var(--text-opposite)] disabled:opacity-30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {pageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-xl text-sm font-semibold transition-all
                  ${p === currentPage
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "border border-gray-200 hover:bg-white hover:text-[var(--text-opposite)]"}
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white disabled:opacity-30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}