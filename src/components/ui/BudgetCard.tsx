import { useState } from "react";
import type { Budget } from "../../types/budget";
import { useDeleteBudget} from "../../hooks/useBudget";

import { formatCurrency } from "../../utils/formatCurrency";

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDeleted: () => void;
}

function getStatusConfig(budget: Budget) {
  // Debug logging
  // console.log("Budget status debug:", {
  //   is_exceeded: budget.usage.is_exceeded,
  //   is_warning: budget.usage.is_warning,
  //   percentage: budget.usage.percentage,
  //   spent: budget.usage.spent,
  //   limit: budget.usage.amount_limit,
  // });

  // Check exceeded first
  if (budget.usage.is_exceeded) {
    return {
      label: "OVER BUDGET",
      barColor: "bg-red-500",
      badgeClass: "bg-red-100 text-red-600",
      remainingClass: "text-red-500 font-semibold",
    };
  }

  // Check warning - is_warning sekarang boolean langsung
  if (budget.usage.is_warning === true) {
    return {
      label: "APPROACHING LIMIT",
      barColor: "bg-yellow-400",
      badgeClass: "bg-yellow-100 text-yellow-700",
      remainingClass: "text-yellow-600 font-semibold",
    };
  }

  // Check if not started
  const percent = budget.usage.percentage ?? 0;
  if (percent === 0) {
    return {
      label: "NOT STARTED",
      barColor: "bg-gray-300",
      badgeClass: "bg-gray-100 text-gray-500",
      remainingClass: "text-gray-500",
    };
  }

  // On track
  return {
    label: "ON TRACK",
    barColor: "bg-green-500",
    badgeClass: "bg-green-100 text-green-700",
    remainingClass: "text-green-600 font-semibold",
  };
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function BudgetCard({ budget, onEdit, onDeleted }: BudgetCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteBudget, isLoading: isDeleting } = useDeleteBudget();

  // Get category directly from budget object (sudah ada relasi dari API)
  const category = (budget as any).category || {};
  const categoryIcon = category.icon || "💰";
  const categoryName = category.nama || "Uncategorized";

  const status = getStatusConfig(budget);
  const percent = Math.min(budget.usage.percentage ?? 0, 100);

  const budgetAmount = parseFloat((budget as any).amount_limit || "0");
  const remaining = budget.usage.is_exceeded
    ? budget.usage.spent - budgetAmount
    : budgetAmount - budget.usage.spent;

  // Format due date - remove time portion and timezone
  const dueDate = budget.due_date 
    ? new Date(budget.due_date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    : "N/A";

  
const handleDelete = async () => {
  await deleteBudget(budget.budget_id, {
    onSuccess: () => {
      setShowDeleteConfirm(false);
      onDeleted();
    },
    onError: () => {
      setShowDeleteConfirm(false);
    },
  });
};

  return (
    <>
      <div className="bg-[var(--card)] rounded-2xl p-4 shadow-[var(--boxShadow)] border text-[var(--text)] border-gray-100 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcon}</span>
            <span className="font-semibold text-[var(--text)] text-sm">
              {categoryName}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-500 transition"
              title="Edit budget"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2 2 0 112.828 2.828L11.828 13.828A4 4 0 019 15H7v-2a4 4 0 012-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-red-500 transition"
              title="Delete budget"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2m10 0H5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Spent vs Budget */}
        <div className="flex justify-between text-xs ">
          <span>
            Spent: <span className="font-medium text-[var(--text-secondary)]">{formatCurrency(budget.usage.spent)}</span>
          </span>
          <span>
            Budget: <span className="font-medium text-[var(--text-secondary)]">{formatCurrency(budgetAmount)}</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${status.barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Status + Remaining */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.badgeClass}`}>
            {status.label}
          </span>
          <span className={`text-xs ${status.remainingClass}`}>
            {budget.usage.is_exceeded
              ? `-${formatIDR(remaining)} over`
              : `${formatIDR(remaining)} left`}
          </span>
        </div>

        {/* Period */}
        <div className="text-xs text-[var(--text-secondary)]">
          Due: {dueDate}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-80 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Delete Budget</h3>
            <p className="text-sm text-gray-500 text-center">
              Are you sure you want to delete this budget? Spending data linked to this category
              will remain but won't be tracked against a budget.
            </p>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete Budget"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}