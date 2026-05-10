interface SummaryCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
  formatIDR: (value: number) => string;
}

interface SummaryCardProps {
  label: string;
  value: string;
  colorClass?: string;
  delay?: string;
}

function SummaryCard({ label, value, colorClass = "text-[var(--text)]", delay = "0.5s" }: SummaryCardProps) {
  return (
    <div
      className="bg-[var(--card)] p-5 sm:p-6 rounded-2xl shadow-sm border border-[var(--border)]/30"
      style={{ animation: `pulse ${delay} ease-out` }}
    >
      <span className="block text-[11px] font-semibold text-[var(--text-secondary)] tracking-wider uppercase mb-2">
        {label}
      </span>
      <span className={`block text-lg font-bold truncate ${colorClass}`}>{value}</span>
    </div>
  );
}

export default function SummaryCards({
  balance,
  totalIncome,
  totalExpense,
  savingsRate,
  formatIDR,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <SummaryCard
        label="TOTAL BALANCE"
        value={`IDR ${formatIDR(balance)}`}
        delay="0.5s"
      />
      <SummaryCard
        label="MONTHLY INCOME"
        value={`IDR ${formatIDR(totalIncome)}`}
        colorClass="text-[var(--green-primary)]"
        delay="0.6s"
      />
      <SummaryCard
        label="MONTHLY EXPENSES"
        value={`IDR ${formatIDR(totalExpense)}`}
        delay="0.7s"
      />
      <SummaryCard
        label="SAVINGS RATE"
        value={`${savingsRate.toFixed(1)}%`}
        colorClass="text-[var(--blue-primary)]"
        delay="0.8s"
      />
    </div>
  );
}