"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/MagneticButton";
import { BrandLogo } from "@/components/BrandLogo";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#ppf", label: "PPF" },
  { href: "#tint", label: "Tint" },
  { href: "#wrap-studio", label: "Wraps" },
  { href: "#gallery", label: "Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-300",
        scrolled || mobileOpen
          ? "border-b border-white/10 bg-black/80 py-3 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-4"
      )}
    >
      <div className="relative mx-auto flex h-11 max-w-7xl items-center justify-between gap-4 px-5 sm:h-12 sm:px-6 lg:gap-8">
        <a
          href="#"
          className="relative z-10 shrink-0 transition-opacity hover:opacity-80"
          aria-label="Shade & Shine home"
        >
          <BrandLogo height={30} priority />
        </a>

        <nav
          className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12px] font-medium tracking-wide text-zinc-400 transition-colors hover:bg-white/5 hover:text-white xl:px-3 xl:text-[13px]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={`tel:${siteConfig.phone}`}
            className="hidden items-center gap-2 text-[13px] text-zinc-400 transition-colors hover:text-white xl:flex"
          >
            <Phone className="h-3.5 w-3.5" />
            {siteConfig.phone}
          </a>
          <MagneticButton
            href="#book"
            strength={0.2}
            className="hidden rounded-full bg-[#c9a227] px-4 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-[#e8c547] sm:inline-flex"
          >
            Book Now
          </MagneticButton>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-black/95 lg:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-6" aria-label="Mobile">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-white/5 py-3.5 text-base text-zinc-200 transition-colors last:border-0 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={`tel:${siteConfig.phone}`}
                className="mt-2 flex items-center gap-2 py-3 text-sm text-zinc-400"
              >
                <Phone className="h-4 w-4 text-[#c9a227]" />
                {siteConfig.phone}
              </a>
              <a
                href="#book"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-[#c9a227] px-5 py-3.5 text-center text-sm font-semibold text-black"
              >
                Book Now
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
