import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Globe,
  Smartphone,
  Wrench,
  Wifi,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Container, Section } from "../ui";
import { routes } from "../../config";

const services = [
  {
    title: "Smartphones & Accessories",
    description:
      "Discover smartphones, accessories and everyday technology essentials.",
    icon: Smartphone,
    href: routes.shop,
  },
  {
    title: "Phone Repairs",
    description:
      "Professional device diagnosis, repairs and technical support.",
    icon: Wrench,
    href: routes.repairs,
  },
  {
    title: "Connectivity Solutions",
    description:
      "Stay connected with reliable internet and connectivity solutions.",
    icon: Wifi,
    href: routes.connectivity,
  },
  {
    title: "Web Development",
    description:
      "Modern websites and digital experiences for businesses and brands.",
    icon: Globe,
    href: routes.webDevelopment,
  },
];

export default function ServicesPreview() {
  return (
    <Section
      eyebrow="What we do"
      title="Technology solutions for everyday life"
      description="From the device in your hand to the digital experience behind your business, Spec360 helps you get more from technology."
    >
      <Container>
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
              >
                <Link
                  to={service.href}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-neutral-900 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/30 hover:bg-neutral-900/80"
                >
                  <div>
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10">
                        <Icon
                          size={26}
                          className="text-primary-500"
                        />
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-500 transition-colors group-hover:border-primary-500/30 group-hover:text-primary-400">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    <h3 className="mt-7 font-heading text-xl font-semibold text-white">
                      {service.title}
                    </h3>

                    <p className="mt-3 max-w-lg leading-7 text-neutral-400">
                      {service.description}
                    </p>
                  </div>

                  <span className="mt-8 text-sm font-semibold text-primary-400">
                    Learn more
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}