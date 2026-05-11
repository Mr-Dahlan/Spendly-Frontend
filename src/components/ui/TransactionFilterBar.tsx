import { useCategories } from "../../hooks/useCategory";

interface Filters {
  dateRange: "7" | "30" | "90" | "all";
  type: "" | "income" | "expense";
  categoryId: number | "";
}

interface TransactionFilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const DATE_RANGE_LABELS: Record<Filters["dateRange"], string> = {
  "7": "Last 7 Days",
  "30": "Last 30 Days",
  "90": "Last 90 Days",
  "all": "All Time",
};

export default function TransactionFilterBar({ filters, onChange }: TransactionFilterBarProps) {
  const { categories } = useCategories();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text[var(--text)] mb-6">
      {/* Date Range */}
      <div className="bg-[var(--card)] border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1">Date Range</label>
        <div className="relative">
          <svg className="w-3.5 h-3.5 text-indigo-500 absolute left-0 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <select
            value={filters.dateRange}
            onChange={(e) => onChange({ ...filters, dateRange: e.target.value as Filters["dateRange"] })}
            className="w-full pl-5 text-sm font-medium outline-none appearance-none cursor-pointer text-[var(--text)]"
          >
            {Object.entries(DATE_RANGE_LABELS).map(([val, label]) => (
              <option key={val} value={val} className="text-[var(--text-opposite)]">{label}</option>
            ))}
          </select>
          <svg className="w-3.5 h-3.5 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Type */}
      <div className="bg-[var(--card)] border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Type</label>
        <div className="relative">
          <svg className="w-3.5 h-3.5 text-indigo-500 absolute left-0 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value as Filters["type"] })}
            className="w-full pl-5 text-sm font-medium bg-transparent outline-none appearance-none cursor-pointer"
          >
            <option value="" className="text-[var(--text-opposite)]">All Types</option>
            <option value="income" className="text-[var(--text-opposite)]">Income</option>
            <option value="expense" className="text-[var(--text-opposite)]">Expense</option>
          </select>
          <svg className="w-3.5 h-3.5 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Category */}
      <div className="bg-[var(--card)] border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Category</label>
        <div className="relative">
          <svg className="w-3.5 h-3.5 text-indigo-500 absolute left-0 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <select
            value={filters.categoryId}
            onChange={(e) => onChange({ ...filters, categoryId: e.target.value ? Number(e.target.value) : "" })}
            className="w-full pl-5 text-sm font-medium bg-transparent outline-none appearance-none cursor-pointer"
          >
            <option value="" className="text-[var(--text-opposite)]">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id} className="text-[var(--text-opposite)]">
                {cat.icon ? `${cat.icon} ` : ""}{cat.nama}
              </option>
            ))}
          </select>
          <svg className="w-3.5 h-3.5 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}