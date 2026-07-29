"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Palette } from "lucide-react";
import { wrapColors } from "@/lib/data";
import { cn } from "@/lib/utils";

export function WrapStudio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = wrapColors[activeIndex];

  const navigate = (dir: number) => {
    setActiveIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return wrapColors.length - 1;
      if (next >= wrapColors.length) return 0;
      return next;
    });
  };

  const selectColor = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section id="wrap-studio" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(201,162,39,0.06),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#c9a227]">
            Interactive Wrap Studio
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Visualize Your <span className="gold-gradient">Dream Wrap</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Same Porsche as our PPF studio, with real baked wrap finishes. Pick a
            color to see gloss, matte, and color-shift vinyl on the car.
          </p>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#050505]">
              {/* Studio floor wash + center glow so light wraps stay visible */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/[0.07] to-transparent" />
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(255,255,255,0.1),transparent_58%)]"
                aria-hidden
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={active.image}
                    alt={`${active.name} vinyl wrap on Porsche`}
                    fill
                    priority={activeIndex === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain object-center p-2 sm:p-4"
                  />
                </motion.div>
              </AnimatePresence>

              {/* White spotlights — reveal wrap color & gloss (screen keeps light wraps visible) */}
              <div className="wrap-spotlights pointer-events-none absolute inset-0" aria-hidden>
                <motion.div
                  className="wrap-spot wrap-spot-key"
                  animate={{ opacity: [0.25, 0.45, 0.25] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="wrap-spot wrap-spot-fill"
                  animate={{ opacity: [0.15, 0.28, 0.15] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                />
                <motion.div
                  className="wrap-spot wrap-spot-rim"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                />
                <div className="wrap-spot wrap-spot-hood" />
              </div>

              {active.shimmer && (
                <motion.div
                  className={cn(
                    "pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay",
                    `bg-gradient-to-r ${active.gradient}`
                  )}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 100%" }}
                />
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + "-badge"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-5 left-5 z-10 rounded-xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full border border-white/20",
                        `bg-gradient-to-br ${active.gradient}`,
                        active.shimmer && "shimmer"
                      )}
                    />
                    <div>
                      <p className="text-sm font-semibold">{active.name}</p>
                      <p className="text-[10px] text-zinc-500">
                        {active.shimmer ? "Color-Shifting Finish" : "Solid Finish"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 transition-colors hover:bg-white/10"
                aria-label="Previous color"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => navigate(1)}
                className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 transition-colors hover:bg-white/10"
                aria-label="Next color"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {wrapColors.map((color, i) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => selectColor(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === activeIndex
                      ? "w-8 bg-[#c9a227]"
                      : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                  )}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-2">
              <Palette className="h-5 w-5 text-[#c9a227]" />
              <h3 className="text-lg font-semibold">Choose Your Finish</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {wrapColors.map((color, i) => (
                <motion.button
                  key={color.id}
                  type="button"
                  onClick={() => selectColor(i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border p-3 text-left transition-all duration-300",
                    i === activeIndex
                      ? "border-[#c9a227]/50 bg-[#c9a227]/5 shadow-lg shadow-[#c9a227]/10"
                      : "border-white/5 bg-[#0c0c12] hover:border-white/10"
                  )}
                >
                  <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-[#0c0c0c]">
                    <div
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,0.14),transparent_62%)]"
                      aria-hidden
                    />
                    <Image
                      src={color.image}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-contain object-center p-1"
                    />
                  </div>
                  <p className="text-sm font-medium">{color.name}</p>
                  <p className="text-[10px] text-zinc-500">
                    {color.shimmer ? "Color-Shift" : "Solid"}
                  </p>

                  {i === activeIndex && (
                    <motion.div
                      layoutId="activeWrap"
                      className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[#c9a227]/40"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h4 className="mb-2 text-sm font-semibold text-[#e8c547]">
                Custom Wrap Consultation
              </h4>
              <p className="text-sm leading-relaxed text-zinc-400">
                Every wrap is custom-fitted to your vehicle. From matte finishes to
                color-shifting chameleon wraps, we bring your vision to life with
                premium vinyl from industry-leading brands.
              </p>
              <a
                href="#contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#c9a227] transition-colors hover:text-[#e8c547]"
              >
                Request a Wrap Quote →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
