import { forwardRef, useId } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "../../utils";

const Input = forwardRef(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      error,
      helperText,
      success,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className,
      required = false,
      disabled = false,
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const describedBy = [
      helperText ? `${inputId}-helper` : null,
      error ? `${inputId}-error` : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={cn(
          "flex flex-col gap-2",
          fullWidth && "w-full"
        )}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="font-medium text-sm text-neutral-200"
          >
            {label}

            {required && (
              <span className="ml-1 text-primary-500">*</span>
            )}
          </label>
        )}

        <div className="relative">

          {LeftIcon && (
            <LeftIcon
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy || undefined}
            className={cn(
              "h-12 w-full rounded-xl",
              "border bg-neutral-900",
              "text-white",
              "placeholder:text-neutral-500",
              "transition-all duration-300",
              "outline-none",
              "focus:ring-2 focus:ring-primary-500",
              "disabled:cursor-not-allowed disabled:opacity-60",

              LeftIcon ? "pl-11" : "pl-4",
              RightIcon || success || error ? "pr-11" : "pr-4",

              error
                ? "border-danger focus:ring-danger/30"
                : success
                ? "border-success focus:ring-success/30"
                : "border-white/10 hover:border-white/20",

              className
            )}
            {...props}
          />

          {success && !error && (
            <CheckCircle
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-success"
            />
          )}

          {error && (
            <AlertCircle
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-danger"
            />
          )}

          {RightIcon && !success && !error && (
            <RightIcon
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          )}

        </div>

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-neutral-400"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-danger"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;