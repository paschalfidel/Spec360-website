import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Check,
  CreditCard,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";

import {
  Container,
  EmptyState,
  Section,
} from "../components/ui";

import { Button } from "../components/ui";
import { Price } from "../components/products";
import { initializeOrder, verifyOrderPayment } from "../services/api";

const STORE_ROUTE =
  "/services/phones-accessories";

const WHATSAPP_NUMBER =
  "2348182799154";

/* Legacy Paystack loader removed: payment is now initialized and verified server-side. */
function formatCurrency(amount) {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      currencyDisplay: "symbol",
      maximumFractionDigits: 0,
    }
  ).format(Number(amount) || 0);
}

function CheckoutModal({
  total,
  cartItems,
  onClose,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [paying, setPaying] =
    useState(false);

  const [error, setError] =
    useState("");

  const updateField = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePay = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    ) {
      setError(
        "Please fill in all customer details."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }


    setPaying(true);

    try {
      const response = await initializeOrder({
        customer: { name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim() },
        items: cartItems.map((item) => ({ productId: item._id, quantity: Number(item.quantity) })),
        callbackUrl: `${window.location.origin}/cart?payment=success`,
      });
      const authorizationUrl = response.data?.data?.authorizationUrl;
      if (!authorizationUrl) throw new Error("Payment session could not be created.");
      window.location.assign(authorizationUrl);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to start payment. Please try again.");
      setPaying(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 24,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 24,
          scale: 0.98,
        }}
        transition={{
          duration: 0.25,
        }}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-card"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">
              Secure Checkout
            </p>

            <h2
              id="checkout-title"
              className="mt-1 font-heading text-2xl font-bold text-white"
            >
              Complete your order
            </h2>

            <div className="mt-2">
              <Price
                amount={total}
                currency="NGN"
                size="md"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={paying}
            aria-label="Close checkout"
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handlePay}
          className="space-y-5 p-6 sm:p-8"
        >
          <CheckoutField
            label="Full name"
            name="name"
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={(value) =>
              updateField(
                "name",
                value
              )
            }
          />

          <CheckoutField
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(value) =>
              updateField(
                "email",
                value
              )
            }
          />

          <CheckoutField
            label="Phone number"
            name="phone"
            type="tel"
            placeholder="080XXXXXXXX"
            value={form.phone}
            onChange={(value) =>
              updateField(
                "phone",
                value
              )
            }
          />

          {error && (
            <div
              role="alert"
              className="flex gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            loading={paying}
            disabled={paying}
            className="w-full"
          >
            {!paying && (
              <CreditCard
                size={18}
              />
            )}

            {paying
              ? "Opening payment..."
              : `Pay ${formatCurrency(
                  total
                )}`}
          </Button>

          <div className="flex items-center justify-center gap-2 text-center text-xs text-neutral-600">
            <ShieldCheck
              size={14}
              className="text-success"
            />

            <span>
              Secure payment powered by
              Paystack
            </span>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function CheckoutField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <label
      htmlFor={name}
      className="block"
    >
      <span className="mb-2 block text-sm font-medium text-neutral-300">
        {label}
      </span>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        autoComplete={
          name === "name"
            ? "name"
            : name === "email"
              ? "email"
              : "tel"
        }
        className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 text-sm text-white outline-none transition-all placeholder:text-neutral-700 focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/10"
        required
      />
    </label>
  );
}

