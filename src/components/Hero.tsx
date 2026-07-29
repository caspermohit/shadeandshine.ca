"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { MagneticButton } from "@/components/MagneticButton";
import { BrandLogo } from "@/components/BrandLogo";
import { easeOutExpo, fadeUp, staggerContainer } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-black"
    >
      {/* Full-bleed cinematic plane */}
      <motion.div className="absolute inset-0" style={{ y: mediaY, scale: mediaScale }}>
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/brand/hero-poster.jpg"
          aria-hidden
        >
          <source src="/brand/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-vignette absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(255,255,255,0.06),transparent_50%)]" />
        <div className="noise-overlay absolute inset-0 opacity-[0.22]" />
      </motion.div>

      {/* Ambient gold + cool rim */}
      <div className="pointer-events-none absolute -left-1/4 bottom-0 h-[55%] w-[70%] rounded-full bg-[#c9a227]/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-1/4 top-1/4 h-[40%] w-[45%] rounded-full bg-[#0090ff]/08 blur-[100px]" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-32 md:pb-24"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.div
            variants={fadeUp}
            className="w-full max-w-[min(92vw,28rem)] md:max-w-[36rem]"
          >
            <BrandLogo fluid priority />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-base leading-relaxed text-zinc-300 md:text-lg"
          >
            Ceramic, PPF, tint, and wraps. Finished in Norfolk County.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="#book"
              className="group inline-flex items-center gap-3 rounded-full bg-[#c9a227] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#e8c547]"
            >
              Book Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              href="#ppf"
              strength={0.22}
              className="inline-flex items-center text-sm font-medium tracking-wide text-zinc-300 transition-colors hover:text-white"
            >
              Explore PPF
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.1, duration: 1.1, ease: easeOutExpo }}
          className="mt-14 h-px origin-left bg-gradient-to-r from-[#c9a227]/50 via-white/10 to-transparent"
        />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 right-6 hidden items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-zinc-500 md:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-[#e8c547]"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
