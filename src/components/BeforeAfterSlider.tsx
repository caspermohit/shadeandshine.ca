"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { GripVertical } from "lucide-react";
import { beforeAfterProjects } from "@/lib/data";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  title: string;
  vehicle: string;
  service: string;
  /** Slow continuous L→R sweep; pauses while user drags */
  autoPlay?: boolean;
  durationMs?: number;
}

export function BeforeAfterSlider({
  before,
  after,
  title,
  vehicle,
  service,
  autoPlay = true,
  durationMs = 9000,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.35 });
  const [position, setPosition] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [paused, setPaused] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  // Slow left → right loop when in view and not dragging
  useEffect(() => {
    if (!autoPlay || !inView || isDragging || paused) return;

    let raf = 0;
    let last = performance.now();
    const speed = 96 / (durationMs / 1000); // % per second across ~2→98

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setPosition((prev) => {
        const next = prev + speed * dt;
        return next >= 98 ? 2 : next;
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoPlay, inView, isDragging, paused, durationMs]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setPaused(true);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    // Resume auto after a short beat
    window.setTimeout(() => setPaused(false), 1800);
  };

  return (
    <div className="group">
      <div
        ref={containerRef}
        className="relative aspect-[16/10] cursor-col-resize select-none overflow-hidden border border-white/10"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${after})` }}
        />

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${before})`,
            clipPath: `inset(0 ${100 - position}% 0 0)`,
          }}
        />

        <div
          className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
          style={{ left: `${position}%` }}
        >
          <div
            className={cn(
              "absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#c9a227] shadow-lg transition-transform",
              isDragging && "scale-110"
            )}
          >
            <GripVertical className="h-4 w-4 text-black" />
          </div>
        </div>

        <div className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          Before
        </div>
        <div className="pointer-events-none absolute top-4 right-4 rounded-full bg-[#c9a227]/80 px-3 py-1 text-xs font-medium text-black backdrop-blur-sm">
          After
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-zinc-500">
          {vehicle}, {service}
        </p>
      </div>
    </div>
  );
}

export function TransformationsSection() {
  return (
    <section id="transformations" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,162,39,0.06),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-2xl md:mb-20"
        >
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-[#c9a227]">
            Results That Speak
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
            See the Transformation
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            Watch the line sweep, or drag it yourself.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {beforeAfterProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <BeforeAfterSlider
                before={project.before}
                after={project.after}
                title={project.title}
                vehicle={project.vehicle}
                service={project.service}
                durationMs={6500 + i * 900}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
