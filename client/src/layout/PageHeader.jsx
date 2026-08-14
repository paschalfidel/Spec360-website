import { motion } from "framer-motion";
import { Container } from "../components/ui";
import { fadeUp } from "../utils";

export default function PageHeader({
  title,
  description,
  children,
}) {
  return (
    <section className="border-b border-white/10 bg-neutral-950">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="py-20"
        >
          <h1 className="text-4xl font-bold text-white lg:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-400">
              {description}
            </p>
          )}

          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}