"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { galleryProjects } from "@/lib/data";

export function GallerySection() {
  const [selected, setSelected] = useState<(typeof galleryProjects)[0] | null>(null);

  return (
    <section id="gallery" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.04),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 max-w-2xl md:mb-16"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#c9a227]">
            Our Work
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Recent Projects
          </h2>
          <p className="mt-4 text-zinc-400">
            Real vehicles. Real finishes.
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {galleryProjects.map((project, i) => (
            <motion.button
              key={project.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(project)}
              className="group relative aspect-[4/3] overflow-hidden text-left"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${project.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <ZoomIn className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-display text-lg font-semibold tracking-tight">
                  {project.title}
                </p>
                <p className="text-sm text-[#c9a227]">{project.service}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-6 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              className="absolute top-6 right-6 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.image}
                alt={selected.title}
                className="max-h-[70vh] w-full object-contain bg-black"
              />
              <div className="border-t border-white/10 bg-black/80 px-6 py-5">
                <h3 className="font-display text-xl font-semibold">{selected.title}</h3>
                <p className="text-sm text-[#c9a227]">{selected.service}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
