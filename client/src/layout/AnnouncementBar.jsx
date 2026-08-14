import { Megaphone, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "../components/ui";
import site from "../config/site";

export default function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="border-b border-white/10 bg-primary-500"
    >
      <Container>
        <div className="flex h-10 items-center justify-between text-xs font-medium text-white md:text-sm">
          <div className="flex items-center gap-2">
            <Megaphone size={14} />
            <span>
              Free delivery within Owerri on selected products.
            </span>
          </div>

          <a
            href={`tel:${site.phone}`}
            className="hidden items-center gap-2 transition-opacity hover:opacity-80 md:flex"
          >
            <Phone size={14} />
            {site.phone}
          </a>
        </div>
      </Container>
    </motion.div>
  );
}