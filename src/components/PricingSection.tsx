"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Shield, Check, ArrowRight } from "lucide-react";
import {
  pricingCategories,
  type PricingPackage,
  type PricingTier,
} from "@/lib/data";
import { cn } from "@/lib/utils";

function formatMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

function TierPrices({ tiers }: { tiers: PricingTier }) {
  const rows: { label: string; value: number }[] = [];
  if (tiers.sedan != null) rows.push({ label: "Sedans / Coupes / Small Hatchbacks", value: tiers.sedan });
  if (tiers.suv != null) rows.push({ label: "SUVs / Trucks / Vans", value: tiers.suv });
  if (tiers.small != null) rows.push({ label: "Small Hatchbacks & Sedans", value: tiers.small });
  if (tiers.trucks != null) rows.push({ label: "Trucks", value: tiers.trucks });
  if (tiers.vans != null) rows.push({ label: "Vans", value: tiers.vans });
  if (tiers.windshield != null) rows.push({ label: "Windshield", value: tiers.windshield });
  if (tiers.allWindows != null) rows.push({ label: "All Windows", value: tiers.allWindows });
  if (tiers.single != null) rows.push({ label: "From", value: tiers.single });

  // Avoid duplicate SUV/Trucks/Vans lines when all share one suv price and separate truck/van keys
  const unique = rows.filter(
    (row, i, arr) =>
      !(row.label === "Trucks" && arr.some((r) => r.label.startsWith("SUVs") && r.value === row.value)) &&
      !(row.label === "Vans" && arr.some((r) => r.label.startsWith("SUVs") && r.value === row.value))
  );

  return (
    <div className="mt-4 space-y-1.5">
      {unique.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-3 text-sm">
          <span className="text-zinc-500">{row.label}</span>
          <span className="shrink-0 font-semibold text-[#e8c547]">{formatMoney(row.value)}</span>
        </div>
      ))}
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-5 space-y-2">
      {items.map((feature) => (
        <li key={feature} className="flex items-start gap-2 text-sm text-zinc-400">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a227]" />
          {feature}
        </li>
      ))}
    </ul>
  );
}

function PackageCard({ pkg, index }: { pkg: PricingPackage; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.45 }}
      className={cn(
        "relative flex flex-col border p-6 transition-colors",
        pkg.highlight
          ? "border-[#c9a227]/40 bg-gradient-to-b from-[#c9a227]/10 to-transparent"
          : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
      )}
    >
      {pkg.highlight && (
        <span className="absolute -top-3 left-5 rounded-full bg-[#c9a227] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
          Popular
        </span>
      )}

      <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{pkg.description}</p>

      {pkg.comingSoon ? (
        <p className="mt-4 text-sm font-medium text-zinc-400">Coming soon</p>
      ) : pkg.quote ? (
        <p className="mt-4 text-sm font-medium text-[#e8c547]">Request a quote</p>
      ) : pkg.tiers ? (
        <TierPrices tiers={pkg.tiers} />
      ) : pkg.price != null ? (
        <div className="mt-4">
          <span className="text-3xl font-bold text-[#e8c547]">{formatMoney(pkg.price)}</span>
        </div>
      ) : null}

      {(pkg.duration || pkg.warranty) && (
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
          {pkg.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {pkg.duration}
            </span>
          )}
          {pkg.warranty && (
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> {pkg.warranty}
            </span>
          )}
        </div>
      )}

      {pkg.interior && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Interior</p>
          <FeatureList items={pkg.interior} />
        </div>
      )}
      {pkg.exterior && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Exterior</p>
          <FeatureList items={pkg.exterior} />
        </div>
      )}
      {!pkg.interior && !pkg.exterior && <FeatureList items={pkg.features} />}

      <a
        href="#contact"
        className={cn(
          "mt-6 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all",
          pkg.highlight || pkg.comingSoon
            ? "bg-[#c9a227] text-black hover:bg-[#e8c547]"
            : "border border-white/10 text-zinc-300 hover:border-[#c9a227]/30 hover:bg-white/5"
        )}
      >
        {pkg.comingSoon ? "Ask About This" : "Request This Service"}
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </motion.div>
  );
}

export function PricingSection() {
  const [activeId, setActiveId] = useState(pricingCategories[0].id);
  const active = pricingCategories.find((c) => c.id === activeId) ?? pricingCategories[0];

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 max-w-2xl md:mb-14"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#c9a227]">
            Packages & Pricing
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Choose your package
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Detailing, ceramic, tint, and add-ons priced for sedans through trucks and vans.
          </p>
        </motion.div>

        <div
          className="mb-10 flex gap-1 overflow-x-auto border-b border-white/[0.07] pb-px"
          role="tablist"
          aria-label="Pricing categories"
        >
          {pricingCategories.map((cat) => {
            const selected = cat.id === activeId;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(cat.id)}
                className={cn(
                  "shrink-0 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
                  selected
                    ? "border-b-2 border-[#c9a227] text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "grid gap-5",
              active.packages.length >= 4
                ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : active.packages.length === 3
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {active.packages.map((pkg, i) => (
              <PackageCard key={pkg.name} pkg={pkg} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
