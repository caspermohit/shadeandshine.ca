"use client";

import { motion } from "framer-motion";

/**
 * Feynlab-inspired brand / film strip — imagery from feynlab.com
 * + embedded product film for motion presence.
 */
export function FeynlabShowcase() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#050505] py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url(/assets/feynlab/landing.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#c9a227]">
            Feynlab® Certified
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
            Science That Performs
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-zinc-400">
            We install Feynlab ceramic systems. Thick, independently tested coatings
            with extreme gloss, chemical resistance, and self-healing options.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <img
              src="/assets/feynlab/ultra.png"
              alt="Feynlab Ultra V3"
              className="h-28 w-28 object-contain"
            />
            <img
              src="/assets/feynlab/ppf-flex.png"
              alt="Feynlab PPF Flex"
              className="h-28 w-28 object-contain"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] overflow-hidden bg-black sm:aspect-video"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/brand/feynlab-science-poster.jpg"
          >
            <source src="/brand/feynlab-science.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
