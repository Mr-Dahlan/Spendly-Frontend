// components/ui/AccountDetailsSection.tsx
import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";

export default function AccountDetailsSection() {
  const { currentUser, updateMe, isLoading, error, clearError } = useUser();

  const [name, setName] = useState(currentUser?.name ?? "");
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

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
    <div className="bg-[var(--card)] rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h2 className="text-base font-bold text-[var(--text)]">Account Details</h2>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Input Your Full Name"
            className="px-3.5 py-2.5 bg-[var(--bg-secondary)] text-[var(--text)] border-2 border-transparent rounded-lg text-sm outline-none focus:border-blue-500 transition-all placeholder:text-[var(--text-secondary)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Email Address</label>
          <input
            type="email"
            value={currentUser?.email ?? ""}
            readOnly
            title="Email tidak dapat diubah"
            className="px-3.5 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm text-gray-500 outline-none cursor-not-allowed opacity-70"
          />
        </div>
      </div>

      {/* Currency */}
      <div className="flex flex-col gap-1.5 mt-4">
        <label className="text-[11px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">Currency Preference</label>
        <div className="relative">
          <select
            disabled
            defaultValue="IDR"
            className="w-full px-3.5 py-2.5 bg-[var(--bg-secondary)] border border-transparent rounded-lg text-sm text-[var(--text)] outline-none appearance-none cursor-not-allowed pr-8"
          >
            <option value="IDR">IDR – Indonesia Rupiah</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
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