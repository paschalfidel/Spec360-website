import { cn } from "../../utils";

export function Skeleton({
  className,
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-xl bg-neutral-800",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
      <Skeleton className="aspect-square w-full rounded-2xl" />

      <Skeleton className="mt-5 h-6 w-3/4" />

      <Skeleton className="mt-3 h-4 w-full" />

      <Skeleton className="mt-2 h-4 w-2/3" />

      <Skeleton className="mt-6 h-12 w-full rounded-xl" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="grid gap-10 py-24 lg:grid-cols-2 lg:items-center">

      <div>

        <Skeleton className="h-8 w-40 rounded-full" />

        <Skeleton className="mt-8 h-16 w-full" />

        <Skeleton className="mt-4 h-16 w-4/5" />

        <Skeleton className="mt-8 h-5 w-full" />

        <Skeleton className="mt-3 h-5 w-5/6" />

        <div className="mt-10 flex gap-4">

          <Skeleton className="h-12 w-40 rounded-xl" />

          <Skeleton className="h-12 w-36 rounded-xl" />

        </div>

      </div>

      <Skeleton className="aspect-square rounded-[40px]" />

    </section>
  );
}

export default Skeleton;