import { useState } from "react";
import { useCreateCategory } from "../../hooks/useCategory";
import { useUser } from "../../hooks/useUser";

interface Props {
  type: "expense" | "income";
  onClose: () => void;
  onCreated?: (categoryId: number) => void;
}

const EMOJIS = [
  "🍔",
  "💰",
  "🛒",
  "🚗",
  "🏥",
  "🎮",
  "🎵",
  "📚",
  "✈️",
  "🏠",
  "💡",
  "🎁",
];

export default function CreateCategoryModal({
  type,
  onClose,
  onCreated,
}: Props) {
  const { createCategory, isLoading } = useCreateCategory();
  const { currentUser } = useUser();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🛒");

  const handleEmojiInput = (value: string) => {
    const chars = [...value];

    if (chars.length === 0) {
      setIcon("");
      return;
    }

    setIcon(chars[0]);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !currentUser) return;

    try {
      const newCategory = await createCategory({
        user_id: currentUser.user_id,
        nama: name,
        type,
        icon,
      });

      onCreated?.(newCategory.category_id);

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[var(--card)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[var(--text)]">
            Create Category
          </h2>

          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Add your own custom transaction category.
          </p>
        </div>

        {/* Category Name */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
            Category Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g Transport"
            className="w-full rounded-2xl bg-[var(--bg-secondary)] px-4 py-3 border border-transparent outline-none focus:border-indigo-400 transition-all"
          />
        </div>

        {/* Category Icon */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
            Category Icon
          </label>

          {/* Preview + Input */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-gray-200 flex items-center justify-center text-2xl">
              {icon}
            </div>

            <input
              type="text"
              value={icon}
              onChange={(e) => handleEmojiInput(e.target.value)}
              placeholder="😀"
              className="flex-1 rounded-2xl bg-[var(--bg-secondary)] px-4 py-3 border border-transparent outline-none focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Preset Emojis */}
          <div className="grid grid-cols-6 gap-2">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={`h-12 rounded-2xl text-xl transition-all
                  ${
                    icon === emoji
                      ? "bg-indigo-500 text-white shadow-md"
                      : "bg-[var(--bg-secondary)] hover:bg-gray-200"
                  }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <p className="text-xs text-[var(--text-secondary)] mt-3">
            You can also paste emoji from your keyboard.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !name.trim()}
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-40"
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}