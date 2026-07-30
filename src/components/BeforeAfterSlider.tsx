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
  /** Smooth back-and-forth sweep while in view */
  autoPlay?: boolean;
  /** Full cycle L→R→L duration */
  durationMs?: number;
  featured?: boolean;
}

export function BeforeAfterSlider({
  before,
  after,
  title,
  vehicle,
  service,
  autoPlay = true,
  durationMs = 7000,
  featured = false,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.3, once: false });
  const [position, setPosition] = useState(12);
  const [isDragging, setIsDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const phaseRef = useRef(0); // 0..1 along sine ping-pong
  const resumeTimer = useRef<number | null>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  // Ping-pong: ease along a sine so the line glides L↔R without a hard reset
  useEffect(() => {
    if (!autoPlay || !inView || isDragging || paused) return;

    let raf = 0;
    let last = performance.now();
    // Map current position back onto the sine phase so resume feels continuous
    const clamped = Math.max(4, Math.min(96, position));
    const t = (clamped - 4) / 92;
    phaseRef.current = Math.asin(Math.max(-1, Math.min(1, t * 2 - 1))) / Math.PI + 0.5;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      phaseRef.current = (phaseRef.current + dt / (durationMs / 1000)) % 1;
      // triangle via sine: 4% ↔ 96%
      const wave = (Math.sin(phaseRef.current * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      setPosition(4 + wave * 92);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // intentionally omit `position` — only seed phase when effect restarts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, inView, isDragging, paused, durationMs]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    updatePosition(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    resumeTimer.current = window.setTimeout(() => setPaused(false), 2200);
  };

  useEffect(() => {
    return () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  return (
    <div className="group">
      <div
        ref={containerRef}
        className={cn(
          "relative cursor-col-resize select-none overflow-hidden bg-zinc-950",
          featured ? "aspect-[16/10] md:aspect-[21/10]" : "aspect-[16/10]"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* After (base) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${after})` }}
        />

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${before})`,
            clipPath: `inset(0 ${100 - position}% 0 0)`,
          }}
        />

        {/* Soft edge light on the reveal line */}
        <div
          className="pointer-events-none absolute inset-y-0 z-[5] w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ left: `${position}%` }}
        />

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 z-10 w-px bg-white"
          style={{ left: `${position}%` }}
        >
          <div
            className={cn(
              "absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/80 bg-[#c9a227] text-black shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-transform duration-200",
              isDragging && "scale-110"
            )}
          >
            <GripVertical className="h-4 w-4" strokeWidth={2.25} />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-4 pt-4 text-[10px] font-medium uppercase tracking-[0.28em]">
          <span className="bg-black/55 px-2.5 py-1.5 text-zinc-200 backdrop-blur-sm">
            Before
          </span>
          <span className="bg-[#c9a227] px-2.5 py-1.5 text-black">After</span>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-[-0.02em] md:text-2xl">
            {title}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            {vehicle}
            <span className="mx-2 text-zinc-700">/</span>
            {service}
          </p>
        </div>
        <p className="hidden text-[10px] uppercase tracking-[0.22em] text-zinc-600 sm:block">
          Drag or watch
        </p>
      </div>
    </div>
  );
}

export function TransformationsSection() {
  const [featured, ...rest] = beforeAfterProjects;

  return (
    <section id="transformations" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,162,39,0.07),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 max-w-2xl md:mb-16"
        >
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-[#c9a227]">
            Results That Speak
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
            See the Transformation
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            The line glides back and forth so the change reads itself. Drag anytime to take over.
          </p>
        </motion.div>

        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 md:mb-10"
          >
            <BeforeAfterSlider
              before={featured.before}
              after={featured.after}
              title={featured.title}
              vehicle={featured.vehicle}
              service={featured.service}
              durationMs={8000}
              featured
            />
          </motion.div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {rest.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <BeforeAfterSlider
                before={project.before}
                after={project.after}
                title={project.title}
                vehicle={project.vehicle}
                service={project.service}
                durationMs={7200 + i * 800}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
