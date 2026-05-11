import { useState } from "react";
import { useBudgets } from "../hooks/useBudget";
import type { Budget } from "../types/budget";

import BudgetOverviewHeader from "../components/ui/BudgetOverviewHeader";
import BudgetCard from "../components/ui/BudgetCard";
import AddBudgetModal from "../components/ui/AddBudgetModal";
import EditBudgetModal from "../components/ui/EditBudgetModal";

export default function BudgetsPage() {
  const { budgets, isLoading, error, refetch } = useBudgets();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Derived totals dari data hook - dengan safety check
  const totalBudgeted = budgets.reduce((sum, b) => {
    const limitAmount = parseFloat((b as any).amount_limit || "0");
    return sum + (isNaN(limitAmount) ? 0 : limitAmount);
  }, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.usage?.spent || 0), 0);

  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
      <div className="max-w-5xl mx-auto">

        {/* Overview header */}
        <BudgetOverviewHeader
          totalBudgeted={totalBudgeted}
          totalSpent={totalSpent}
          onAddNew={() => setShowAddModal(true)}
        />

        {/* Section title */}
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="font-semibold text-gray-700">Budget Categories</h3>
        </div>

        {/* States */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading budgets...
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-red-50 text-red-500 rounded-xl px-4 py-3 text-sm">
            {error.message}
          </div>
        )}

        {!isLoading && !error && budgets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No budgets yet. Create your first budget!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
            >
              + New Budget
            </button>
          </div>
        )}

        {/* Budget grid */}
        {!isLoading && !error && budgets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.budget_id}
                budget={budget}
                onEdit={(b) => setEditingBudget(b)}
                onDeleted={refetch}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddBudgetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            refetch();
          }}
        />
      )}

      {editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onSuccess={() => {
            setEditingBudget(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}