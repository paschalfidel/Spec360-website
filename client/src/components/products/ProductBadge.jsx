import { cn } from "../../utils";

const variants = {
  new: "bg-primary-500/10 text-primary-400 border-primary-500/20",
  sale: "bg-red-500/10 text-red-400 border-red-500/20",
  featured:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  popular:
    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  soldOut:
    "bg-neutral-700/50 text-neutral-400 border-white/10",
  limited:
    "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const labels = {
  new: "New",
  sale: "Sale",
  featured: "Featured",
  popular: "Popular",
  soldOut: "Sold Out",
  limited: "Limited",
};

export default function ProductBadge({
  type = "new",
  children,
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1",
        "text-[11px] font-semibold uppercase tracking-wide",
        variants[type] ?? variants.new,
        className
      )}
    >
      {children ?? labels[type] ?? type}
    </span>
  );
}