function SuccessScreen({
  reference,
}) {
  const whatsappText =
    `Hello Spec360, I just completed a payment. My transaction reference is ${reference}. Please confirm my order.`;

  return (
    <Section className="min-h-[75vh] flex items-center">
      <Container>
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-neutral-900 p-8 text-center shadow-card sm:p-12"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <Check
              size={38}
              className="text-success"
            />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-success">
            Payment initiated
          </p>

          <h1 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
            Thank you for your order
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-400 sm:text-base">
            Your Paystack transaction was
            completed on this device. Spec360
            will contact you to confirm your
            order and delivery details.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-neutral-950 p-4">
            <p className="text-xs uppercase tracking-wider text-neutral-600">
              Transaction reference
            </p>

            <p className="mt-2 break-all font-mono text-sm text-neutral-300">
              {reference}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to={STORE_ROUTE}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white shadow-[0_0_30px_rgba(225,6,0,.25)] transition-all hover:-translate-y-0.5 hover:bg-primary-600"
            >
              Continue Shopping
            </Link>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                whatsappText
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Confirm on WhatsApp
            </a>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

function QuantityControl({
  quantity,
  stock,
  onDecrease,
  onIncrease,
}) {
  return (
    <div className="flex items-center rounded-xl border border-white/10 bg-neutral-950 p-1">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-25"
      >
        <Minus size={15} />
      </button>

      <span
        className="flex h-9 min-w-10 items-center justify-center px-1 text-sm font-semibold text-white"
        aria-live="polite"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={
          quantity >= stock
        }
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-25"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function CartItem({
  item,
  onRemove,
  onDecrease,
  onIncrease,
}) {
  const lineTotal =
    Number(item.price || 0) *
    Number(item.quantity || 0);

  const stock =
    Number(item.stock ?? Infinity);

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        height: 0,
        marginBottom: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        {/* Image */}
        <Link
          to={`/product/${item._id}`}
          className="group shrink-0"
          aria-label={`View ${item.name}`}
        >
          <div className="h-24 w-24 overflow-hidden rounded-xl bg-neutral-800 sm:h-28 sm:w-28">
            <ImageWithPlaceholder
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Product */}
        <div className="min-w-0 flex-1">
          <Link
            to={`/product/${item._id}`}
            className="block"
          >
            <h2 className="line-clamp-2 font-heading text-base font-semibold text-white transition-colors hover:text-primary-400">
              {item.name}
            </h2>
          </Link>

          <Price
            amount={item.price}
            currency="NGN"
            size="sm"
            className="mt-2"
          />

          <p className="mt-1 text-xs text-neutral-600">
            {stock === Infinity
              ? "Available"
              : `${stock} in stock`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <QuantityControl
            quantity={item.quantity}
            stock={stock}
            onDecrease={
              onDecrease
            }
            onIncrease={
              onIncrease
            }
          />

          <div className="flex items-center gap-4">
            <Price
              amount={lineTotal}
              currency="NGN"
              size="sm"
            />

            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${item.name} from cart`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5 text-red-400 transition-colors hover:border-red-500/20 hover:bg-red-500/10"
            >
              <Trash2
                size={16}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const [
    showCheckout,
    setShowCheckout,
  ] = useState(false);

  const [
    paidRef,
    setPaidRef,
  ] = useState(null);

  const [paymentError, setPaymentError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const totalItems =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0),
      0
    );

  useEffect(() => {
    if (!showCheckout) {
      document.body.style.overflow =
        "";
      return undefined;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [showCheckout]);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const reference = searchParams.get("reference");
    if (payment !== "success" || !reference || paidRef) return;
    let active = true;
    verifyOrderPayment(reference).then((response) => {
      if (!active) return;
      const payment = response.data?.data;
      if (payment?.status !== "paid") {
        throw new Error(`Payment is ${payment?.status || "not confirmed"}.`);
      }
      clearCart();
      setPaidRef(payment.reference || reference);
      setSearchParams({}, { replace: true });
    }).catch((error) => {
      if (!active) return;
      setPaymentError(error.response?.data?.message || "We could not verify this payment. Please contact Spec360 with your payment reference.");
      setSearchParams({}, { replace: true });
    });
    return () => { active = false; };
  }, [searchParams, paidRef, clearCart, setSearchParams]);

  if (paidRef) {
    return (
      <SuccessScreen
        reference={paidRef}
      />
    );
  }

  if (cart.length === 0) {
    return (
      <Section className="min-h-[70vh] flex items-center">
        <Container>
          <EmptyState
            icon="cart"
            title="Your cart is empty"
            description="You haven't added anything to your cart yet. Browse the Spec360 store and find something you need."
            action={
              <Link
                to={STORE_ROUTE}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white shadow-[0_0_30px_rgba(225,6,0,.25)] transition-all hover:-translate-y-0.5 hover:bg-primary-600"
              >
                Browse Products
              </Link>
            }
          />
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section className="min-h-[75vh] pt-28 lg:pt-32">
        <Container>
          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">
              Spec360 Store
            </p>

            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Your Cart
              <span className="ml-3 text-lg font-medium text-neutral-600 sm:text-xl">
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
              Review your selected products
              before completing your purchase.
            </p>
          </motion.div>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Cart items */}
            <div className="min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-white">
                  Items
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-medium text-neutral-600 transition-colors hover:text-red-400"
                >
                  Clear cart
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {cart.map(
                    (item) => (
                      <CartItem
                        key={
                          item._id
                        }
                        item={item}
                        onRemove={() =>
                          removeFromCart(
                            item._id
                          )
                        }
                        onDecrease={() =>
                          updateQuantity(
                            item._id,
                            item.quantity -
                              1
                          )
                        }
                        onIncrease={() =>
                          updateQuantity(
                            item._id,
                            item.quantity +
                              1
                          )
                        }
                      />
                    )
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28">
              <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-card sm:p-7">
                <h2 className="font-heading text-xl font-bold text-white">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4 border-b border-white/10 pb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">
                      Items
                    </span>

                    <span className="font-medium text-neutral-300">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">
                      Subtotal
                    </span>

                    <Price
                      amount={subtotal}
                      currency="NGN"
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">
                      Delivery
                    </span>

                    <span className="text-right text-xs text-neutral-600">
                      Calculated later
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-4 py-6">
                  <span className="font-medium text-neutral-400">
                    Total
                  </span>

                  <Price
                    amount={subtotal}
                    currency="NGN"
                    size="xl"
                  />
                </div>

                <Button
                  type="button"
                  size="lg"
                  onClick={() =>
                    setShowCheckout(
                      true
                    )
                  }
                  className="w-full"
                >
                  <CreditCard
                    size={18}
                  />
                  Proceed to Payment
                </Button>

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/5 bg-neutral-950/70 p-4">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-success"
                  />

                  <p className="text-xs leading-5 text-neutral-600">
                    Secure payment through
                    Paystack. Delivery fees are
                    confirmed with you separately
                    through WhatsApp.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal
            total={subtotal}
            cartItems={cart}
            onClose={() => setShowCheckout(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}