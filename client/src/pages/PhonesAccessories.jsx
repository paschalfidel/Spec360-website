import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import { fetchProducts } from "../services/api";

import TrustBadges from "../components/TrustBadges";

import {
  ProductGrid,
  ShopToolbar,
} from "../components/products";

import {
  Container,
  Section,
} from "../components/ui";

const FILTERS = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "phone",
    label: "Phones",
  },
  {
    value: "accessory",
    label: "Accessories",
  },
  {
    value: "part",
    label: "Parts",
  },
];

const SORT_OPTIONS = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
  },
  {
    value: "name-asc",
    label: "Name: A–Z",
  },
  {
    value: "name-desc",
    label: "Name: Z–A",
  },
];

const SAMPLE_PRODUCTS = [
  {
    _id: "s1",
    name: "iPhone 14 Clear Case",
    category: "accessory",
    price: 8500,
    description:
      "Crystal-clear slim case. MIL-grade drop protection, wireless charging compatible.",
    imageUrl:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80",
    stock: 24,
  },
  {
    _id: "s2",
    name: "Samsung A54 Screen Replacement",
    category: "part",
    price: 18000,
    description:
      "OEM-grade AMOLED screen. Includes tools & adhesive. Same-day fitting available.",
    imageUrl:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    stock: 8,
  },
  {
    _id: "s3",
    name: "20W Fast Charger + Cable",
    category: "accessory",
    price: 4500,
    description:
      "Universal USB-C fast charger. Compatible with iPhone 15, Samsung Galaxy, and more.",
    imageUrl:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80",
    stock: 50,
  },
  {
    _id: "s4",
    name: "iPhone/Samsung Battery (OEM)",
    category: "part",
    price: 15000,
    description:
      "Genuine OEM replacement battery. 90-day warranty. Walk in, walk out same day.",
    imageUrl:
      "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=500&q=80",
    stock: 3,
  },
  {
    _id: "s5",
    name: "Tempered Glass Screen Guard",
    category: "accessory",
    price: 3000,
    description:
      "9H hardness, anti-fingerprint coating. Available for all iPhone & Samsung models.",
    imageUrl:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80",
    stock: 100,
  },
  {
    _id: "s6",
    name: "iPhone 13/14 Charging Port",
    category: "part",
    price: 6500,
    description:
      "OEM lightning/USB-C charging port flex cable. Fixes no-charge and loose port issues.",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    stock: 12,
  },
  {
    _id: "s7",
    name: "Samsung Galaxy A Series Back Glass",
    category: "part",
    price: 7000,
    description:
      "OEM replacement back glass panel. Compatible with A52, A53, A54 series.",
    imageUrl:
      "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&q=80",
    stock: 7,
  },
  {
    _id: "s8",
    name: "Tecno Camon Phone (128GB)",
    category: "phone",
    price: 85000,
    description:
      'Brand new, sealed. 6.7" display, 50MP camera, 5000mAh battery. 1-year warranty.',
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    stock: 5,
  },
];

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

    imageUrl:
      product.imageUrl ??
      product.image ??
      product.images?.[0]?.url ??
      product.images?.[0],

    price: Number(product.price) || 0,

    stock: Number(product.stock ?? 0),
  };
}

