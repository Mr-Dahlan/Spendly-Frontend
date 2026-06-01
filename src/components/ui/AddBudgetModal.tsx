// src/components/ui/AddBudgetModal.tsx
import { useState } from "react";
import { formatInputNumber, parseInputNumber } from "../../utils/formatNumber";
import { useCategories } from "../../hooks/useCategory";
import { useCreateBudget } from "../../hooks/useBudget";
import { useLenisPrevent } from "../../hooks/useLenisPrevent";
import TransactionDatePicker from "./TransactionDatePicker";
import { getUserCurrency } from "../../utils/currency";

interface AddBudgetModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBudgetModal({
  onClose,
  onSuccess,
}: AddBudgetModalProps) {
  const { categories } = useCategories({ type: "expense" });
  const { createBudget, isLoading, error } = useCreateBudget();
  const scrollRef = useLenisPrevent<HTMLDivElement>();
  const currency = getUserCurrency();

  const [categoryId, setCategoryId] = useState<number | null>(null);

  // simpan format tampilan
  const [amountLimit, setAmountLimit] = useState("");

  const [dueDate, setDueDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (!categoryId || !amountLimit || !dueDate) return;

    createBudget(
      {
        category_id: categoryId,

        // kirim angka mentah ke backend
        amount_limit: parseInputNumber(amountLimit),

        due_date: dueDate,
      } as any,
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      },
    );
  };

  const isValid =
    categoryId && amountLimit && parseInputNumber(amountLimit) > 0 && dueDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--card)] rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">
              Add Monthly Budget
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Set spending limit for your category
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wide">
            Amount Limit
          </label>

          <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-4 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition">
            <span className="text-gray-400 mr-3 font-semibold text-lg">{currency.symbol}</span>

            <input
              type="text"
              inputMode="numeric"
              value={amountLimit}
              onChange={(e) =>
                setAmountLimit(formatInputNumber(e.target.value))
              }
              placeholder="0"
              className="flex-1 outline-none text-2xl font-bold text-[var(--text)] bg-transparent placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Category */}
        <div ref={scrollRef} className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wide">
            Category
          </label>

          <div
            ref={scrollRef}
            className="
      max-h-45
      overflow-y-auto
      pr-1
      custom-scrollbar
    "
          >
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const catId = (cat as any).category_id || (cat as any).id;

                const catNama = (cat as any).nama || (cat as any).name;

                const catIcon = (cat as any).icon || "💰";

                const active = categoryId === catId;

                return (
                  <button
                    key={catId}
                    onClick={() => setCategoryId(catId)}
                    className={`
              flex
              flex-col
              items-center
              justify-center
              gap-1
              px-2
              py-2.5
              rounded-xl
              border
              transition-all
              duration-200
              min-h-[82px]

              ${
                active
                  ? `
                    border-indigo-500
                    bg-indigo-50
                    shadow-sm
                    
                  `
                  : `
                    border-gray-200
                    hover:border-indigo-300
                    hover:bg-gray-200
                    hover:text-[var(--text-opposite)]
                  `
              }
            `}
                  >
                    <span className="text-xl">{catIcon}</span>

                    <span
                      className={`
                text-[11px]
                w-full
                font-medium
                text-center
                leading-tight
                line-clamp-2
                ${active ? "text-[var(--text-opposite)]" : "hover:text-[var(--text-opposite)]"}
              `}
                    >
                      {catNama}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wide">
            Due Date
          </label>

          <button
            type="button"
            onClick={() => setShowDatePicker(true)}
            className="
      w-full
      border
      border-gray-200
      rounded-2xl
      px-4
      py-3
      text-sm
      text-left
      bg-[var(--card)]
      text-[var(--text)]
      hover:border-indigo-400
      transition
    "
          >
            {dueDate
              ? new Date(dueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Select due date"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-2xl px-4 py-3">
            {error.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-[var(--text-secondary)] font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            {isLoading ? "Saving..." : "Save Budget"}
          </button>
        </div>
      {/* Date Picker */}
      {showDatePicker && (
        <TransactionDatePicker
          value={dueDate}
          onChange={(date) => setDueDate(date)}
          onClose={() => setShowDatePicker(false)}
        />
      )}
      </div>
    </div>
  );
}
