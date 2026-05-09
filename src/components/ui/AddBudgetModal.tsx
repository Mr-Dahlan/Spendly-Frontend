import { useState } from "react";
import { useCategories } from "../../hooks/useCategory";
import { useCreateBudget } from "../../hooks/useBudget";
import type { Budget } from "../../types/budget";

interface AddBudgetModalProps {
  onClose: () => void;
  onSuccess: (budget: Budget) => void;
}

export default function AddBudgetModal({ onClose, onSuccess }: AddBudgetModalProps) {
  const { categories } = useCategories({ type: "expense" });
  const { createBudget, isLoading, error } = useCreateBudget();

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [amountLimit, setAmountLimit] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async () => {
    if (!categoryId || !amountLimit || !dueDate) return;

    createBudget(
      {
        category_id: categoryId,
        amount_limit: amountLimit,
        due_date: dueDate,
      } as any,
      (data) => {
        onSuccess(data);
        onClose();
      }
    );
  };

  const isValid = categoryId && amountLimit && parseFloat(amountLimit) > 0 && dueDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Add Monthly Budget</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Amount Limit
          </label>
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 transition">
            <span className="text-gray-400 mr-2 font-medium">IDR</span>
            <input
              type="number"
              min="0"
              value={amountLimit}
              onChange={(e) => setAmountLimit(e.target.value)}
              placeholder="0"
              className="flex-1 outline-none text-xl font-bold text-gray-800 bg-transparent"
            />
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const catId = (cat as any).category_id || (cat as any).id;
              const catNama = (cat as any).nama || (cat as any).name || "Unknown";
              const catIcon = (cat as any).icon || "💰";
              
              return (
                <button
                  key={catId}
                  onClick={() => setCategoryId(catId)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition
                    ${categoryId === catId
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300"
                    }`}
                >
                  <span className="text-lg">{catIcon}</span>
                  <span>{catNama}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-indigo-400 transition"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Budget"}
          </button>
        </div>
      </div>
    </div>
  );
}