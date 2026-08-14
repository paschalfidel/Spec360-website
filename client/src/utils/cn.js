import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely.
 *
 * Example:
 * cn("p-4", isActive && "bg-red-500")
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;