import { useState, useEffect } from "react";
import { useCategories } from "../../hooks/useCategory";
import { useUpdateBudget } from "../../hooks/useBudget";
import type { Budget } from "../../types/budget";

interface EditBudgetModalProps {
  budget: Budget;
  onClose: () => void;
  onSuccess: (budget: Budget) => void;
}

export default function EditBudgetModal({ budget, onClose, onSuccess }: EditBudgetModalProps) {
  const { categories } = useCategories({ type: "expense" });
  const { updateBudget, isLoading, error } = useUpdateBudget();

  const [categoryId, setCategoryId] = useState<number>(budget.category_id || 0);
  const [amountLimit, setAmountLimit] = useState(budget.amount_limit || "");
  const [dueDate, setDueDate] = useState(budget.due_date || "");

  useEffect(() => {
    setCategoryId(budget.category_id || 0);
    setAmountLimit(budget.amount_limit || "");
    setDueDate(budget.due_date || "");
  }, [budget.budget_id]);

  const handleSubmit = async () => {
    await updateBudget(
      budget.budget_id,
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

  const amountLimitNum = parseFloat(amountLimit) || 1;
  const percent = budget.usage.amount_limit > 0
    ? Math.min((budget.usage.spent / amountLimitNum) * 100, 100)
    : 0;

  const isValid = categoryId && amountLimit && parseFloat(amountLimit) > 0 && dueDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Edit Budget Allocation</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Category dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-indigo-400 transition"
          >
            {categories.map((cat) => {
              const catId = (cat as any).category_id || (cat as any).id;
              const catNama = (cat as any).nama || (cat as any).name || "Unknown";
              const catIcon = (cat as any).icon || "💰";
              
              return (
                <option key={catId} value={catId}>
                  {catIcon} {catNama}
                </option>
              );
            })}
          </select>
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
              className="flex-1 outline-none text-xl font-bold text-gray-800 bg-transparent"
            />
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

        {/* Projected spending bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Projected Spending</span>
            <span className="text-indigo-500 font-semibold">{Math.round(percent)}% of total</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
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
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}