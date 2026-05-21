import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  ChevronDown,
  Check,
  Plus,
} from "lucide-react";

import { useLenisPrevent } from '../../hooks/useLenisPrevent';

interface DropdownOption {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

interface CustomDropdownProps {
  options: DropdownOption[];

  value: string | number | "";

  placeholder?: string;

  onChange: (value: string | number) => void;

  className?: string;

  onCreateNew?: () => void;

  createLabel?: string;
}

export default function CustomDropdown({
  options,
  value,
  placeholder = "Select option",
  onChange,
  className = "",
  onCreateNew,
  createLabel = "Add New",
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const scrollRef = useLenisPrevent<HTMLDivElement>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) => option.value === value,
  );

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full ${className}`}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
        className="
          w-full
          bg-[var(--bg-secondary)]
          border
          border-gray-200
          rounded-2xl
          px-3
          py-3
          text-sm
          flex
          items-center
          justify-between
          transition-all
          hover:border-indigo-400
          focus:border-indigo-400
          focus:ring-2
          focus:ring-indigo-100
        "
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon}

          <span
            className={
              selectedOption
                ? "text-[var(--text)]"
                : "text-[var(--text-secondary)]"
            }
          >
            {selectedOption?.label ||
              placeholder}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`transition duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute
            top-full
            left-0
            z-50
            mt-2
            w-full
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-[var(--card)]
            shadow-2xl
            animate-[dropdownIn_0.18s_ease]
          "
        >
          <div ref={scrollRef} className="max-h-60 overflow-y-auto p-2">
            {/* Add New */}
            {onCreateNew && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onCreateNew();
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-indigo-600
                    hover:bg-indigo-50
                    transition-all
                    mb-2
                  "
                >
                  <Plus size={16} />

                  <span>
                    {createLabel}
                  </span>
                </button>

                <div className="h-px bg-gray-200 mb-2" />
              </>
            )}

            {/* Options */}
            {options.map((option) => {
              const active =
                option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    transition-all
                    ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "text-[var(--text)] hover:bg-[var(--bg-secondary)]"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}

                    <span>
                      {option.label}
                    </span>
                  </div>

                  {active && (
                    <Check
                      size={16}
                      className="flex-shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}