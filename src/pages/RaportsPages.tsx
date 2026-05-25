// src/pages/ReportsPage.tsx
import React, { useState, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { useTransactions } from "../hooks/useTransaction";
import { useCategories } from "../hooks/useCategory";
import { useBudgets } from "../hooks/useBudget";

import ReportsSummaryCards from "../components/ui/ReportsSummaryCards";
import ReportsWeeklyFlow from "../components/ui/ReportsWeeklyFlow";
import ReportsExpenseSplit from "../components/ui/ReportsExpenseSplit";
import ReportsCategoryBreakdown from "../components/ui/ReportsCategoryBreakdown";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ReportsPage: React.FC = () => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  // ── Date range filter ────────────────────────────────
  const startDate = useMemo(
    () =>
      new Date(selectedYear, selectedMonth, 1).toISOString().split("T")[0],
    [selectedMonth, selectedYear]
  );
  const endDate = useMemo(
    () =>
      new Date(selectedYear, selectedMonth + 1, 0).toISOString().split("T")[0],
    [selectedMonth, selectedYear]
  );

  // ── Data hooks ───────────────────────────────────────
  const { transactions, summary, isLoading: txLoading } = useTransactions({
    start_date: startDate,
    end_date: endDate,
  });

  const { categories, isLoading: catLoading } = useCategories();

  const { budgets, isLoading: budgetLoading } = useBudgets();

  // ── Month navigation ─────────────────────────────────
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    const isCurrentMonth =
      selectedMonth === today.getMonth() &&
      selectedYear === today.getFullYear();
    if (isCurrentMonth) return; // don't go into the future

    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const isCurrentMonth =
    selectedMonth === today.getMonth() &&
    selectedYear === today.getFullYear();

  const isLoading = txLoading || catLoading || budgetLoading;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">Financial Performance</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Insights and visual analytics for your wealth
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2 bg-[var(--card)] border border-gray-200 rounded-xl px-3 py-2 shadow-sm w-fit">
          <Calendar size={15} className="text-[var(--text)]" />
          <button
            onClick={handlePrevMonth}
            className="p-0.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={15} className="text-[var(--text)] hover:text-[var(--text-opposite)]" />
          </button>
          <span className="text-sm font-semibold text-[var(--text)] min-w-[110px] text-center">
            {MONTHS[selectedMonth]} {selectedYear}
          </span>
          <button
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            className={`p-0.5 rounded-lg transition-colors ${
              isCurrentMonth
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            aria-label="Next month"
          >
            <ChevronRight size={15} className="text-[var(--text)] hover:text-[var(--text-opposite)]" />
          </button>
        </div>
      </div>

      {/* ── Summary Cards ────────────────────────────── */}
      <ReportsSummaryCards summary={summary} isLoading={txLoading} />

      {/* ── Charts Row ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Flow takes 2/3 */}
        <div className="lg:col-span-2">
          <ReportsWeeklyFlow
            transactions={transactions}
            isLoading={txLoading}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>

        {/* Expense Split takes 1/3 */}
        <div className="lg:col-span-1">
          <ReportsExpenseSplit
            transactions={transactions}
            categories={categories}
            isLoading={txLoading || catLoading}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>
      </div>

      {/* ── Category Breakdown Table ──────────────────── */}
      <ReportsCategoryBreakdown
        transactions={transactions}
        categories={categories}
        budgets={budgets}
        isLoading={isLoading}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </div>
  );
};

export default ReportsPage;