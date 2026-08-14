import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Edit3,
  Package,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  fetchProducts,
  updateProduct,
  deleteProduct,
} from "../services/api";

import ImageWithPlaceholder from "../components/ImageWithPlaceholder";

const EMPTY_FORM = {
  name: "",
  category: "phone",
  price: "",
  compareAt: "",
  description: "",
  stock: "0",
  compatibility: "",
  brand: "",
  featured: false,
};

const CATEGORY_OPTIONS = [
  {
    value: "phone",
    label: "Phone",
  },
  {
    value: "accessory",
    label: "Accessory",
  },
  {
    value: "part",
    label: "Part",
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getStockState(stock) {
  const value = Number(stock) || 0;

  if (value <= 0) {
    return {
      label: "Out of stock",
      className: "text-neutral-500",
    };
  }

  if (value <= 5) {
    return {
      label: `Only ${value} left`,
      className: "text-warning",
    };
  }

  return {
    label: `${value} in stock`,
    className: "text-success",
  };
}

function EditProductModal({
  product,
  form,
  saving,
  error,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-product-title"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        transition={{
          duration: 0.2,
        }}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-neutral-900 shadow-card"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/10 bg-neutral-900 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">
              Product Management
            </p>

            <h2
              id="edit-product-title"
              className="mt-1 font-heading text-2xl font-bold text-white"
            >
              Edit Product
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Update product information and inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close edit product"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="space-y-6 p-6 sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          {/* Product preview */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-neutral-950 p-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-800">
              <ImageWithPlaceholder
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate font-heading text-sm font-semibold text-white">
                {product.name}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                Current stock:{" "}
                <span className="font-semibold text-neutral-300">
                  {Number(product.stock) || 0}
                </span>
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="product-name"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Product name
            </label>

            <input
              id="product-name"
              type="text"
              value={form.name}
              onChange={(event) =>
                onChange(
                  "name",
                  event.target.value
                )
              }
              maxLength={200}
              required
              className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          {/* Category / Brand */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="product-category"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Category
              </label>

              <select
                id="product-category"
                value={form.category}
                onChange={(event) =>
                  onChange(
                    "category",
                    event.target.value
                  )
                }
                required
                className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/10"
              >
                {CATEGORY_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-brand"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Brand
              </label>

              <input
                id="product-brand"
                type="text"
                value={form.brand}
                onChange={(event) =>
                  onChange(
                    "brand",
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/10"
              />
            </div>
          </div>

          {/* Price / Compare / Stock */}
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="product-price"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Selling price
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-600">
                  ₦
                </span>

                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(event) =>
                    onChange(
                      "price",
                      event.target.value
                    )
                  }
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 pl-9 pr-4 text-sm text-white outline-none transition focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="product-compare"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Compare-at price
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-600">
                  ₦
                </span>

                <input
                  id="product-compare"
                  type="number"
                  min="0"
                  step="1"
                  value={form.compareAt}
                  onChange={(event) =>
                    onChange(
                      "compareAt",
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 pl-9 pr-4 text-sm text-white outline-none transition focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="product-stock"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Stock quantity
              </label>

              <input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(event) =>
                  onChange(
                    "stock",
                    event.target.value
                  )
                }
                required
                className="h-12 w-full rounded-xl border border-primary-500/40 bg-neutral-950 px-4 text-sm font-semibold text-white outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
              />

              <p className="mt-2 text-xs text-neutral-600">
                Set to 0 when the product is out of stock.
              </p>
            </div>
          </div>

          {/* Compatibility */}
          <div>
            <label
              htmlFor="product-compatibility"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Compatibility
            </label>

            <input
              id="product-compatibility"
              type="text"
              value={form.compatibility}
              onChange={(event) =>
                onChange(
                  "compatibility",
                  event.target.value
                )
              }
              placeholder="e.g. Samsung S24 Ultra"
              className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="product-description"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Description
            </label>

            <textarea
              id="product-description"
              value={form.description}
              onChange={(event) =>
                onChange(
                  "description",
                  event.target.value
                )
              }
              maxLength={2000}
              rows={5}
              className="w-full resize-y rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          {/* Featured */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-neutral-950 p-4">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(event) =>
                onChange(
                  "featured",
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-[#E10600]"
            />

            <span>
              <span className="block text-sm font-medium text-white">
                Featured product
              </span>

              <span className="mt-1 block text-xs text-neutral-600">
                Show this product in featured product sections.
              </span>
            </span>
          </label>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-primary-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] =
    useState(null);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [editForm, setEditForm] =
    useState(EMPTY_FORM);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [editError, setEditError] =
    useState("");

  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // LOAD PRODUCTS
  // ---------------------------------------------------------------------------

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchProducts();

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setProducts(data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response =
          await fetchProducts();

        if (!mounted) return;

        const data = Array.isArray(
          response.data
        )
          ? response.data
          : response.data?.data || [];

        setProducts(data);
      } catch (requestError) {
        if (!mounted) return;

        setError(
          requestError.response?.data
            ?.message ||
            "Failed to load products."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // EDIT
  // ---------------------------------------------------------------------------

  const openEdit = (product) => {
    setEditError("");

    setEditingProduct(product);

    setEditForm({
      name: product.name || "",
      category:
        product.category || "phone",
      price:
        product.price ?? "",
      compareAt:
        product.compareAt ?? "",
      description:
        product.description || "",
      stock:
        Number(product.stock) || 0,
      compatibility:
        product.compatibility || "",
      brand:
        product.brand || "",
      featured:
        Boolean(product.featured),
    });
  };

  const closeEdit = () => {
    if (saving) return;

    setEditingProduct(null);
    setEditError("");
    setEditForm(EMPTY_FORM);
  };

  const updateEditField = (
    field,
    value
  ) => {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleEditSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!editingProduct) return;

    setEditError("");

    const price = Number(
      editForm.price
    );

    const stock = Number(
      editForm.stock
    );

    const compareAt =
      editForm.compareAt === "" ||
      editForm.compareAt === null
        ? undefined
        : Number(editForm.compareAt);

    if (
      !editForm.name.trim()
    ) {
      setEditError(
        "Product name is required."
      );
      return;
    }

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      setEditError(
        "Enter a valid product price."
      );
      return;
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setEditError(
        "Stock must be a whole number greater than or equal to 0."
      );
      return;
    }

    if (
      compareAt !== undefined &&
      (!Number.isFinite(compareAt) ||
        compareAt < 0)
    ) {
      setEditError(
        "Enter a valid compare-at price."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: editForm.name.trim(),
        category: editForm.category,
        price,
        description:
          editForm.description.trim(),
        stock,
        compatibility:
          editForm.compatibility.trim(),
        brand:
          editForm.brand.trim(),
        featured:
          Boolean(editForm.featured),
      };

      if (compareAt !== undefined) {
        payload.compareAt = compareAt;
      } else {
        payload.compareAt = null;
      }

      const response =
        await updateProduct(
          editingProduct._id,
          payload
        );

      const updated =
        response.data?.data ||
        response.data;

      setProducts((current) =>
        current.map((product) =>
          product._id ===
          editingProduct._id
            ? updated
            : product
        )
      );

      closeEdit();
    } catch (requestError) {
      setEditError(
        requestError.response?.data
          ?.message ||
          "Failed to update product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  const handleDelete = async (
    id,
    name
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${name}"? This cannot be undone.`
      );

    if (!confirmed) return;

    setDeleting(id);

    try {
      await deleteProduct(id);

      setProducts((current) =>
        current.filter(
          (product) =>
            product._id !== id
        )
      );
    } catch (requestError) {
      window.alert(
        requestError.response?.data
          ?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeleting(null);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <>
      <section className="min-h-screen w-full bg-bg pb-24 pt-28">
        <div className="mx-auto w-[92%] max-w-[1400px]">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px w-8 bg-primary-500" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">
                  Admin
                </span>
              </div>

              <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Manage Products
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                {products.length} product
                {products.length !== 1
                  ? "s"
                  : ""}{" "}
                in store
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/add-product"
                )
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-primary-600"
            >
              <Plus size={17} />
              Add Product
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <AlertTriangle
                size={17}
                className="shrink-0"
              />

              <span>{error}</span>

              <button
                type="button"
                onClick={loadProducts}
                className="ml-auto font-semibold text-white underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl border border-white/5 bg-neutral-900"
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading &&
            products.length === 0 &&
            !error && (
              <div className="rounded-3xl border border-white/10 bg-neutral-900 px-6 py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950">
                  <Package
                    size={28}
                    className="text-neutral-600"
                  />
                </div>

                <h2 className="mt-5 font-heading text-xl font-bold text-white">
                  No products yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
                  Add your first product to
                  start building your store
                  catalogue.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/add-product"
                    )
                  }
                  className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  <Plus size={16} />
                  Add First Product
                </button>
              </div>
            )}

          {/* Products */}
          {!loading &&
            products.length > 0 && (
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-card">
                {/* Desktop headings */}
                <div className="hidden grid-cols-[64px_minmax(0,1fr)_110px_130px_110px_150px] items-center gap-4 border-b border-white/10 px-6 py-4 lg:grid">
                  {[
                    "Image",
                    "Product",
                    "Category",
                    "Price",
                    "Stock",
                    "Actions",
                  ].map((heading) => (
                    <span
                      key={heading}
                      className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-600"
                    >
                      {heading}
                    </span>
                  ))}
                </div>

                <AnimatePresence mode="popLayout">
                  {products.map(
                    (product, index) => {
                      const stockState =
                        getStockState(
                          product.stock
                        );

                      const isDeleting =
                        deleting ===
                        product._id;

                      return (
                        <motion.div
                          key={product._id}
                          layout
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity:
                              isDeleting
                                ? 0.4
                                : 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                          className={`grid gap-4 px-5 py-5 ${
                            index <
                            products.length - 1
                              ? "border-b border-white/5"
                              : ""
                          } lg:grid-cols-[64px_minmax(0,1fr)_110px_130px_110px_150px] lg:items-center lg:px-6`}
                        >
                          {/* Image */}
                          <div className="h-16 w-16 overflow-hidden rounded-xl bg-neutral-800">
                            <ImageWithPlaceholder
                              src={
                                product.imageUrl
                              }
                              alt={
                                product.name
                              }
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* Product */}
                          <div className="min-w-0">
                            <p className="truncate font-heading text-sm font-semibold text-white">
                              {
                                product.name
                              }
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] capitalize text-neutral-500">
                                {
                                  product.category
                                }
                              </span>

                              {product.featured && (
                                <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-[11px] text-primary-400">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Category */}
                          <div className="hidden lg:block">
                            <span className="text-sm capitalize text-neutral-400">
                              {
                                product.category
                              }
                            </span>
                          </div>

                          {/* Price */}
                          <div>
                            <span className="font-heading text-sm font-semibold text-white">
                              {formatCurrency(
                                product.price
                              )}
                            </span>
                          </div>

                          {/* Stock */}
                          <div>
                            <span
                              className={`text-sm font-medium ${stockState.className}`}
                            >
                              {
                                stockState.label
                              }
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 lg:justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                openEdit(
                                  product
                                )
                              }
                              disabled={
                                isDeleting
                              }
                              title="Edit product"
                              aria-label={`Edit ${product.name}`}
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-white transition-colors hover:border-primary-500/30 hover:bg-primary-500/10 hover:text-primary-400 disabled:pointer-events-none disabled:opacity-40"
                            >
                              <Edit3
                                size={16}
                              />

                              <span className="hidden xl:inline">
                                Edit
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  product._id,
                                  product.name
                                )
                              }
                              disabled={
                                isDeleting
                              }
                              title="Delete product"
                              aria-label={`Delete ${product.name}`}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 transition-colors hover:border-red-500/20 hover:bg-red-500/10 disabled:pointer-events-none disabled:opacity-40"
                            >
                              {isDeleting ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-400/30 border-t-red-400" />
                              ) : (
                                <Trash2
                                  size={16}
                                />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </AnimatePresence>
              </div>
            )}

          {/* Back */}
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-white"
            >
              <ArrowLeft size={15} />
              Back to site
            </Link>
          </div>
        </div>
      </section>

      {/* Edit modal */}
      <AnimatePresence>
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            form={editForm}
            saving={saving}
            error={editError}
            onChange={updateEditField}
            onClose={closeEdit}
            onSubmit={handleEditSubmit}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminProductList;