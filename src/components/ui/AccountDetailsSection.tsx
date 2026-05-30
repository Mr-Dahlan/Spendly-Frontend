// components/ui/AccountDetailsSection.tsx
import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";
import CustomDropdown from "../ui/CustomDropdown";

import { currencies } from "../../store/currencies";
import { getUserCurrency, setUserCurrency } from "../../utils/currency";

export default function AccountDetailsSection() {
  const { currentUser, updateMe, isLoading, error, clearError } = useUser();
  const { user } = useAuth();
  const authUser = user;
  const [name, setName] = useState(currentUser?.name ?? authUser?.name ?? "");
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const currentCurrency = getUserCurrency();

  useEffect(() => {
    if (currentUser?.name) setName(currentUser.name);
  }, [currentUser]);

  const handleSave = async () => {
    if (!name.trim()) {
      setLocalError("Nama tidak boleh kosong.");
      return;
    }
    setLocalError(null);
    clearError();
    setSuccess(false);
    try {
      await updateMe({ name: name.trim() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // error sudah di-handle context
    }
  };

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-gray-100 shadow-[var(--boxShadow)] p-6 mb-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-[var(--text)]">
          Account Details
        </h2>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Input Your Full Name"
            className="px-3.5 py-2.5 bg-[var(--bg-secondary)] text-[var(--text)] border-2 border-transparent rounded-lg text-sm outline-none focus:border-blue-500 transition-all placeholder:text-[var(--text-secondary)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
            Email Address
          </label>
          <input
            type="email"
            value={currentUser?.email ?? authUser?.email ?? ""}
            readOnly
            title="Email tidak dapat diubah"
            className="px-3.5 py-2.5 bg-[var(--bg-secondary)] border border-transparent rounded-lg text-sm text-[var(--text)] outline-none cursor-not-allowed opacity-70"
          />
        </div>
      </div>

      {/* Currency */}
      <div className="flex flex-col gap-1.5 mt-4 md:w-1/2 sm:w-full">
        <label className="text-[11px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">
          Currency Preference
        </label>
        <div className="relative">
          <div className="space-y-2">

            <CustomDropdown
              value={currentCurrency.code}
              placeholder="Select Currency"
              onChange={(value) => {
                const selected = currencies.find((c) => c.code === value);

                if (selected) {
                  setUserCurrency(selected);

                  window.location.reload();
                }
              }}
              options={currencies.map((currency) => ({
                value: currency.code,

                label: `${currency.code} (${currency.symbol})`,

                icon: (
                  <span className="text-sm font-bold">{currency.symbol}</span>
                ),
              }))}
            />
          </div>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
          </svg>
        </div>
      </div>

      {/* Feedback */}
      {(error || localError) && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {localError ?? error}
        </p>
      )}
      {success && (
        <p className="mt-3 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
          ✓ Profil berhasil diperbarui.
        </p>
      )}

      <div className="flex justify-end mt-5">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
