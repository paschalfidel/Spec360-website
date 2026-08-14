import { Search, X } from "lucide-react";

import { Input } from "../ui";

export default function SearchFilter({
  value = "",
  onChange,
  onClear,
  placeholder = "Search products...",
}) {
  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        placeholder={placeholder}
        leftIcon={Search}
        aria-label="Search products"
        className="pr-11"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear product search"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}