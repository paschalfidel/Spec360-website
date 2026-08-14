import { motion } from "framer-motion";
import {
  PackageSearch,
  Search,
  ShoppingCart,
  Wrench,
  WifiOff,
  Inbox,
} from "lucide-react";
import { Button } from "./";
import { cn } from "../../utils";

const icons = {
  default: Inbox,
  search: Search,
  products: PackageSearch,
  cart: ShoppingCart,
  repairs: Wrench,
  network: WifiOff,
};

export default function EmptyState({
  title = "Nothing here yet",
  description = "There is currently no data to display.",
  icon = "default",
  action,
  secondaryAction,
  className,
}) {
  const Icon = icons[icon] ?? Inbox;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "flex flex-col items-center justify-center",
        "rounded-3xl border border-white/10",
        "bg-neutral-900",
        "px-8 py-14",
        "text-center",
        className
      )}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-500/10">
        <Icon
          size={38}
          className="text-primary-500"
        />
      </div>

      <h2 className="text-2xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-3 max-w-lg text-neutral-400">
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {secondaryAction}

          {action}
        </div>
      )}
    </motion.section>
  );
}