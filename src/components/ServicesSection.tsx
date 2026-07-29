"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { services } from "@/lib/data";
import { easeOutExpo, fadeUp, staggerContainer } from "@/lib/motion";

export function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <section id="services" ref={ref} className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.06),transparent_55%)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16 max-w-2xl md:mb-20"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium uppercase tracking-[0.35em] text-[#c9a227]"
          >
            What We Do Best
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl"
          >
            Our Services
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-lg leading-relaxed text-zinc-400">
            From deep detailing to long-lasting ceramic protection. Every finish is
            built for Norfolk roads and showroom light.
          </motion.p>
        </motion.div>

        <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {services.map((service, i) => (
            <motion.a
              key={service.id}
              href="#contact"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.75, ease: easeOutExpo }}
              className="group relative flex flex-col gap-5 py-8 transition-colors md:flex-row md:items-center md:gap-10 md:py-10"
            >
              <div className="relative flex items-center gap-4 md:w-72 md:shrink-0">
                <span className="font-display text-sm tabular-nums text-[#c9a227]/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-[#e8c547] md:text-2xl">
                  {service.title}
                </h3>
              </div>

              <p className="relative max-w-xl flex-1 text-[15px] leading-relaxed text-zinc-400">
                {service.description}
              </p>

              <span className="relative inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors group-hover:text-[#e8c547] md:ml-auto">
                Inquire
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
