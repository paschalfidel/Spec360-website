import {
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Container } from "../ui";

const items = [
  {
    icon: BadgeCheck,
    title: "Quality assured",
    description: "Products selected with care",
  },
  {
    icon: ShieldCheck,
    title: "Trusted service",
    description: "Professional technology support",
  },
  {
    icon: Truck,
    title: "Delivery",
    description: "Convenient delivery options",
  },
  {
    icon: Headphones,
    title: "Customer support",
    description: "We're here when you need us",
  },
];

export default function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-neutral-900/50">
      <Container>
        <div className="grid divide-y divide-white/10 py-2 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 px-4 py-5 sm:px-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10">
                  <Icon
                    size={21}
                    className="text-primary-500"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-xs text-neutral-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}