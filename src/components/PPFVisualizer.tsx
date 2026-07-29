"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Shield } from "lucide-react";
import { ppfPackages } from "@/lib/data";
import {
  PACKAGE_PANELS,
  PANEL_DIRECTION,
  PANEL_PATHS,
  ROOF_EXTRA_TY,
} from "@/lib/ppf-panels";
import { cn } from "@/lib/utils";

function ShieldRow({ count }: { count: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <Shield key={i} className="h-5 w-5 text-white" strokeWidth={1.5} />
      ))}
    </div>
  );
}

/**
 * Exact CM Auto Detailing visualizer:
 * same Porsche image placement + SVG panel paths + slide/fade on package change.
 */
function CMCoverageCar({ packageId }: { packageId: string }) {
  const active = useMemo(
    () => new Set(PACKAGE_PANELS[packageId] ?? PACKAGE_PANELS.gold),
    [packageId]
  );

  return (
    <div className="ppf-app relative mx-auto w-full">
      {/*
        CM uses a taller SVG frame than the viewBox (meet letterboxing)
        so the car sits with breathing room — matches their bronze/silver shots.
      */}
      <svg
        viewBox="0 0 201.46048 66.655319"
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
        style={{ aspectRatio: "165.46 / 78.66" }}
        role="img"
        aria-label="PPF coverage preview on Porsche"
      >
        <g transform="translate(-4,-192)">
          <image
            href="/ppf-car.png"
            x="0"
            y="0"
            transform="translate(-8,205)"
            width="111%"
            height="111%"
            preserveAspectRatio="xMidYMid meet"
          />

          {Object.entries(PANEL_PATHS).map(([id, d]) => {
            const on = active.has(id);
            const direction = PANEL_DIRECTION[id] ?? "from-left";

            if (id === "roof") {
              return (
                <g key={id} transform={`translate(0, ${ROOF_EXTRA_TY})`}>
                  <path
                    id={id}
                    d={d}
                    className={cn("panel", direction, on && "on")}
                  />
                </g>
              );
            }

            return (
              <path
                key={id}
                id={id}
                d={d}
                className={cn("panel", direction, on && "on")}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export function PPFVisualizer() {
  const [activeId, setActiveId] = useState("bronze");
  const active = ppfPackages.find((p) => p.id === activeId) ?? ppfPackages[0];

  return (
    <section id="ppf" className="relative overflow-x-clip bg-black py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(0,144,255,0.1),transparent_55%)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-2xl md:mb-20"
        >
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-[#0090ff]">
            Paint Protection Film
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
            Choose Your Protection
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            Select a package to see exactly what&apos;s covered. Self-healing XPEL
            film that protects against rock chips and road rash.
          </p>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="relative min-h-[280px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, position: "absolute" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full"
            >
              <h3 className="font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">
                {active.name}
              </h3>

              <p className="mt-4 text-lg text-zinc-200">
                Starting At{" "}
                <span className="font-semibold text-[#0090ff]">
                  ${active.price.toFixed(2)}*
                </span>
              </p>

              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-300">
                {active.description}
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-8">
                {active.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-[15px] text-zinc-200"
                  >
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-[#0090ff]"
                      strokeWidth={2.5}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-base font-semibold tracking-wide text-white">
                {active.film}
              </p>

              <a
                href="#contact"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-zinc-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
              >
                Protect My Vehicle
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </AnimatePresence>
          </div>

          <div className="relative min-w-0">
            <CMCoverageCar packageId={active.id} />
            <p className="mt-3 text-center text-[11px] tracking-wide text-zinc-600">
              Blue areas show film coverage. Pricing varies by vehicle.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ppfPackages.map((pkg) => {
            const isActive = pkg.id === activeId;
            return (
              <motion.button
                key={pkg.id}
                type="button"
                layout
                onClick={() => setActiveId(pkg.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={cn(
                  "group relative flex min-h-[220px] flex-col rounded-2xl bg-[#0c0c0c] p-6 text-left transition-colors duration-300",
                  isActive
                    ? "ring-1 ring-white"
                    : "ring-1 ring-white/10 hover:ring-white/30"
                )}
              >
                <ShieldRow count={pkg.shields} />

                <h4 className="mt-5 text-xl font-bold tracking-tight">
                  {pkg.name}
                </h4>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
                  {pkg.summary}
                </p>

                <div className="mt-5 flex items-end justify-between">
                  <span className="text-xs font-medium text-[#0090ff]">
                    From ${pkg.price.toFixed(0)}
                  </span>
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 transition-all",
                      isActive
                        ? "text-white"
                        : "text-zinc-500 group-hover:translate-x-1 group-hover:text-white"
                    )}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
