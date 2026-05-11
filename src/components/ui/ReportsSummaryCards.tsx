// src/components/ui/ReportsSummaryCards.tsx
import React from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import type { TransactionSummary } from "../../types/transaction";

interface ReportsSummaryCardsProps {
  summary: TransactionSummary | null;
  isLoading: boolean;
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("IDR", "IDR");
}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="w-9 h-9 bg-gray-200 rounded-xl" />
    </div>
    <div className="h-7 bg-gray-200 rounded w-36 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-28" />
  </div>
);

const ReportsSummaryCards: React.FC<ReportsSummaryCardsProps> = ({
  summary,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const totalIncome = summary?.total_income ?? 0;
  const totalExpense = summary?.total_expense ?? 0;
  const balance = summary?.balance ?? 0;

  const cards = [
    {
      label: "TOTAL INCOME",
      value: formatIDR(totalIncome),
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      valueColor: "text-gray-800",
      badge: (
        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
        </span>
      ),
    },
    {
      label: "TOTAL EXPENSE",
      value: formatIDR(totalExpense),
      icon: TrendingDown,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      valueColor: "text-gray-800",
      badge: (
        <span className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
        </span>
      ),
    },
    {
      label: "NET SAVINGS",
      value: formatIDR(balance),
      icon: Wallet,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
      valueColor: balance >= 0 ? "text-gray-800" : "text-red-500",
      badge: (
        <span className="text-xs text-gray-400 font-medium mt-1 block">
          {balance >= 0 ? "✓ On track for goal" : "⚠ Below target"}
        </span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, iconBg, iconColor, valueColor, badge }) => (
        <div
          key={label}
          className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              {label}
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
              <Icon size={18} className={iconColor} />
            </div>
          </div>
          <p className={`text-xl font-bold ${valueColor} leading-tight`}>{value}</p>
          {badge}
        </div>
      ))}
    </div>
  );
};

export default ReportsSummaryCards;