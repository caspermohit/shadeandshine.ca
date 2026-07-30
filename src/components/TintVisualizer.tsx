"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { tintLevels } from "@/lib/data";
import { cn } from "@/lib/utils";

export function TintVisualizer() {
  const [activeId, setActiveId] = useState("medium-35");
  const active = tintLevels.find((t) => t.id === activeId) ?? tintLevels[2];

  return (
    <section id="tint" className="relative overflow-x-clip bg-black py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(201,162,39,0.08),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-2xl md:mb-20"
        >
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-[#c9a227]">
            Window Tint Studio
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
            Dial in your shade
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            Pick a VLT level and watch only the glass go from clear to limo black.
            Body paint stays untouched.
          </p>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative order-2 lg:order-1">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                {active.name}
              </h3>
              <p className="mt-3 text-lg text-[#e8c547]">{active.label}</p>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-300">
                {active.description}
              </p>

              <div className="mt-8 max-w-sm">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-500">
                  <span>Clear</span>
                  <span>Limo</span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-zinc-400 via-zinc-700 to-black"
                    animate={{ width: `${100 - active.vlt}%` }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  />
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  {active.vlt}% visible light transmission
                </p>
              </div>

              <a
                href="#contact"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-[#e8c547]"
              >
                Get a Tint Quote
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative mx-auto aspect-square max-w-xl isolate bg-[#1c1c1c]">
              {tintLevels.map((level) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={level.id}
                  src={level.image}
                  alt={level.id === active.id ? `${level.name} window tint on SUV` : ""}
                  className={cn(
                    "absolute inset-0 z-0 h-full w-full object-contain transition-opacity duration-300",
                    level.id === active.id ? "opacity-100" : "pointer-events-none opacity-0"
                  )}
                  draggable={false}
                />
              ))}

              <div className="absolute bottom-3 left-3 z-10 border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                  Glass only
                </p>
                <p className="text-sm font-semibold text-white">{active.label}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {tintLevels.map((level) => {
                const selected = level.id === activeId;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setActiveId(level.id)}
                    className={cn(
                      "group relative overflow-hidden border px-2 py-3 text-left transition-colors",
                      selected
                        ? "border-[#c9a227]/50 bg-[#c9a227]/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                    )}
                  >
                    <span
                      className="mb-2 block h-2 w-full rounded-full"
                      style={{
                        backgroundColor: `rgb(${Math.round(level.vlt * 1.8)}, ${Math.round(level.vlt * 1.8)}, ${Math.round(level.vlt * 1.85)})`,
                      }}
                      aria-hidden
                    />
                    <span className="block text-xs font-semibold text-white">
                      {level.vlt}%
                    </span>
                    <span className="mt-0.5 block text-[10px] text-zinc-500">
                      {level.name.replace(" Tint", "")}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-center text-[11px] tracking-wide text-zinc-600">
              Black film on glass only. Legal VLT varies by vehicle and province.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
