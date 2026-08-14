import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils";

const variants = {
  primary:
    "bg-primary-500 hover:bg-primary-600 text-white shadow-[0_0_30px_rgba(225,6,0,.25)]",

  secondary:
    "bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10",

  outline:
    "border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",

  ghost:
    "text-white hover:bg-white/5",

  danger:
    "bg-red-600 hover:bg-red-700 text-white",
};

const sizes = {
  sm: "h-10 px-4 text-sm",

  md: "h-12 px-6 text-base",

  lg: "h-14 px-8 text-lg",
};

const Button = forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
      type={props.type ?? "button"}
      aria-busy={loading}
      aria-disabled={disabled || loading}
        whileHover={{
          y: -2,
        }}
        whileTap={{
          scale: 0.98,
        }}
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Loading...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;