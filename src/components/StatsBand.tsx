"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteConfig } from "@/lib/data";
import { fadeUp } from "@/lib/motion";

/** Quiet trust line — not a dashboard stat strip. */
export function StatsBand() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section
      ref={ref}
      className="relative border-y border-white/[0.06] bg-black py-10 md:py-12"
    >
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 sm:flex-row sm:items-center"
      >
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400 md:text-[15px]">
          Based at{" "}
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-[#c9a227]"
          >
            {siteConfig.address}
          </a>
          . Ceramic, PPF, tint, and wraps for Norfolk County and surrounding areas.
        </p>
        <a
          href={siteConfig.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white"
        >
          <span className="font-display text-lg font-semibold tracking-tight text-[#e8c547]">
            5.0
          </span>
          <span className="h-3 w-px bg-white/15" aria-hidden />
          <span className="text-xs uppercase tracking-[0.22em] text-zinc-500 transition-colors group-hover:text-zinc-300">
            Google reviews
          </span>
        </a>
      </motion.div>
    </section>
  );
}
