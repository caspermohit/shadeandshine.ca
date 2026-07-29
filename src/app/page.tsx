"use client";

import { ClientOnly } from "@/components/ClientOnly";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsBand } from "@/components/StatsBand";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { PPFVisualizer } from "@/components/PPFVisualizer";
import { TransformationsSection } from "@/components/BeforeAfterSlider";
import { WrapStudio } from "@/components/WrapStudio";
import { GallerySection } from "@/components/GallerySection";
import { PricingSection } from "@/components/PricingSection";
import { FeynlabShowcase } from "@/components/FeynlabShowcase";
import { ReviewsSection } from "@/components/ReviewsSection";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";

function Site() {
  return (
    <SmoothScroll>
      <main className="relative bg-black">
        <Navbar />
        <Hero />
        <StatsBand />
        <ServicesSection />
        <WhyChooseUs />
        <PPFVisualizer />
        <TransformationsSection />
        <WrapStudio />
        <GallerySection />
        <PricingSection />
        <FeynlabShowcase />
        <ReviewsSection />
        <BookingSection />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

export default function Home() {
  return (
    <ClientOnly
      fallback={
        <div
          suppressHydrationWarning
          className="flex min-h-screen items-center justify-center"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-mark.png"
            alt=""
            width={160}
            height={94}
            className="h-12 w-auto opacity-90"
          />
        </div>
      }
    >
      <Site />
    </ClientOnly>
  );
}
