// src/components/ui/DropdownItem.tsx

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function DropdownItem({
  children,
  onClick,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        rounded-lg
        px-3
        py-2
        text-left
        text-sm
        text-zinc-200
        transition
        hover:bg-zinc-800
      "
    >
      {children}
    </button>
  );
}