// src/pages/Transactions.tsx
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useTransactions } from "../hooks/useTransaction";

export default function Transactions() {
  const { user, logout } = useAuth();
  const { transactions,summary, isLoading, error } = useTransactions();

  // data bentuknya: { data: Transaction[], summary: TransactionSummary }

  return (
    <div className="min-h-screen min-w-screen flex flex-col transition-colors duration-300">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <h1>Welcome {user?.name}</h1>

      {/* Loading state */}
      {isLoading && <p>Loading transactions...</p>}

      {/* Error state */}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {/* Summary */}
      {summary && (
        <div className="flex gap-4 p-4">
          <p>Total Income: {summary.total_income}</p>
          <p>Total Expense: {summary.total_expense}</p>
          <p>Balance: {summary.balance}</p>
        </div>
      )}

      {/* List */}
      {transactions.length === 0 && !isLoading ? (
        <p>Tidak ada transaksi.</p>
      ) : (
        <ul>
          {transactions.map((trx) => (
            <li key={trx.transaction_id}>
              {trx.transaction_id} - {trx.amount}
            </li>
          ))}
        </ul>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}