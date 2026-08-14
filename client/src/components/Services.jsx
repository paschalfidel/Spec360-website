import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Code,
  CreditCard,
  Smartphone,
  Truck,
  Wifi,
  Wrench,
} from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Phones & Accessories",
    description:
      "Brand-new phones, UK-used devices, and a wide range of genuine accessories.",
    link: "/services/phones-accessories",
  },
  {
    icon: Wrench,
    title: "Phone Repairs",
    description:
      "Expert repairs: screen replacement, battery, water damage, and software fixes.",
    link: "/services/repairs",
  },
  {
    icon: Code,
    title: "Web Development",
    description:
      "Modern, scalable websites and web applications tailored to your business goals.",
    link: "/services/web-development",
  },
  {
    icon: CreditCard,
    title: "POS Services",
    description:
      "Streamlined payment solutions and easy utility bill payments at your fingertips.",
    link: "/services/pos",
  },
  {
    icon: Wifi,
    title: "Connectivity",
    description:
      "Reliable internet connectivity and IT infrastructure for seamless operations.",
    link: "/services/connectivity",
  },
  {
    icon: Truck,
    title: "Logistics",
    description:
      "Safe, timely device and package delivery — local and interstate.",
    link: "/services/logistics",
  },
];

function ServiceTile({ service, index, inView }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link
        to={service.link}
        className="group block h-full"
      >
        <div className="relative flex h-full min-h-[270px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-500/25 hover:shadow-card">
          <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-primary-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10 flex h-full flex-col gap-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500 transition-all duration-300 group-hover:bg-primary-500 group-hover:text-white group-hover:scale-105">
              <Icon size={24} strokeWidth={1.7} />
            </div>

            <div className="flex-1">
              <h3 className="font-heading text-lg font-semibold tracking-tight text-white">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-neutral-400">
                {service.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-primary-400 opacity-0 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100">
              Learn more
              <ArrowUpRight size={15} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Services() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.06,
  });

  return (
    <section
      id="services"
      className="w-full bg-neutral-950 py-20 sm:py-24 lg:py-28"
    >
      <div className="container">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end lg:mb-14">
          <div>
            <div className="mb-3.5 flex items-center gap-3">
              <span className="h-px w-8 bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">
                What We Do
              </span>
            </div>

            <h2 className="font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Six Ways We{" "}
              <span className="text-primary-500">Serve</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-neutral-500 md:max-w-xs">
            From devices to connectivity to digital products — we cover every angle.
          </p>
        </div>

        <div
          ref={ref}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <ServiceTile
              key={service.title}
              service={service}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
