import { useState, useEffect } from "react";
import { useCategories } from "../../hooks/useCategory";
import type {
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from "../../types/transaction";
import TransactionDatePicker from "./TransactionDatePicker";
import { formatInputNumber, parseInputNumber } from "../../utils/formatNumber";

interface TransactionModalProps {
  mode: "add" | "edit";
  initialData?: Transaction | null;
  onSave: (
    payload: CreateTransactionPayload | UpdateTransactionPayload,
  ) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

export default function TransactionModal({
  mode,
  initialData,
  onSave,
  onClose,
  isSaving,
}: TransactionModalProps) {
  const [type, setType] = useState<"expense" | "income">(
    (initialData?.type as "expense" | "income") ?? "expense",
  );
  const [amount, setAmount] = useState(
    initialData?.amount ? String(parseFloat(initialData.amount)) : "",
  );
  const [categoryId, setCategoryId] = useState<number | "">(
    initialData?.category_id ?? "",
  );
  const [date, setDate] = useState(initialData?.transaction_date ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { categories } = useCategories({ type });

  // Reset category kalau type berubah
  useEffect(() => {
    if (!initialData) setCategoryId("");
  }, [type, initialData]);

  const formatDisplayDate = (d: string) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${MONTHS[parseInt(m) - 1]} ${parseInt(day)}, ${y}`;
  };

  const handleSubmit = async () => {
    if (!amount || !categoryId || !date) return;
    await onSave({
      type,
      amount: parseInputNumber(amount).toString(), // ← tambahkan parseInputNumber seperti di budget
      category_id: categoryId as number,
      transaction_date: date,
      description: description || "",
    });
  };

  const isFormValid = !!amount && !!categoryId && !!date;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center text[var(--text)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card)] rounded-3xl shadow-2xl w-full max-w-md mx-4 p-6 animate-[modalIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">
            {mode === "add" ? "Add Transaction" : "Edit Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Type Toggle */}
        <div className="flex bg-[var(--bg-secondary)] text-[var(--text-oposite)] rounded-2xl p-1 mb-5">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200
                ${
                  type === t
                    ? t === "income"
                      ? "bg-indigo-600 text-[var(--text)] shadow-md shadow-sm"
                      : "bg-[var(--red-primary)] text-[var(--text)] shadow-sm "
                    : " hover:text-[var(--text-oposite)]"
                }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            Transaction Amount
          </label>
          <div className="flex items-center bg-[var(--bg-secondary)] border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <span className="text-[var(--text)] font-semibold text-sm mr-2">
              IDR
            </span>
            <input
              type="text"
              inputMode="numeric"
              min={0}
              value={amount}
              onChange={(e) => setAmount(formatInputNumber(e.target.value))}
              placeholder="0.00"
              className="flex-1 bg-transparent text-2xl font-bold outline-none placeholder-gray-100"
            />
          </div>
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full bg-[var(--bg-secondary)] text-gray-300 border border-gray-200 rounded-2xl px-3 py-3 text-sm  outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 appearance-none transition-all cursor-pointer"
              >
                <option value="">Select...</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.icon ? `${cat.icon} ` : ""}
                    {cat.nama}
                  </option>
                ))}
              </select>
              <svg
                className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] uppercase tracking-wider mb-2">
              Date
            </label>
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="w-full bg-[var(--bg-secondary)] border border-gray-200 rounded-2xl px-3 py-3 text-sm text-left flex items-center gap-2 hover:border-indigo-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              <svg
                className="w-4 h-4 text-indigo-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className={date ? "text-[var(--text)]" : "text-gray-300"}>
                {date ? formatDisplayDate(date) : "mm/dd/yyyy"}
              </span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[var(--text)] uppercase tracking-wider mb-2">
            Description
          </label>
          <div className="bg-[var(--bg-secondary)] border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <div className="flex gap-2">
              <svg
                className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more description on your transaction"
                className="flex-1 bg-transparent text-sm text-[var(--text-secondary)] outline-none resize-none placeholder-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSaving}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all
              ${
                type === "income"
                  ? "bg-indigo-600 hover:bg-indigo-700  disabled:opacity-40"
                  : "bg-[var(--red-primary)] hover:bg-red-700 disabled:opacity-40"
              }`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Save {type === "income" ? "Income" : "Expense"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Date Picker Popup */}
      {showDatePicker && (
        <TransactionDatePicker
          value={date}
          onChange={(d) => setDate(d)}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}

