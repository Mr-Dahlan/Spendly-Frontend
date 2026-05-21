// src/components/transaction/TransactionFilterBar.tsx

import {
  CalendarDays,
  ChevronDown,
  Tags,
  ArrowUpDown,
} from "lucide-react";

import { useCategories } from "../../hooks/useCategory";

import CustomDropdown from "../ui/CustomDropdown";

interface Filters {
  dateRange: "7" | "30" | "90" | "all";
  type: "" | "income" | "expense";
  categoryId: number | "";
}

interface TransactionFilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const DATE_RANGE_LABELS: Record<
  Filters["dateRange"],
  string
> = {
  "7": "Last 7 Days",
  "30": "Last 30 Days",
  "90": "Last 90 Days",
  all: "All Time",
};

export default function TransactionFilterBar({
  filters,
  onChange,
}: TransactionFilterBarProps) {
  const { categories } = useCategories();

  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-3
        mb-6
      "
    >
      {/* Date Range */}
      <div
        className="
          bg-[var(--card)]
          border
          border-gray-200
          rounded-2xl
          p-4
          shadow-[var(--boxShadow)]
        "
      >
        <label
          className="
            block
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-[var(--text-secondary)]
            mb-2
          "
        >
          Date Range
        </label>

        <CustomDropdown
          value={filters.dateRange}
          placeholder="Select Range"
          onChange={(value) =>
            onChange({
              ...filters,
              dateRange:
                value as Filters["dateRange"],
            })
          }
          options={Object.entries(
            DATE_RANGE_LABELS,
          ).map(([value, label]) => ({
            value,
            label,
            icon: (
              <CalendarDays
                size={16}
                className="text-indigo-500"
              />
            ),
          }))}
        />
      </div>

      {/* Type */}
      <div
        className="
          bg-[var(--card)]
          border
          border-gray-200
          rounded-2xl
          p-4
          shadow-[var(--boxShadow)]
        "
      >
        <label
          className="
            block
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-[var(--text-secondary)]
            mb-2
          "
        >
          Type
        </label>

        <CustomDropdown
          value={filters.type}
          placeholder="All Types"
          onChange={(value) =>
            onChange({
              ...filters,
              type:
                value as Filters["type"],
            })
          }
          options={[
            {
              value: "",
              label: "All Types",
              icon: (
                <ArrowUpDown
                  size={16}
                  className="text-indigo-500"
                />
              ),
            },
            {
              value: "income",
              label: "Income",
              icon: (
                <span className="text-green-500">
                  ↗
                </span>
              ),
            },
            {
              value: "expense",
              label: "Expense",
              icon: (
                <span className="text-red-500">
                  ↘
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Category */}
      <div
        className="
          bg-[var(--card)]
          border
          border-gray-200
          rounded-2xl
          p-4
          shadow-[var(--boxShadow)]
        "
      >
        <label
          className="
            block
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-[var(--text-secondary)]
            mb-2
          "
        >
          Category
        </label>

        <CustomDropdown
          value={filters.categoryId}
          placeholder="All Categories"
          onChange={(value) =>
            onChange({
              ...filters,
              categoryId: value
                ? Number(value)
                : "",
            })
          }
          options={[
            {
              value: "",
              label: "All Categories",
              icon: (
                <Tags
                  size={16}
                  className="text-indigo-500"
                />
              ),
            },

            ...categories.map((cat) => ({
              value: cat.category_id,

              label: cat.nama,

              icon: cat.icon ? (
                <span>{cat.icon}</span>
              ) : (
                <ChevronDown size={16} />
              ),
            })),
          ]}
        />
      </div>
    </div>
  );
}