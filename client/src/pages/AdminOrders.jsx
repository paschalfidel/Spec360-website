import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import routes from "../config/routes";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const STATUS_OPTIONS = [
  "all",
  "pending",
  "paid",
  "fulfilled",
  "cancelled",
  "refunded",
];

const STATUS_META = {
  pending: {
    label: "Pending",
    icon: Clock3,
  },
  paid: {
    label: "Paid",
    icon: CheckCircle2,
  },
  fulfilled: {
    label: "Fulfilled",
    icon: Truck,
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    icon: RefreshCw,
  },
};

function getStoredAdminToken() {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

function formatMoney(value, currency = "NGN") {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₦0";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusMeta(status) {
  return (
    STATUS_META[status] || {
      label:
        status
          ?.replaceAll("_", " ")
          ?.replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          ) || "Unknown",
      icon: AlertCircle,
    }
  );
}

function StatusBadge({ status }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;

  const styles = {
    pending:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
    paid:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    fulfilled:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
    cancelled:
      "border-red-500/20 bg-red-500/10 text-red-400",
    refunded:
      "border-purple-500/20 bg-purple-500/10 text-purple-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[status] ||
        "border-white/10 bg-white/5 text-white/70"
      }`}
    >
      <Icon size={13} />
      {meta.label}
    </span>
  );
}

function normalizeOrders(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.orders)) {
    return payload.data.orders;
  }

  if (Array.isArray(payload?.orders)) {
    return payload.orders;
  }

  return [];
}

function getOrderId(order) {
  return (
    order?._id ||
    order?.id ||
    order?.orderId ||
    ""
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [status, setStatus] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState("");

  const fetchOrders = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const token =
          getStoredAdminToken();

        const response = await fetch(
          `${API_BASE_URL}/orders/admin`,
          {
            method: "GET",
            headers: {
              Accept:
                "application/json",
              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

        const payload =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            payload?.message ||
              "Unable to load orders"
          );
        }

        const nextOrders =
          normalizeOrders(payload);

        setOrders(nextOrders);

        if (
          selectedOrder &&
          !nextOrders.some(
            (order) =>
              String(
                getOrderId(order)
              ) ===
              String(
                getOrderId(
                  selectedOrder
                )
              )
          )
        ) {
          setSelectedOrder(null);
        }
      } catch (requestError) {
        console.error(
          "Admin orders error:",
          requestError
        );

        setError(
          requestError?.message ||
            "Unable to load orders"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedOrder]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        status === "all" ||
        order.status === status;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const customer =
        order.customer || {};

      const searchable = [
        order.reference,
        customer.name,
        customer.email,
        customer.phone,
        order.paystackTransactionId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(
        query
      );
    });
  }, [orders, search, status]);

  const statistics = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(
        (order) =>
          order.status === "pending"
      ).length,
      paid: orders.filter(
        (order) =>
          order.status === "paid"
      ).length,
      fulfilled: orders.filter(
        (order) =>
          order.status === "fulfilled"
      ).length,
      revenue: orders
        .filter(
          (order) =>
            order.status ===
              "paid" ||
            order.status ===
              "fulfilled"
        )
        .reduce(
          (total, order) =>
            total +
            Number(order.amount || 0),
          0
        ),
    };
  }, [orders]);

  async function updateOrderStatus(
    order,
    nextStatus
  ) {
    const orderId =
      getOrderId(order);

    if (!orderId) {
      return;
    }

    setUpdatingId(
      String(orderId)
    );
    setError("");

    try {
      const token =
        getStoredAdminToken();

      const response = await fetch(
        `${API_BASE_URL}/orders/admin/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const payload =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload?.message ||
            "Unable to update order"
        );
      }

      const updated =
        payload?.data ||
        payload?.order ||
        payload;

      setOrders((current) =>
        current.map((item) =>
          String(
            getOrderId(item)
          ) === String(orderId)
            ? {
                ...item,
                ...updated,
                status:
                  updated?.status ||
                  nextStatus,
              }
            : item
        )
      );

      setSelectedOrder((current) =>
        current &&
        String(
          getOrderId(current)
        ) === String(orderId)
          ? {
              ...current,
              ...updated,
              status:
                updated?.status ||
                nextStatus,
            }
          : current
      );
    } catch (requestError) {
      console.error(
        "Order status update error:",
        requestError
      );

      setError(
        requestError?.message ||
          "Unable to update order"
      );
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              to={
                routes.adminProducts
              }
              className="mb-3 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Orders
            </h1>

            <p className="mt-1 text-sm text-white/50">
              Manage customer orders,
              payments and fulfilment.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchOrders(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>{error}</span>
          </div>
        )}

        {/* STATS */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard
            label="Total Orders"
            value={statistics.total}
            icon={Package}
          />

          <StatCard
            label="Pending"
            value={statistics.pending}
            icon={Clock3}
          />

          <StatCard
            label="Paid"
            value={statistics.paid}
            icon={CheckCircle2}
          />

          <StatCard
            label="Fulfilled"
            value={
              statistics.fulfilled
            }
            icon={Truck}
          />

          <StatCard
            label="Revenue"
            value={formatMoney(
              statistics.revenue
            )}
            icon={CheckCircle2}
            className="col-span-2 md:col-span-1"
          />
        </div>

        {/* FILTERS */}
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search reference, customer, email or phone..."
              className="h-11 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-red-500/50"
            />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-black/30 px-4 pr-10 text-sm text-white outline-none transition focus:border-red-500/50 md:w-48"
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                    className="bg-[#111]"
                  >
                    {option === "all"
                      ? "All statuses"
                      : getStatusMeta(
                          option
                        ).label}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
            />
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="flex items-center gap-3 text-sm text-white/50">
              <Loader2
                size={20}
                className="animate-spin"
              />
              Loading orders...
            </div>
          </div>
        ) : filteredOrders.length ===
          0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025] px-6 text-center">
            <Package
              size={40}
              className="mb-4 text-white/20"
            />

            <h2 className="font-semibold">
              No orders found
            </h2>

            <p className="mt-1 max-w-md text-sm text-white/40">
              {orders.length === 0
                ? "Customer orders will appear here after checkout."
                : "Try changing your search or status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.025] text-xs uppercase tracking-wider text-white/40">
                    <th className="px-5 py-4 font-semibold">
                      Order
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Customer
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Amount
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Payment
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Date
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>
                    <th className="px-5 py-4 font-semibold text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map(
                    (order) => {
                      const customer =
                        order.customer ||
                        {};

                      return (
                        <tr
                          key={
                            getOrderId(
                              order
                            ) ||
                            order.reference
                          }
                          className="transition hover:bg-white/[0.025]"
                        >
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedOrder(
                                  order
                                )
                              }
                              className="text-left"
                            >
                              <p className="font-mono text-sm font-semibold text-red-400 transition hover:text-red-300">
                                {order.reference ||
                                  "—"}
                              </p>

                              <p className="mt-1 text-xs text-white/35">
                                {order.items
                                  ?.length ||
                                  0}{" "}
                                item(s)
                              </p>
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium">
                              {customer.name ||
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-white/40">
                              {customer.email ||
                                "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold">
                            {formatMoney(
                              order.amount,
                              order.currency
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm capitalize">
                              {order.paymentChannel ||
                                "—"}
                            </p>

                            <p className="mt-1 max-w-[150px] truncate font-mono text-[11px] text-white/30">
                              {order.paystackTransactionId ||
                                order.reference ||
                                "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-xs text-white/50">
                            {formatDate(
                              order.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                order.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedOrder(
                                  order
                                )
                              }
                              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold transition hover:border-white/20 hover:bg-white/[0.06]"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-4 text-xs text-white/30">
          Showing{" "}
          {filteredOrders.length}{" "}
          of {orders.length} orders
        </p>
      </div>

      {/* ORDER DETAILS */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          updatingId={updatingId}
          onClose={() =>
            setSelectedOrder(null)
          }
          onUpdateStatus={
            updateOrderStatus
          }
        />
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.025] p-4 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-white/40">
          {label}
        </span>

        <Icon
          size={17}
          className="text-white/30"
        />
      </div>

      <p className="truncate text-lg font-bold sm:text-xl">
        {value}
      </p>
    </div>
  );
}

function OrderDetails({
  order,
  updatingId,
  onClose,
  onUpdateStatus,
}) {
  const customer =
    order.customer || {};

  const orderId =
    getOrderId(order);

  const isUpdating =
    String(updatingId) ===
    String(orderId);

  const canFulfill =
    order.status === "paid";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-t-3xl border border-white/10 bg-[#0d0d0d] shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <p className="font-mono text-sm text-red-400">
              {order.reference ||
                "Order"}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <StatusBadge
                status={order.status}
              />

              <span className="text-xs text-white/35">
                {formatDate(
                  order.createdAt
                )}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Close order details"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-80px)] overflow-y-auto p-5 sm:p-6">
          {/* CUSTOMER */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">
              Customer
            </h2>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-3">
              <Detail
                label="Name"
                value={
                  customer.name
                }
              />

              <Detail
                label="Email"
                value={
                  customer.email
                }
              />

              <Detail
                label="Phone"
                value={
                  customer.phone
                }
              />
            </div>
          </section>

          {/* ITEMS */}
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">
              Items
            </h2>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="divide-y divide-white/10">
                {(order.items ||
                  []).map(
                  (item, index) => (
                    <div
                      key={
                        item.productId ||
                        index
                      }
                      className="flex gap-4 p-4"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        {item.imageUrl ? (
                          <img
                            src={
                              item.imageUrl
                            }
                            alt={
                              item.name ||
                              "Product"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package
                              size={20}
                              className="text-white/20"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {item.name ||
                            "Product"}
                        </p>

                        <p className="mt-1 text-xs text-white/40">
                          Qty:{" "}
                          {item.quantity ||
                            0}{" "}
                          ×{" "}
                          {formatMoney(
                            item.unitPrice,
                            order.currency
                          )}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        {formatMoney(
                          Number(
                            item.unitPrice ||
                              0
                          ) *
                            Number(
                              item.quantity ||
                                0
                            ),
                          order.currency
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.025] px-4 py-4">
                <span className="text-sm text-white/50">
                  Total
                </span>

                <span className="text-lg font-bold">
                  {formatMoney(
                    order.amount,
                    order.currency
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* PAYMENT */}
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">
              Payment
            </h2>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-2">
              <Detail
                label="Status"
                value={
                  <StatusBadge
                    status={
                      order.status
                    }
                  />
                }
              />

              <Detail
                label="Channel"
                value={
                  order.paymentChannel ||
                  "—"
                }
              />

              <Detail
                label="Paystack Reference"
                value={
                  order.reference ||
                  "—"
                }
                mono
              />

              <Detail
                label="Transaction ID"
                value={
                  order.paystackTransactionId ||
                  "—"
                }
                mono
              />

              <Detail
                label="Paid At"
                value={formatDate(
                  order.paidAt
                )}
              />

              <Detail
                label="Fulfilled At"
                value={formatDate(
                  order.fulfilledAt
                )}
              />
            </div>
          </section>

          {/* ACTIONS */}
          {canFulfill && (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-red-500/10 bg-red-500/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Ready for fulfilment
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Mark this order as
                  fulfilled after the
                  customer receives the
                  order.
                </p>
              </div>

              <button
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  onUpdateStatus(
                    order,
                    "fulfilled"
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Truck size={16} />
                )}
                Mark Fulfilled
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  mono = false,
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] uppercase tracking-wider text-white/30">
        {label}
      </p>

      <div
        className={`break-words text-sm text-white/80 ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value || "—"}
      </div>
    </div>
  );
}