// src/components/modal/TransactionModal.tsx

import { useEffect, useState } from "react";

import { useCategories } from "../../hooks/useCategory";
import { CalendarDays } from "lucide-react";
import { getUserCurrency } from "../../utils/currency";

import type {
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from "../../types/transaction";

import { formatInputNumber, parseInputNumber } from "../../utils/formatNumber";

import TransactionDatePicker from "./TransactionDatePicker";
import CreateCategoryModal from "./CreateCategoryModal";

import CustomDropdown from "../ui/CustomDropdown";

interface TransactionModalProps {
  mode: "add" | "edit";

  initialData?: Transaction | null;

  onSave: (
    payload: CreateTransactionPayload | UpdateTransactionPayload,
  ) => Promise<void>;

  onClose: () => void;

  isSaving: boolean;
}

export default function TransactionModal({
  mode,
  initialData,
  onSave,
  onClose,
  isSaving,
}: TransactionModalProps) {
  const [type, setType] = useState<"expense" | "income">(
    (initialData?.type as "expense" | "income") ?? "expense",
  );

  const [amount, setAmount] = useState(
    initialData?.amount ? String(parseFloat(initialData.amount)) : "",
  );

  const [categoryId, setCategoryId] = useState<number | "">(
    initialData?.category_id ?? "",
  );

  const [date, setDate] = useState(initialData?.transaction_date ?? "");

  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showCreateCategory, setShowCreateCategory] = useState(false);

  const { categories } = useCategories({
    type,
  });
  const currency = getUserCurrency();

  useEffect(() => {
    if (!initialData) {
      setCategoryId("");
    }
  }, [type, initialData]);

  const formatDisplayDate = (value: string) => {
    if (!value) return "";

    const [y, m, d] = value.split("-");

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  };

  const isFormValid = !!amount && !!categoryId && !!date;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    await onSave({
      type,

      amount: parseInputNumber(amount).toString(),

      category_id: categoryId as number,

      transaction_date: date,

      description: description || "",
    });
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          backdrop-blur-sm
        "
        onClick={onClose}
      >
        {/* Modal Card */}
        <div
          className="
            w-full
            max-w-md
            mx-4
            rounded-3xl
            bg-[var(--card)]
            p-6
            shadow-2xl
            text-[var(--text)]
            animate-[modalIn_0.2s_ease-out]
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {mode === "add" ? "Add Transaction" : "Edit Transaction"}
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Manage your transaction
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-[var(--bg-secondary)]
                transition-all
                hover:scale-105
              "
            >
              ✕
            </button>
          </div>

          {/* Type Toggle */}
          <div
            className="
              mb-5
              flex
              rounded-2xl
              bg-[var(--bg-secondary)]
              p-1
            "
          >
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`
                  flex-1
                  rounded-xl
                  py-2.5
                  text-sm
                  font-semibold
                  capitalize
                  transition-all
                  ${
                    type === t
                      ? t === "income"
                        ? "bg-indigo-600 text-white"
                        : "bg-[var(--red-primary)] text-white"
                      : "text-[var(--text-secondary)]"
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold uppercase">
              Transaction Amount
            </label>

            <div
              className="
                flex
                items-center
                rounded-2xl
                border
                border-gray-200
                bg-[var(--bg-secondary)]
                px-4
                py-3
              "
            >
              <span className="mr-2 font-semibold text-2xl">
                {currency.symbol}
              </span>

              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(formatInputNumber(e.target.value))}
                placeholder="0"
                className="
                  flex-1
                  bg-transparent
                  text-2xl
                  font-bold
                  outline-none
                "
              />
            </div>
          </div>

          {/* Category + Date */}
          <div className="mb-4 flex items-end gap-3">
            {/* Category */}
            <div className="flex-1">
              <label className="mb-2 block text-xs font-semibold uppercase">
                Category
              </label>

              <CustomDropdown
                value={categoryId}
                placeholder="Select category"
                onChange={(value) => setCategoryId(Number(value))}
                onCreateNew={() => setShowCreateCategory(true)}
                createLabel="Add New Category"
                options={categories.map((cat) => ({
                  value: cat.category_id,
                  label: cat.nama,
                  icon: cat.icon ? <span>{cat.icon}</span> : undefined,
                }))}
              />
            </div>

            {/* Date */}
            <div className="flex flex-col items-center">
              <label className="mb-2 block text-xs font-semibold uppercase">
                Date
              </label>

              <button
                type="button"
                onClick={() => setShowDatePicker(true)}
                className={`
      flex
      items-center
      justify-center
      rounded-full
      border
      border-gray-200
      bg-[var(--bg-secondary)]
      text-[var(--text)]
      transition-all
      hover:scale-105
      hover:border-gray-300
      hover:bg-gray-500
      hover:text-black
      dark:text-gray-600
      dark:hover:text-white
      ${date ? "h-12 px-3 text-xs font-semibold gap-1.5" : "h-12 w-12"}
    `}
              >
                <CalendarDays size={16} />
                {date && <span >{formatDisplayDate(date)}</span>}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold uppercase">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-gray-200
                bg-[var(--bg-secondary)]
                px-4
                py-3
                text-sm
                outline-none
              "
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                rounded-2xl
                border
                border-gray-200
                py-3
                text-sm
                font-semibold
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSaving}
              className={`
                flex-1
                rounded-2xl
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                disabled:opacity-50
                ${
                  type === "income"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-[var(--red-primary)] hover:bg-red-700"
                }
              `}
            >
              {isSaving ? "Saving..." : `Save ${type}`}
            </button>
          </div>
        </div>

        {/* Animation */}
        <style>{`
          @keyframes modalIn {
            from {
              opacity: 0;
              transform: scale(0.96)
                translateY(12px);
            }

            to {
              opacity: 1;
              transform: scale(1)
                translateY(0);
            }
          }
        `}</style>
      </div>

      {/* Date Picker */}
      {showDatePicker && (
        <TransactionDatePicker
          value={date}
          onChange={(value) => setDate(value)}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* Create Category Modal */}
      {showCreateCategory && (
        <CreateCategoryModal
          type={type}
          onClose={() => setShowCreateCategory(false)}
          onCreated={(newCategoryId) => {
            setCategoryId(newCategoryId);

            setShowCreateCategory(false);
          }}
        />
      )}
    </>
  );
}
