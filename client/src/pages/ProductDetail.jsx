import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { fetchProductById } from "../services/api";
import { useCart } from "../context/CartContext";

import ImageWithPlaceholder from "../components/ImageWithPlaceholder";

import {
  ProductBadge,
  ProductRating,
  Price,
} from "../components/products";

import {
  Button,
  Container,
  EmptyState,
  Section,
} from "../components/ui";

const STORE_ROUTE =
  "/services/phones-accessories";

function normalizeProduct(product) {
  if (!product) {
    return null;
  }

  return {
    ...product,

    _id:
      product._id ??
      product.id ??
      product.slug,

    name:
      product.name ??
      product.title ??
      "Product",

    imageUrl:
      product.imageUrl ??
      product.image ??
      product.images?.[0]?.url ??
      product.images?.[0] ??
      null,

    price:
      Number(product.price) || 0,

    stock:
      Number(product.stock ?? 0),

    rating:
      Number(product.rating ?? 0),

    reviews:
      Number(product.reviews ?? 0),
  };
}

function categoryLabel(category) {
  if (!category) {
    return "Product";
  }

  return String(category)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function LoadingState() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-500"
        aria-label="Loading product"
      />
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(Boolean(id));

  const [error, setError] =
    useState(!id);

  const [quantity, setQuantity] =
    useState(1);

  const [added, setAdded] =
    useState(false);

  const {
    addToCart,
    cartQuantityFor,
  } = useCart();

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      setLoading(true);
      setError(false);

      try {
        const response =
          await fetchProductById(id);

        if (!mounted) {
          return;
        }

        const normalized =
          normalizeProduct(
            response?.data
          );

        setProduct(normalized);
      } catch {
        if (mounted) {
          setProduct(null);
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadProduct();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  const stock =
    product?.stock ?? 0;

  const inCart =
    product?._id
      ? cartQuantityFor(product._id)
      : 0;

  const remaining = Math.max(
    0,
    stock - inCart
  );

  const isOutOfStock =
    stock <= 0;

  const isAtCartLimit =
    !isOutOfStock &&
    remaining <= 0;

  const effectiveQuantity =
    remaining > 0
      ? Math.min(
          Math.max(1, quantity),
          remaining
        )
      : 0;

  const totalPrice = useMemo(() => {
    return (
      Number(product?.price ?? 0) *
      effectiveQuantity
    );
  }, [
    product?.price,
    effectiveQuantity,
  ]);

  const handleDecrease = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const handleIncrease = () => {
    setQuantity((current) =>
      Math.min(
        remaining,
        current + 1
      )
    );
  };

  const handleAddToCart = () => {
    if (
      !product ||
      effectiveQuantity <= 0 ||
      isOutOfStock ||
      isAtCartLimit
    ) {
      return;
    }

    for (
      let index = 0;
      index < effectiveQuantity;
      index += 1
    ) {
      addToCart(product);
    }

    setAdded(true);

    if (
      typeof window.gtag ===
      "function"
    ) {
      window.gtag(
        "event",
        "add_to_cart",
        {
          currency: "NGN",
          value: totalPrice,
          items: [
            {
              item_id: product._id,
              item_name: product.name,
              price: product.price,
              quantity:
                effectiveQuantity,
            },
          ],
        }
      );
    }

    window.setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const whatsappMessage =
    product
      ? `Hi Spec360! I'd like to order: ${product.name} (₦${Number(
          product.price
        ).toLocaleString(
          "en-NG"
        )}). Is it available?`
      : "";

  if (loading) {
    return <LoadingState />;
  }

  if (error || !product) {
    return (
      <Section className="min-h-[70vh] flex items-center">
        <Container>
          <EmptyState
            icon="products"
            title="Product not found"
            description="This product may have been removed, sold out, or the link may no longer be valid."
            action={
              <Button
                as={Link}
                to={STORE_ROUTE}
              >
                Back to Store
              </Button>
            }
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section className="pt-28 lg:pt-32">
      <Container>
        {/* Back navigation */}
        <motion.div
          initial={{
            opacity: 0,
            x: -15,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="mb-8"
        >
          <Link
            to={STORE_ROUTE}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-white"
          >
            <ArrowLeft
              size={16}
            />

            Back to Store
          </Link>
        </motion.div>

        {/* Main product area */}
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* Image */}
          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.55,
            }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-card"
          >
            <div className="aspect-square">
              <ImageWithPlaceholder
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
                placeholderText="Spec360"
              />
            </div>
          </motion.div>

          {/* Product information */}
          <motion.div
            initial={{
              opacity: 0,
              x: 25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.55,
              delay: 0.1,
            }}
            className="flex flex-col"
          >
            {/* Category */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-400">
                {categoryLabel(
                  product.category
                )}
              </span>

              {product.featured && (
                <ProductBadge type="featured">
                  Featured
                </ProductBadge>
              )}
            </div>

            {/* Product name */}
            <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {product.name}
            </h1>

            {/* Rating */}
            {(product.rating > 0 ||
              product.reviews > 0) && (
              <ProductRating
                rating={
                  product.rating
                }
                reviews={
                  product.reviews
                }
                className="mt-5"
                size="md"
              />
            )}

            {/* Price */}
            <div className="mt-6">
              <Price
                amount={product.price}
                compareAt={
                  product.compareAt
                }
                currency="NGN"
                size="xl"
              />
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-400">
                {product.description}
              </p>
            )}

            {/* Stock */}
            <div className="mt-7 flex items-center gap-2 border-y border-white/10 py-5">
              <Package
                size={18}
                className="text-neutral-500"
              />

              {isOutOfStock ? (
                <span className="text-sm font-medium text-red-400">
                  Out of stock
                </span>
              ) : isAtCartLimit ? (
                <span className="text-sm font-medium text-warning">
                  You have all {stock} available
                  units in your cart
                </span>
              ) : (
                <span
                  className={`text-sm font-medium ${
                    stock <= 5
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {stock <= 5
                    ? `Only ${remaining} left`
                    : `${remaining} available`}
                  {inCart > 0 &&
                    ` · ${inCart} in cart`}
                </span>
              )}
            </div>

            {/* Purchase controls */}
            <div className="mt-6 space-y-4">
              {!isOutOfStock &&
                !isAtCartLimit && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-neutral-400">
                      Quantity
                    </span>

                    <div className="flex items-center rounded-xl border border-white/10 bg-neutral-900 p-1">
                      <button
                        type="button"
                        onClick={
                          handleDecrease
                        }
                        disabled={
                          effectiveQuantity <=
                          1
                        }
                        aria-label="Decrease quantity"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Minus
                          size={16}
                        />
                      </button>

                      <span
                        className="flex h-9 w-10 items-center justify-center font-heading text-sm font-semibold text-white"
                        aria-live="polite"
                      >
                        {
                          effectiveQuantity
                        }
                      </span>

                      <button
                        type="button"
                        onClick={
                          handleIncrease
                        }
                        disabled={
                          effectiveQuantity >=
                          remaining
                        }
                        aria-label="Increase quantity"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Plus
                          size={16}
                        />
                      </button>
                    </div>

                    <span className="text-xs text-neutral-600">
                      Max {remaining}
                    </span>
                  </div>
                )}

              {/* Total */}
              {!isOutOfStock &&
                !isAtCartLimit && (
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-900/70 px-5 py-4">
                    <span className="text-sm text-neutral-500">
                      Total
                    </span>

                    <Price
                      amount={
                        totalPrice
                      }
                      currency="NGN"
                      size="lg"
                    />
                  </div>
                )}

              {/* Add to cart */}
              <Button
                type="button"
                size="lg"
                disabled={
                  isOutOfStock ||
                  isAtCartLimit
                }
                onClick={
                  handleAddToCart
                }
                className="w-full"
              >
                {isOutOfStock ? (
                  <>
                    <ShoppingCart
                      size={19}
                    />
                    Out of Stock
                  </>
                ) : isAtCartLimit ? (
                  <>
                    <Check
                      size={19}
                    />
                    Max Qty in Cart
                  </>
                ) : added ? (
                  <>
                    <Check
                      size={19}
                    />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart
                      size={19}
                    />
                    Add{" "}
                    {effectiveQuantity >
                    1
                      ? `${effectiveQuantity} × `
                      : ""}
                    to Cart
                  </>
                )}
              </Button>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/2348182799154?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-6 text-sm font-semibold text-green-400 transition-all hover:border-green-500/40 hover:bg-green-500/10"
              >
                Order via WhatsApp
              </a>
            </div>

            {/* Trust information */}
            <div className="mt-8 grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-3">
              <TrustItem
                title="Genuine Products"
                description="Quality checked"
              />

              <TrustItem
                title="Secure Purchase"
                description="Reliable service"
              />

              <TrustItem
                title="Local Support"
                description="Nigeria-based"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

function TrustItem({
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
      <p className="text-sm font-semibold text-white">
        {title}
      </p>

      <p className="mt-1 text-xs text-neutral-500">
        {description}
      </p>
    </div>
  );
}