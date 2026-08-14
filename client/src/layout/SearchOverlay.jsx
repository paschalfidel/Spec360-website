import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button, Input } from "../components/ui";
import { routes } from "../config";

export default function SearchOverlay({
  open,
  onClose,
  onSearch,
  results = [],
}) {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    if (typeof onSearch === "function") {
      onSearch(trimmedQuery);
    } else {
      navigate(`${routes.shop}?search=${encodeURIComponent(trimmedQuery)}`);
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-neutral-950/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mx-auto w-full max-w-4xl px-5 py-6 md:px-8">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xl font-bold text-white">
                Spec<span className="text-primary-500">360</span>
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close search"
                className="!h-10 !w-10 !rounded-full !p-0"
              >
                <X size={20} />
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-20"
            >
              <p className="text-sm font-medium uppercase tracking-wider text-primary-400">
                Search Spec360
              </p>

              <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-5xl">
                What are you looking for?
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={(event) =>
                      setQuery(event.target.value)
                    }
                    placeholder="Search phones, accessories, repairs..."
                    leftIcon={Search}
                    rightIcon={ArrowRight}
                    aria-label="Search products and services"
                    className="!h-14 !rounded-2xl !text-base"
                  />
                </div>
              </form>

              {results.length > 0 && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
                  {results.map((result) => (
                    <Link
                      key={result.id ?? result.href}
                      to={result.href ?? routes.shop}
                      onClick={onClose}
                      className="flex items-center justify-between border-b border-white/10 px-5 py-4 last:border-b-0 hover:bg-white/5"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {result.title}
                        </p>

                        {result.description && (
                          <p className="mt-1 text-sm text-neutral-500">
                            {result.description}
                          </p>
                        )}
                      </div>

                      <ArrowRight
                        size={17}
                        className="text-neutral-500"
                      />
                    </Link>
                  ))}
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900 p-8 text-center">
                  <p className="font-medium text-white">
                    No results found
                  </p>

                  <p className="mt-2 text-sm text-neutral-500">
                    Try another search term.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}