import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Badge, Button, Container } from "../components/ui";
import { navigation, routes } from "../config";

const getNavClass = ({ isActive }) =>
  [
    "relative py-2 text-sm font-medium transition-colors duration-200",
    isActive
      ? "text-white"
      : "text-neutral-400 hover:text-white",
  ].join(" ");

export default function Navbar({
  cartCount = 0,
  onSearch,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Route changes must close the mobile navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const handleSearch = () => {
    if (typeof onSearch === "function") {
      onSearch();
      return;
    }

    window.dispatchEvent(new CustomEvent("spec360:open-search"));
  };

  return (
    <>
      <header
        className={[
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-neutral-950/90 shadow-lg backdrop-blur-xl"
            : "border-b border-transparent bg-neutral-950",
        ].join(" ")}
      >
        <Container>
          <nav
            aria-label="Main navigation"
            className="flex h-[76px] items-center justify-between gap-6"
          >
            {/* Logo */}
            <Link
              to="/"
              aria-label="Spec360 Communication home"
              className="group flex shrink-0 items-center"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-glow transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/images/spec360-logo.PNG"
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-contain p-1"
                  />
                </div>

                <div className="hidden leading-none sm:block">
                  <span className="block font-heading text-lg font-bold tracking-tight text-white">
                    Spec<span className="text-primary-500">360</span>
                  </span>

                  <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Communication
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-7 lg:flex">
              {navigation.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={getNavClass}
                >
                  {({ isActive }) => (
                    <>
                      {item.label}

                      {isActive && (
                        <motion.span
                          layoutId="spec360-active-nav"
                          className="absolute -bottom-[9px] left-0 right-0 h-0.5 rounded-full bg-primary-500"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearch}
                aria-label="Search Spec360"
                className="!h-10 !w-10 !rounded-full !p-0"
              >
                <Search size={19} />
              </Button>

              <Link
                to="/cart"
                aria-label={
                  cartCount > 0
                    ? `Shopping cart with ${cartCount} items`
                    : "Shopping cart"
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <ShoppingCart size={19} />

                {cartCount > 0 && (
                  <Badge
                    variant="primary"
                    className="absolute -right-1 -top-1 min-w-5 justify-center !px-1.5 !py-0.5 text-[10px]"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Link>


              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="spec360-mobile-menu"
                className="!h-10 !w-10 !rounded-full !p-0 lg:hidden"
              >
                <Menu size={21} />
              </Button>
            </div>
          </nav>
        </Container>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              id="spec360-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{
                opacity: 0,
                x: "100%",
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-[min(88vw,380px)] flex-col border-l border-white/10 bg-neutral-950 shadow-2xl lg:hidden"
            >
              <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-5">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-lg font-bold text-white"
                >
                  Spec<span className="text-primary-500">360</span>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="!h-10 !w-10 !rounded-full !p-0"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <div className="flex flex-col gap-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        [
                          "flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors",
                          isActive
                            ? "bg-primary-500/10 text-primary-400"
                            : "text-neutral-300 hover:bg-white/5 hover:text-white",
                        ].join(" ")
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                <div className="my-6 h-px bg-white/10" />

                <div className="flex flex-col gap-2">
                  <Link
                    to="/cart"
                    className="flex min-h-12 items-center justify-between rounded-xl px-4 text-base font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingCart size={19} />
                      Cart
                    </span>

                    {cartCount > 0 && (
                      <Badge variant="primary">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-left text-base font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Search size={19} />
                    Search
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 p-5">
                <Link
                  to={routes.contact}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary-500 px-5 font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  Contact Spec360
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}