import { useState, useMemo, useCallback } from "react";
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "../hooks/useTransaction";
import { useCategories } from "../hooks/useCategory";
import type { Transaction, CreateTransactionPayload, UpdateTransactionPayload } from "../types/transaction";

import TransactionFilterBar from "../components/ui/TransactionFilterBar";
import TransactionTable from "../components/ui/TransactionTable";
import TransactionModal from "../components/ui/TransactionModal";
import TransactionDeleteModal from "../components/ui/TransactionDeleteModal";

// ── Types ──────────────────────────────────────────────────
interface Filters {
  dateRange: "7" | "30" | "90" | "all";
  type: "" | "income" | "expense";
  categoryId: number | "";
}

const PER_PAGE = 5;

// ──────────────────────────────────────────────────────────

export default function TransactionsPages() {
  // ── Filter & pagination state ──
  const [filters, setFilters] = useState<Filters>({ dateRange: "30", type: "", categoryId: "" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Modal state ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  // ── Hooks ──
  const { transactions, isLoading, refetch } = useTransactions();
  const { categories } = useCategories();
  const { createTransaction, isLoading: isCreating } = useCreateTransaction();
  const { updateTransaction, isLoading: isUpdating } = useUpdateTransaction();
  const { deleteTransaction, isLoading: isDeleting } = useDeleteTransaction();

  // ── Category map untuk tabel ──
  const categoryMap = useMemo(() => {
    const map: Record<number, { nama: string; icon: string }> = {};
    categories.forEach((c) => { map[c.category_id] = { nama: c.nama, icon: c.icon ?? "" }; });
    return map;
  }, [categories]);

  // ── Filter + search di client side ──
  const filtered = useMemo(() => {
    const now = Date.now();
    const dayMs = 86400000;
    const cutoff = filters.dateRange === "all" ? 0
      : now - parseInt(filters.dateRange) * dayMs;

    return transactions.filter((t) => {
      if (filters.dateRange !== "all" && new Date(t.transaction_date).getTime() < cutoff) return false;
      if (filters.type && t.type !== filters.type) return false;
      if (filters.categoryId && t.category_id !== filters.categoryId) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, filters, search]);

  // ── Pagination ──
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, currentPage]);

  // Reset ke page 1 kalau filter/search berubah
  const handleFilterChange = useCallback((f: Filters) => {
    setFilters(f);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setCurrentPage(1);
  }, []);

  // ── CRUD handlers ──
const handleCreate = async (payload: CreateTransactionPayload | UpdateTransactionPayload) => {
  await createTransaction(payload as CreateTransactionPayload);
  setShowAddModal(false);
  refetch();
};

const handleUpdate = async (payload: CreateTransactionPayload | UpdateTransactionPayload) => {
  if (!editTarget) return;
  await updateTransaction({ 
    id: editTarget.transaction_id, 
    payload: payload as UpdateTransactionPayload 
  });
  setEditTarget(null);
  refetch();
};

 const handleDelete = async () => {
  if (!deleteTarget) return;
  await deleteTransaction(deleteTarget.transaction_id);
  setDeleteTarget(null);
  refetch();
};

  // ──────────────────────────────────────────────────────────

return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">Transactions</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage and track your financial flow</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex mt-4 items-center gap-2 bg-[var(--blue-primary)] hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:-translate-y-0.5 transform"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Transaction
        </button>
      </div>

      {/* ── Search ── */}
      <div className="mb-4 ">
        <div className="relative ">
          <svg className="w-4 h-4 text-[var(--text-secondary)]  absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--blue-primary)] focus:ring-2 focus:ring-[var(--blue-primary)]/20 transition-all shadow-[var(--boxShadow)]"
          />
        </div>
      </div>

      <TransactionFilterBar filters={filters} onChange={handleFilterChange} />

      {/* ── Table ── */}
      <TransactionTable
        transactions={paginated}
        categoryMap={categoryMap}
        isLoading={isLoading}
        currentPage={currentPage}
        totalEntries={filtered.length}
        perPage={PER_PAGE}
        onPageChange={setCurrentPage}
        onEdit={(t) => setEditTarget(t)}
        onDelete={(t) => setDeleteTarget(t)}
      />

      {/* ── Modal: Add Transaction ── */}
      {showAddModal && (
        <TransactionModal
          mode="add"
          onSave={handleCreate}
          onClose={() => setShowAddModal(false)}
          isSaving={isCreating}
        />
      )}

      {/* ── Modal: Edit Transaction ── */}
      {editTarget && (
        <TransactionModal
          mode="edit"
          initialData={editTarget}
          onSave={handleUpdate}
          onClose={() => setEditTarget(null)}
          isSaving={isUpdating}
        />
      )}

      {/* ── Modal: Delete Confirmation ── */}
      {deleteTarget && (
        <TransactionDeleteModal
          transaction={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}