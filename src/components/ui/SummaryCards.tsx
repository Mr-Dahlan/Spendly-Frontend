// src/components/SummaryCards.tsx

import type { LucideIcon } from "lucide-react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

interface SummaryCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
}

interface SummaryCardProps {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
  Icon: LucideIcon;
  iconColor: string;
  delay?: string;
}

function SummaryCard({
  label,
  value,
  sub,
  valueColor = "text-[var(--text)]",
  Icon,
  iconColor,
  delay = "0s",
}: SummaryCardProps) {
  return (
    <div
      className="relative bg-[var(--card)] hover:scale-105 rounded-2xl border border-[var(--border)]/30 shadow-[var(--boxShadow)] p-4 flex flex-col gap-1 overflow-hidden"
      style={{ animationDelay: delay }}
    >
      {/* accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
      />

      <Icon size={18} className={`${iconColor} mt-1`} strokeWidth={1.75} />

      <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text-secondary)] mt-1">
        {label}
      </span>

      <span className={`text-[15px] font-semibold truncate ${valueColor}`}>
        {value}
      </span>

      {sub && (
        <span className="text-[11px] text-[var(--text-secondary)]">{sub}</span>
      )}
    </div>
  );
}

export default function SummaryCards({
  balance,
  totalIncome,
  totalExpense,
  savingsRate,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
      <SummaryCard
        label="Total Balance"
        value={formatCurrency(balance)}
        sub="Per hari ini"
        valueColor="text-[var(--text)]"
        Icon={Wallet}
        iconColor="text-blue-500"
        delay="0.1s"
      />
      <SummaryCard
        label="Monthly Income"
        value={formatCurrency(totalIncome)}
        sub="Bulan ini"
        valueColor="text-[var(--green-primary)]"
        Icon={TrendingUp}
        iconColor="text-green-600"
        delay="0.2s"
      />
      <SummaryCard
        label="Monthly Expenses"
        value={formatCurrency(totalExpense)}
        sub="Bulan ini"
        valueColor="text-[var(--red-primary)]"
        Icon={TrendingDown}
        iconColor="text-[var(--red-primary)]"
        delay="0.3s"
      />
      <SummaryCard
        label="Savings Rate"
        value={`${savingsRate.toFixed(1)}%`}
        sub="Dari income"
        valueColor="text-[var(--blue-primary)]"
        Icon={PiggyBank}
        iconColor="text-purple-500"
        delay="0.4s"
      />
    </div>
  );
}