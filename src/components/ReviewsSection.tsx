"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { reviews, siteConfig } from "@/lib/data";

export function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const navigate = (dir: number) => {
    setAutoplay(false);
    setCurrent((prev) => {
      const next = prev + dir;
      if (next < 0) return reviews.length - 1;
      if (next >= reviews.length) return 0;
      return next;
    });
  };

  return (
    <section id="reviews" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9a227]/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 max-w-2xl md:mb-16"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#c9a227]">
            Client Voices
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            What clients say
          </h2>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#c9a227] text-[#c9a227]" />
              ))}
            </div>
            <span className="text-sm text-zinc-500">5.0 on Google</span>
          </div>
        </motion.div>

        {/* Featured review — editorial, not a card */}
        <div className="relative mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="border-l-2 border-[#c9a227]/50 py-2 pl-6 sm:pl-8"
            >
              <div className="mb-5 flex gap-0.5">
                {[...Array(reviews[current].rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#c9a227] text-[#c9a227]" />
                ))}
              </div>

              <blockquote className="font-display text-xl leading-relaxed tracking-tight text-white sm:text-2xl md:text-[1.65rem]">
                &ldquo;{reviews[current].text}&rdquo;
              </blockquote>

              <div className="mt-8 flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{reviews[current].name}</p>
                  <p className="text-xs text-zinc-500">
                    {reviews[current].vehicle}, {reviews[current].location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-start gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-white/5"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAutoplay(false);
                    setCurrent(i);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-6 bg-[#c9a227]" : "w-1.5 bg-zinc-700"
                  }`}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-white/5"
              aria-label="Next review"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-10">
          <a
            href={siteConfig.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#c9a227] transition-colors hover:text-[#e8c547]"
          >
            Read more on Google
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
