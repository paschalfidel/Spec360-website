import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button, Container } from "../ui";
import { routes } from "../../config";

const benefits = [
  {
    icon: ShieldCheck,
    text: "Quality products",
  },
  {
    icon: Smartphone,
    text: "Tech solutions",
  },
  {
    icon: Headphones,
    text: "Reliable support",
  },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-950">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-primary-500/5 blur-3xl"
      />

      <Container>
        <div className="grid min-h-[calc(100vh-116px)] items-center gap-14 py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-400">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              Your technology partner
            </div>

            <h1 className="mt-7 max-w-4xl font-heading text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Technology that works
              <span className="block text-primary-500">
                for you.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-400 md:text-xl">
              Smartphones, accessories, repairs, connectivity
              solutions and digital technology services —
              all from one trusted Nigerian technology brand.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to={routes.shop}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Explore Products
                  <ArrowRight size={18} />
                </Button>
              </Link>

              <Link to={routes.repairs}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Book a Repair
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.text}
                    className="flex items-center gap-2.5 text-sm text-neutral-300"
                  >
                    <Icon
                      size={18}
                      className="shrink-0 text-primary-500"
                    />

                    <span>{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              x: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="relative aspect-square overflow-hidden rounded-[40px] border border-white/10 bg-neutral-900 shadow-2xl">
              {/* Replace this background with the final Spec360 hero artwork */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-neutral-900 to-neutral-950" />

              <div className="absolute inset-8 rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-sm" />

              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-[30px] bg-primary-500 shadow-[0_20px_70px_rgba(0,0,0,.4)]">
                  <Smartphone
                    size={56}
                    strokeWidth={1.5}
                    className="text-white"
                  />
                </div>

                <p className="mt-7 font-heading text-2xl font-bold text-white">
                  Spec<span className="text-primary-500">360</span>
                </p>

                <p className="mt-2 text-sm text-neutral-400">
                  Technology made simple.
                </p>
              </div>

              <div className="absolute left-6 top-8 rounded-2xl border border-white/10 bg-neutral-950/80 px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-primary-500"
                  />

                  <span className="text-xs font-medium text-white">
                    Trusted technology
                  </span>
                </div>
              </div>

              <div className="absolute bottom-8 right-6 rounded-2xl border border-white/10 bg-neutral-950/80 px-4 py-3 backdrop-blur-md">
                <p className="text-xs text-neutral-500">
                  Serving Nigeria
                </p>

                <p className="mt-1 font-semibold text-white">
                  Digital • Mobile • Tech
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}