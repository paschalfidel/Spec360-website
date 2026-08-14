import { motion } from "framer-motion";

import {
  EmptyState,
  ProductCardSkeleton,
} from "../ui";

import ProductCard from "./ProductCard";

export default function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 8,
  onWishlist,
  wishlistIds = [],
  emptyTitle = "No products found",
  emptyDescription =
    "We couldn't find any products matching your selection.",
}) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({
          length: skeletonCount,
        }).map((_, index) => (
          <ProductCardSkeleton
            key={index}
          />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        icon="products"
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <motion.div
      layout
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => {
        const productId =
          product._id ??
          product.id ??
          product.slug;

        return (
          <ProductCard
            key={productId}
            product={product}
            onWishlist={onWishlist}
            isWishlisted={wishlistIds.includes(
              productId
            )}
          />
        );
      })}
    </motion.div>
  );
}