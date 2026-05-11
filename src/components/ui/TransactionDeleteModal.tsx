import type { Transaction } from "../../types/transaction";

interface TransactionDeleteModalProps {
  transaction: Transaction;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isDeleting: boolean;
}

export default function TransactionDeleteModal({ transaction, onConfirm, onClose, isDeleting }: TransactionDeleteModalProps) {
  const amount = parseFloat(transaction.amount);
  const formatted = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2 }).format(amount);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-[deleteModalIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
        </div>

        {/* Title & Message */}
        <div className="text-center mb-5">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Delete Transaction</h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this transaction?<br />
            This action cannot be undone.
          </p>
        </div>

        {/* Transaction Preview */}
        <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg flex-shrink-0">
            💳
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{transaction.description}</p>
            <p className="text-xs text-gray-400">{transaction.transaction_date}</p>
          </div>
          <span className="text-sm font-bold text-red-500 flex-shrink-0">
            -{formatted.startsWith("-") ? formatted.slice(1) : formatted}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-red-100 disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes deleteModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
}