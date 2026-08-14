import { motion } from "framer-motion";
import { fadeUp } from "../../utils";
import { cn } from "../../utils";

export default function Section({
  children,
  className,
  id,
}) {
  return (
    <motion.section
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      className={cn(
        "py-20 lg:py-28",
        className
      )}
    >
      {children}
    </motion.section>
  );
}