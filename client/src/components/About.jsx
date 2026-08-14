import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ImageWithPlaceholder from "./ImageWithPlaceholder";

const tags = ["#Spectacular", "#Specific", "#Special"];

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="about"
      className="w-full bg-neutral-950 py-20 sm:py-24 lg:py-28"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-primary-500" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">
            About Us
          </span>
        </motion.div>

        <div
          ref={ref}
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
              <ImageWithPlaceholder
                src="/images/spec-team.png"
                alt="Spec360 team"
                className="h-full w-full object-cover"
                placeholderText="Our Team"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                inView
                  ? { opacity: 1, scale: 1 }
                  : {}
              }
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-5 right-3 rounded-2xl bg-primary-500 px-5 py-4 text-white shadow-glow sm:-right-4"
            >
              <div className="font-heading text-3xl font-bold leading-none">
                360°
              </div>
              <div className="mt-1 text-sm text-white/80">
                Full Coverage
              </div>
            </motion.div>
          </motion.div>

          <div className="space-y-7">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.35rem]"
            >
              Where Hardware Meets{" "}
              <span className="text-primary-500">Software</span>{" "}
              Meets Service
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="space-y-4 text-base leading-7 text-neutral-400"
            >
              <p>
                Spec360 Communication operates at the intersection of hardware, software, and service — providing smartphones, accessories, professional repairs, tech support, and full-stack web development.
              </p>
              <p>
                Beyond devices, we design and build scalable web solutions with more real-world projects continuously in development.
              </p>
              <p>
                Our 360-degree understanding means we don't just offer tools — we make them work better for people and businesses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-5"
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="font-heading text-lg font-semibold text-primary-400"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
