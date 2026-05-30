"use client";
import {  useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTransactions, useCreateTransaction } from "../hooks/useTransaction";
import { useCategories } from "../hooks/useCategory";

import DashboardHeader from "../components/ui/DashboardHeader";
import TransactionModal from "../components/ui/TransactionModal";

import type { CreateTransactionPayload, UpdateTransactionPayload } from "../types/transaction";
import SummaryCards from "../components/ui/SummaryCards";
import BarChartCard from "../components/ui/BarChartCard";
import PieChartCard from "../components/ui/PieChartCard";
import RecentTransactions, { type RecentTransaction } from "../components/ui/RecentTransactions";
import { useNavigate } from "react-router-dom";

// ── Helpers ──────────────────────────────────────────────
const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (dateStr: string) => {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

// ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();
  const { transactions, summary, isLoading } = useTransactions();
  const { categories } = useCategories();
  const [showAddModal, setShowAddModal] = useState(false);
  const { createTransaction, isLoading: isCreating } = useCreateTransaction();

  // ── Map category_id → { nama, icon } ──
  const categoryMap = useMemo(() => {
    const map: Record<number, { nama: string; icon: string }> = {};
    categories.forEach((cat:any) => {
      map[cat.category_id] = { nama: cat.nama, icon: cat.icon };
    });
    return map;
  }, [categories]);

  // ── Savings Rate ──
  const savingsRate = useMemo(() => {
    if (!summary || summary.total_income === 0) return 0;
    return ((summary.total_income - summary.total_expense) / summary.total_income) * 100;
  }, [summary]);

  // ── Bar Chart Data ──
  const monthlyData = useMemo(() => {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const grouped: Record<number, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const month = new Date(t.transaction_date).getMonth();
      if (!grouped[month]) grouped[month] = { income: 0, expense: 0 };
      const amount = parseFloat(t.amount) || 0;
      if (t.type === "income") grouped[month].income += amount;
      else grouped[month].expense += amount;
    });

    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map((m) => ({ name: monthNames[m], income: grouped[m].income, expense: grouped[m].expense }));
  }, [transactions]);

  // ── Pie Chart Data ──
  const categoryData = useMemo(() => {
    const grouped: Record<number, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const amount = parseFloat(t.amount) || 0;
        if (!grouped[t.category_id]) grouped[t.category_id] = 0;
        grouped[t.category_id] += amount;
      });

    const total = Object.values(grouped).reduce((s, v) => s + v, 0);

    return Object.entries(grouped).map(([catId, amount]) => ({
      name: categoryMap[Number(catId)]?.nama || "Other",
      value: amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }));
  }, [transactions, categoryMap]);

  const totalExpense = useMemo(
    () => categoryData.reduce((s, item) => s + item.value, 0),
    [categoryData]
  );

  const navigate = useNavigate();

  const onViewAll = () => {
    navigate("/transactions");
  }

  // ── Recent Transactions ──
  const recentTransactions = useMemo((): RecentTransaction[] => {
    return [...transactions]
      .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
      .slice(0, 5)
      .map((t) => ({
        transaction_id: t.transaction_id,
        description: t.description,
        transaction_date: t.transaction_date,
        type: t.type as "income" | "expense",
        categoryName: categoryMap[t.category_id]?.nama || "Unknown",
        categoryIcon: categoryMap[t.category_id]?.icon || "💰",
        parsedAmount: parseFloat(t.amount) || 0,
      }));
  }, [transactions, categoryMap]);

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[var(--text-secondary)]">
        <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--blue-primary)] rounded-full animate-spin mb-4" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
   const handleCreate = async (payload: CreateTransactionPayload | UpdateTransactionPayload) => {
    await createTransaction(payload as CreateTransactionPayload);
    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 relative">

      <DashboardHeader
        userName={user?.name}
        onAddTransaction={() => setShowAddModal(true)}
      />
            {showAddModal && (
        <TransactionModal
          mode="add"
          onSave={handleCreate}
          onClose={() => setShowAddModal(false)}
          isSaving={isCreating}
        />
      )}

      <SummaryCards
        balance={summary?.balance || 0}
        totalIncome={summary?.total_income || 0}
        totalExpense={summary?.total_expense || 0}
        savingsRate={savingsRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <BarChartCard data={monthlyData} formatIDR={formatIDR} />
        <PieChartCard data={categoryData} totalExpense={totalExpense}/>
      </div>

      <RecentTransactions
        transactions={recentTransactions}
        formatIDR={formatIDR}
        formatDate={formatDate}
        onViewAll={onViewAll}
      />

    </div>
  );
}