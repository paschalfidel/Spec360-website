import { ChevronDown } from "lucide-react";

export default function SortSelect({
  value = "featured",
  options = [],
  onChange,
}) {
  return (
    <div className="relative min-w-[190px]">
      <select
        value={value}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        aria-label="Sort products"
        className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-neutral-900 px-4 pr-10 text-sm font-medium text-neutral-200 outline-none transition-colors focus:border-primary-500/50"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-neutral-900 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={17}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
      />
    </div>
  );
}