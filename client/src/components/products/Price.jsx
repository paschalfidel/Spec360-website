import { cn } from "../../utils";

export default function Price({
  amount,
  compareAt,
  currency = "NGN",
  locale = "en-NG",
  size = "md",
  className,
  showCurrency = true,
}) {
  const numericAmount = Number(amount) || 0;
  const numericCompareAt =
    compareAt !== undefined &&
    compareAt !== null &&
    Number(compareAt) > numericAmount
      ? Number(compareAt)
      : null;

  const formatter = new Intl.NumberFormat(locale, {
    style: showCurrency ? "currency" : "decimal",
    currency,
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  });

  const sizes = {
    sm: {
      current: "text-base",
      compare: "text-xs",
    },
    md: {
      current: "text-xl",
      compare: "text-sm",
    },
    lg: {
      current: "text-2xl",
      compare: "text-sm",
    },
    xl: {
      current: "text-3xl",
      compare: "text-base",
    },
  };

  const selectedSize = sizes[size] ?? sizes.md;

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-2",
        className
      )}
    >
      <span
        className={cn(
          "font-heading font-bold tracking-tight text-white",
          selectedSize.current
        )}
      >
        {formatter.format(numericAmount)}
      </span>

      {numericCompareAt && (
        <span
          className={cn(
            "text-neutral-500 line-through",
            selectedSize.compare
          )}
        >
          {formatter.format(numericCompareAt)}
        </span>
      )}
    </div>
  );
}