import { useEffect, useState } from "react";

import { useCategories } from "../../hooks/useCategory";
import { useUpdateBudget } from "../../hooks/useBudget";
import { useLenisPrevent } from "../../hooks/useLenisPrevent";

import type {
  Budget,
  BudgetPeriod,
} from "../../types/budget";

import {
  formatInputNumber,
  parseInputNumber,
} from "../../utils/formatNumber";

import { formatCurrency } from "../../utils/formatCurrency";
import { getUserCurrency } from "../../utils/currency";

import TransactionDatePicker from "./TransactionDatePicker";
import CustomDropdown from "./CustomDropdown";

interface EditBudgetModalProps {
  budget: Budget;
  onClose: () => void;
  onSuccess: (budget: Budget) => void;
}

export default function EditBudgetModal({
  budget,
  onClose,
  onSuccess,
}: EditBudgetModalProps) {
  const { categories } = useCategories({
    type: "expense",
  });

  const {
    updateBudget,
    isLoading,
    error,
  } = useUpdateBudget();

  const currency = getUserCurrency();

  const [categoryId, setCategoryId] =
    useState<number>(budget.category_id || 0);

  const scrollRef = useLenisPrevent<HTMLDivElement>();
    

  const [amountLimit, setAmountLimit] =
    useState(
      formatInputNumber(
        budget.amount_limit || "",
      ),
    );

  const [period, setPeriod] =
    useState<BudgetPeriod>(
      budget.period || "monthly",
    );

  const [startDate, setStartDate] =
    useState(
      budget.start_date || "",
    );

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  useEffect(() => {
    setCategoryId(
      budget.category_id || 0,
    );

    setAmountLimit(
      formatInputNumber(
        budget.amount_limit || "",
      ),
    );

    setPeriod(
      budget.period || "monthly",
    );

    setStartDate(
      budget.start_date || "",
    );
  }, [budget]);

  const handleSubmit = async () => {
    if (
      !categoryId ||
      !amountLimit ||
      !startDate
    ) {
      return;
    }

    try {
      const response =
        await updateBudget({
          id: budget.budget_id,

          payload: {
            category_id: categoryId,

            amount_limit:
              parseInputNumber(
                amountLimit,
              ),

            period,

            start_date: startDate,
          },
        });

      onSuccess(response.data);

      onClose();
    } catch (err) {
      console.error(
        "Update budget failed:",
        err,
      );
    }
  };

  const amountLimitNum =
    parseInputNumber(amountLimit) || 1;

  const percent =
    budget.usage.amount_limit > 0
      ? Math.min(
          (budget.usage.spent /
            amountLimitNum) *
            100,
          100,
        )
      : 0;

  const isValid =
    categoryId &&
    amountLimit &&
    parseInputNumber(amountLimit) >
      0 &&
    startDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--card)] rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">
              Edit Budget
            </h2>

            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Update your spending limit
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wide">
            Amount Limit
          </label>

          <div className="flex items-center bg-[var(--bg)] border border-gray-200 rounded-2xl px-4 py-4 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition">
            <span className="text-gray-400 mr-3 font-semibold text-lg">
              {currency.symbol}
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={amountLimit}
              onChange={(e) =>
                setAmountLimit(
                  formatInputNumber(
                    e.target.value,
                  ),
                )
              }
              placeholder="0"
              className="flex-1 outline-none text-2xl font-bold text-[var(--text)] bg-[var(--card-secondary)] placeholder:text-[var(--text-secondary)]"
            />
          </div>
        </div>

        {/* Start Date & Period */}
        <div className="grid grid-cols-2 gap-3">
          {/* Start Date */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wide">
              Start Date
            </label>

            <button
              type="button"
              onClick={() =>
                setShowDatePicker(
                  true,
                )
              }
              className="
                w-full
                border
                border-gray-200
                rounded-2xl
                px-4
                py-3
                text-sm
                text-left
                bg-[var(--bg)]
                text-[var(--text)]
                hover:border-indigo-400
                transition
                h-[50px]
              "
            >
              {startDate
                ? new Date(
                    startDate,
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    },
                  )
                : "Select"}
            </button>
          </div>

          {/* Period */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wide">
              Period
            </label>

            <CustomDropdown
              value={period}
              onChange={(value) =>
                setPeriod(
                  value as BudgetPeriod,
                )
              }
              options={[
                {
                  label: "Weekly",
                  value: "weekly",
                },
                {
                  label: "Monthly",
                  value: "monthly",
                },
                {
                  label: "Yearly",
                  value: "yearly",
                },
              ]}
              className="h-[50px]"
            />
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text)] uppercase tracking-wide">
            Category
          </label>

          <div ref={scrollRef} className="grid grid-cols-3 gap-2 max-h-45 overflow-y-auto pr-1 custom-scrollbar">
            {categories.map((cat) => {
              const catId =
                (cat as any)
                  .category_id ||
                (cat as any).id;

              const catNama =
                (cat as any).nama ||
                (cat as any).name;

              const catIcon =
                (cat as any).icon ||
                "💰";

              const active =
                categoryId === catId;

              return (
                <button
                  key={catId}
                  onClick={() =>
                    setCategoryId(
                      catId,
                    )
                  }
                  className={`
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-1
                      px-2
                      py-2.5
                      rounded-xl
                      border
                      transition-all
                      duration-200
                      min-h-[82px]

                      ${
                        active
                          ? `
                            border-indigo-500
                            shadow-sm
                            bg-[var(--blue-light)]
                          `
                          : `
                            border-gray-200
                            hover:border-indigo-300
                            hover:bg-gray-400
                            hover:text-[var(--text)]
                          `
                      }
                    `}
                >
                  <span className="text-xl">
                    {catIcon}
                  </span>

                  <span
                    className={`
                      text-[11px]
                      w-full
                      font-medium
                      text-center
                      leading-tight
                      line-clamp-2
                      ${
                        active
                          ? "text-[var(--text-opposite)]"
                          : "hover:text-[var(--text-opposite)]"
                      }
                    `}
                  >
                    {catNama}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projected spending */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-[var(--text-secondary)]">
            <span>
              Current Spending
            </span>

            <span className="text-indigo-500 font-semibold">
              {Math.round(percent)}%
              used
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
              style={{
                width: `${percent}%`,
              }}
            />
          </div>

          <div className="text-xs text-[var(--text-secondary)]">
            {formatCurrency(
              budget.usage.spent,
            )}{" "}
            spent from{" "}
            {formatCurrency(
              amountLimitNum,
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">
            {error.message}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-[var(--text-secondary)] font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              !isValid ||
              isLoading
            }
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            {isLoading
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>

        {/* Date Picker */}
        {showDatePicker && (
          <TransactionDatePicker
            value={startDate}
            onChange={(date) =>
              setStartDate(date)
            }
            onClose={() =>
              setShowDatePicker(
                false,
              )
            }
          />
        )}
      </div>
    </div>
  );
}