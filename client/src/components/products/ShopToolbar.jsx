import {
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  CategoryFilter,
  SearchFilter,
  SortSelect,
} from "./";

export default function ShopToolbar({
  categories = [],
  category = "all",
  onCategoryChange,

  search = "",
  onSearchChange,
  onSearchClear,

  sort = "featured",
  sortOptions = [],
  onSortChange,

  resultCount = 0,

  onClearFilters,
}) {
  const hasFilters =
    category !== "all" ||
    Boolean(search.trim());

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="w-full xl:max-w-md">
          <SearchFilter
            value={search}
            onChange={onSearchChange}
            onClear={onSearchClear}
            placeholder="Search phones, parts & accessories..."
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="text-sm text-neutral-500">
            <span className="font-medium text-neutral-300">
              {resultCount}
            </span>{" "}
            {resultCount === 1
              ? "product"
              : "products"}
          </div>

          {sortOptions.length > 0 && (
            <SortSelect
              value={sort}
              options={sortOptions}
              onChange={onSortChange}
            />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-2">
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={onCategoryChange}
        />
      </div>

      {hasFilters && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <SlidersHorizontal
              size={15}
              className="text-primary-500"
            />

            <span>
              {resultCount}{" "}
              {resultCount === 1
                ? "matching product"
                : "matching products"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
          >
            <X size={15} />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}