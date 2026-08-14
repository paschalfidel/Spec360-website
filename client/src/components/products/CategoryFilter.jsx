import { motion } from "framer-motion";

export default function CategoryFilter({
  categories = [],
  value = "all",
  onChange,
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      role="tablist"
      aria-label="Product categories"
    >
      {categories.map((category) => {
        const active =
          value === category.value;

        return (
          <button
            key={category.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() =>
              onChange?.(category.value)
            }
            className="relative isolate shrink-0 overflow-hidden rounded-full px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            {active && (
              <motion.span
                layoutId="spec360-product-category"
                className="absolute inset-0 -z-10 rounded-full bg-primary-500"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            {!active && (
              <span className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-neutral-950/30 transition-colors group-hover:border-white/20" />
            )}

            <span
              className={
                active
                  ? "text-white"
                  : "text-neutral-400"
              }
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}