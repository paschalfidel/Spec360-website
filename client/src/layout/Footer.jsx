import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

import { Container } from "../components/ui";
import { navigation, site, social, routes } from "../config";

const serviceLinks = [
  {
    label: "Smartphones",
    href: routes.shop,
  },
  {
    label: "Accessories",
    href: routes.shop,
  },
  {
    label: "Phone Repairs",
    href: routes.repairs,
  },
  {
    label: "Connectivity",
    href: routes.connectivity,
  },
  {
    label: "Web Development",
    href: routes.webDevelopment,
  },
  {
    label: "POS Services",
    href: routes.pos,
  },
  {
    label: "Logistics",
    href: routes.logistics,
  },
];

const companyLinks = navigation.filter(
  (item) =>
    ![
      routes.shop,
      routes.repairs,
      routes.connectivity,
      routes.webDevelopment,
    ].includes(item.href)
);

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-neutral-950">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              to={routes.home}
              className="inline-flex items-center gap-3"
              aria-label="Spec360 Communication home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 font-heading text-lg font-bold text-white">
                S
              </span>

              <span className="font-heading text-xl font-bold text-white">
                Spec<span className="text-primary-500">360</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-400">
              {site.description}
            </p>

            <div className="mt-6 flex items-center gap-2">
              {Object.entries(social ?? {}).map(
                ([key, href]) => {
                  if (!href) return null;

                  const Icon = socialIcons[key];

                  if (!Icon) return null;

                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Spec360 on ${key}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-all duration-200 hover:border-primary-500/40 hover:bg-primary-500/10 hover:text-primary-400"
                    >
                      <Icon size={17} />
                    </a>
                  );
                }
              )}
            </div>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h2>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h2>

            <ul className="mt-5 space-y-3">
              {serviceLinks.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    to={item.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h2>

            <div className="mt-5 space-y-4">
              {site.address && (
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-primary-500"
                  />

                  <span className="text-sm leading-6 text-neutral-400">
                    {site.address}
                  </span>
                </div>
              )}

              {site.phone && (
                <a
                  href={`tel:${site.phone}`}
                  className="flex items-center gap-3 text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  <Phone
                    size={18}
                    className="shrink-0 text-primary-500"
                  />

                  {site.phone}
                </a>
              )}

              {site.email && (
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 break-all text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  <Mail
                    size={18}
                    className="shrink-0 text-primary-500"
                  />

                  {site.email}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col gap-4 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                to="/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="transition-colors hover:text-white"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}