export default function PhonesAccessories() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("all");

  const [search, setSearch] =
    useState(() => searchParams.get("search") ?? "");

  const [sort, setSort] =
    useState("featured");

  const [wishlistIds, setWishlistIds] =
    useState([]);

  useEffect(() => {
    const query = searchParams.get("search") ?? "";
    setSearch(query);
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const response =
          await fetchProducts();

        const apiProducts =
          Array.isArray(response?.data)
            ? response.data
            : [];

        const source =
          apiProducts.length > 0
            ? apiProducts
            : SAMPLE_PRODUCTS;

        if (mounted) {
          setProducts(
            source
              .map(normalizeProduct)
              .filter(Boolean)
          );
        }
      } catch {
        if (mounted) {
          setProducts(
            SAMPLE_PRODUCTS.map(
              normalizeProduct
            ).filter(Boolean)
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filter !== "all") {
      result = result.filter(
        (product) =>
          product.category === filter
      );
    }

    const query =
      search.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (product) => {
          const searchableText = [
            product.name,
            product.description,
            product.category,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            query
          );
        }
      );
    }

    switch (sort) {
      case "price-asc":
        result.sort(
          (a, b) =>
            a.price - b.price
        );
        break;

      case "price-desc":
        result.sort(
          (a, b) =>
            b.price - a.price
        );
        break;

      case "name-asc":
        result.sort((a, b) =>
          String(a.name).localeCompare(
            String(b.name)
          )
        );
        break;

      case "name-desc":
        result.sort((a, b) =>
          String(b.name).localeCompare(
            String(a.name)
          )
        );
        break;

      case "featured":
      default:
        result.sort(
          (a, b) =>
            Number(Boolean(b.featured)) -
            Number(Boolean(a.featured))
        );
        break;
    }

    return result;
  }, [
    products,
    filter,
    search,
    sort,
  ]);

  const categoryCounts =
    useMemo(() => {
      return products.reduce(
        (counts, product) => {
          if (
            product.category &&
            counts[product.category] !==
              undefined
          ) {
            counts[product.category] += 1;
          }

          return counts;
        },
        {
          phone: 0,
          accessory: 0,
          part: 0,
        }
      );
    }, [products]);

  const categories = FILTERS.map(
    (category) => ({
      ...category,
      label:
        category.value === "all"
          ? `All (${products.length})`
          : `${category.label} (${
              categoryCounts[
                category.value
              ] ?? 0
            })`,
    })
  );

  const clearFilters = () => {
    setFilter("all");
    setSearch("");
    setSort("featured");
  };

  const handleWishlist = (product) => {
    const productId =
      product._id ??
      product.id ??
      product.slug;

    setWishlistIds((current) =>
      current.includes(productId)
        ? current.filter(
            (id) => id !== productId
          )
        : [...current, productId]
    );
  };

  return (
    <>
      <h1 className="sr-only">
        Buy iPhone &amp; Samsung Phones,
        Parts &amp; Accessories in Nigeria —
        Spec360
      </h1>

      <Section className="pt-28">
        <Container>
          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="border-b border-white/10 pb-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-primary-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">
                Spec360 Store
              </span>
            </div>

            <h2 className="max-w-4xl font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Phones, Parts &amp;{" "}
              <span className="text-primary-500">
                Accessories
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg">
              Genuine phones, OEM parts and
              accessories — carefully selected
              for Nigeria.
            </p>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.5,
            }}
            className="py-8"
          >
            <TrustBadges compact />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.5,
            }}
          >
            <ShopToolbar
              categories={categories}
              category={filter}
              onCategoryChange={
                setFilter
              }
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                const next = new URLSearchParams(searchParams);
                if (value.trim()) next.set("search", value.trim());
                else next.delete("search");
                setSearchParams(next, { replace: true });
              }}
              onSearchClear={() => {
                setSearch("");
                const next = new URLSearchParams(searchParams);
                next.delete("search");
                setSearchParams(next, { replace: true });
              }}
              sort={sort}
              sortOptions={
                SORT_OPTIONS
              }
              onSortChange={
                setSort
              }
              resultCount={
                filteredProducts.length
              }
              onClearFilters={
                clearFilters
              }
            />
          </motion.div>

          {/* Products */}
          <div className="mt-10">
            <ProductGrid
              products={
                filteredProducts
              }
              loading={loading}
              skeletonCount={8}
              wishlistIds={
                wishlistIds
              }
              onWishlist={
                handleWishlist
              }
              emptyTitle="No products found"
              emptyDescription={
                search.trim() ||
                filter !== "all"
                  ? "Try another search or clear your filters to see more Spec360 products."
                  : "Products will appear here when they are available."
              }
            />
          </div>
        </Container>
      </Section>
    </>
  );
}