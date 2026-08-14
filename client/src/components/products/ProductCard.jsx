import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { routes } from "../../config";
import { Button } from "../ui";

import ProductBadge from "./ProductBadge";
import ProductRating from "./ProductRating";
import Price from "./Price";
import ImageWithPlaceholder from "../ImageWithPlaceholder";

export default function ProductCard({
  product,
  onWishlist,
  isWishlisted = false,
  loading = false,
  badge,
}) {
  const [justAdded, setJustAdded] =
    useState(false);

  const {
    cartQuantityFor,
    addToCart,
  } = useCart();

  if (!product) {
    return null;
  }

  const productId =
    product._id ??
    product.id ??
    product.slug;

  const productName =
    product.name ??
    product.title ??
    "Product";

  const productImage =
    product.imageUrl ??
    product.image ??
    product.images?.[0]?.url ??
    product.images?.[0] ??
    "/images/spec360-logo.PNG";

  const stock = Number(product.stock ?? 0);

  const cartQuantity =
    cartQuantityFor?.(productId) ?? 0;

  const remaining =
    Math.max(0, stock - cartQuantity);

  const outOfStock =
    stock <= 0 || remaining <= 0;

  const productHref =
    `${routes.product.replace(":id", productId)}`;

  const categoryLabel =
    product.category
      ? String(product.category)
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          )
      : null;

  const stockLabel = () => {
    if (stock <= 0) {
      return {
        text: "Out of stock",
        className: "text-neutral-500",
      };
    }

    if (remaining <= 0) {
      return {
        text: "All available units in cart",
        className: "text-warning",
      };
    }

    if (remaining <= 5) {
      return {
        text: `Only ${remaining} left`,
        className: "text-warning",
      };
    }

    return null;
  };

  const availabilityLabel =
    stockLabel();

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (outOfStock || loading) {
      return;
    }

    addToCart(product);

    setJustAdded(true);

    window.setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onWishlist?.(product);
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900"
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-800">
        <Link
          to={productHref}
          aria-label={`View ${productName}`}
          className="block h-full"
        >
          <ImageWithPlaceholder
          src={productImage}
          alt={productName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        {/* Badge */}
        {(badge ||
          product.badge ||
          product.badgeType ||
          product.featured) && (
          <div className="absolute left-4 top-4">
            <ProductBadge
              type={
                product.badgeType ??
                (product.featured
                  ? "featured"
                  : "new")
              }
            >
              {badge ??
                product.badge ??
                undefined}
            </ProductBadge>
          </div>
        )}

        {/* Sold out overlay */}
        {outOfStock && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
            <ProductBadge type="soldOut">
              {stock <= 0
                ? "Out of Stock"
                : "In Cart"}
            </ProductBadge>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? `Remove ${productName} from wishlist`
              : `Add ${productName} to wishlist`
          }
          aria-pressed={isWishlisted}
          className={[
            "absolute right-4 top-4 z-10",
            "flex h-10 w-10 items-center justify-center",
            "rounded-full border backdrop-blur-md",
            "transition-all duration-200",
            isWishlisted
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-white/10 bg-neutral-950/70 text-neutral-300 hover:border-white/20 hover:text-white",
          ].join(" ")}
        >
          <Heart
            size={18}
            className={
              isWishlisted
                ? "fill-current"
                : undefined
            }
          />
        </button>
      </div>

      {/* Product information */}
      <div className="flex flex-1 flex-col p-5">
        {categoryLabel && (
          <span className="text-xs font-medium uppercase tracking-wider text-primary-400">
            {categoryLabel}
          </span>
        )}

        <Link
          to={productHref}
          className="mt-2 block"
        >
          <h3 className="line-clamp-2 min-h-[3rem] font-heading text-lg font-semibold leading-6 text-white transition-colors group-hover:text-primary-400">
            {productName}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
            {product.description}
          </p>
        )}

        {(product.rating !== undefined ||
          product.reviews !== undefined) && (
          <ProductRating
            rating={product.rating ?? 0}
            reviews={product.reviews ?? 0}
            className="mt-4"
          />
        )}

        <div className="mt-4">
          <Price
            amount={product.price}
            compareAt={product.compareAt}
            currency="NGN"
          />
        </div>

        {availabilityLabel && (
          <p
            className={`mt-2 text-xs font-medium ${availabilityLabel.className}`}
          >
            {availabilityLabel.text}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5">
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={outOfStock || loading}
            onClick={handleAddToCart}
            className="flex-1"
          >
            {justAdded ? (
              <>
                <Check size={16} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                {loading
                  ? "Adding..."
                  : outOfStock
                    ? stock <= 0
                      ? "Sold Out"
                      : "In Cart"
                    : "Add to Cart"}
              </>
            )}
          </Button>

          <Link
            to={productHref}
            aria-label={`View details for ${productName}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-neutral-400 transition-colors hover:border-primary-500/30 hover:bg-primary-500/10 hover:text-primary-400"
          >
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}