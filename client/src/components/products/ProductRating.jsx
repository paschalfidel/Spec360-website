import { Star } from "lucide-react";
import { cn } from "../../utils";

export default function ProductRating({
  rating = 0,
  reviews = 0,
  showReviews = true,
  size = "sm",
  className,
}) {
  const normalizedRating = Math.min(
    5,
    Math.max(0, Number(rating) || 0)
  );

  const starSize = {
    xs: 12,
    sm: 14,
    md: 17,
  }[size] ?? 14;

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        className
      )}
      aria-label={`Rated ${normalizedRating} out of 5`}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const fillAmount = Math.min(
            1,
            Math.max(0, normalizedRating - star + 1)
          );

          return (
            <span
              key={star}
              className="relative inline-flex"
            >
              <Star
                size={starSize}
                className="fill-neutral-700 text-neutral-700"
              />

              {fillAmount > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: `${fillAmount * 100}%`,
                  }}
                >
                  <Star
                    size={starSize}
                    className="fill-yellow-400 text-yellow-400"
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>

      <span className="text-xs font-medium text-neutral-300">
        {normalizedRating.toFixed(1)}
      </span>

      {showReviews && (
        <span className="text-xs text-neutral-500">
          ({Number(reviews) || 0})
        </span>
      )}
    </div>
  );
}