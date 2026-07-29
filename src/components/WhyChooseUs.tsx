"use client";

import { motion } from "framer-motion";
import { whyChooseUs } from "@/lib/data";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function WhyChooseUs() {
  return (
    <section id="why-us" className="relative border-y border-white/[0.06] py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          className="mb-14 max-w-2xl md:mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium uppercase tracking-[0.35em] text-[#c9a227]"
          >
            Why Shade & Shine
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl"
          >
            Why choose us
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-lg leading-relaxed text-zinc-400">
            Quality work, careful process, and local service you can count on.
          </motion.p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {whyChooseUs.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-display text-sm tabular-nums text-[#c9a227]/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
