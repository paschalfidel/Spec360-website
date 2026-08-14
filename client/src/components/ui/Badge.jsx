import { cn } from "../../utils";

const variants = {
  primary:
    "bg-primary-500 text-white",

  success:
    "bg-green-600 text-white",

  warning:
    "bg-yellow-500 text-black",

  danger:
    "bg-red-600 text-white",

  outline:
    "border border-white/20 text-white bg-transparent",
};

export default function Badge({
  children,
  variant = "primary",
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}