import { cn } from "../../utils";

export default function Container({
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "mx-auto w-[92%] max-w-screen-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}