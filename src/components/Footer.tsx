import { siteConfig } from "@/lib/data";
import { Phone, Mail, MapPin } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0c0c12]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-5">
              <BrandLogo height={44} />
            </div>
            <p className="text-sm leading-relaxed text-zinc-500">
              Premium automotive detailing, ceramic coating, window tint, and vinyl
              wraps serving Norfolk County and surrounding areas.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#services" className="transition-colors hover:text-[#c9a227]">Auto Detailing</a></li>
              <li><a href="#pricing" className="transition-colors hover:text-[#c9a227]">Ceramic Coating</a></li>
              <li><a href="#services" className="transition-colors hover:text-[#c9a227]">Window Tint</a></li>
              <li><a href="#services" className="transition-colors hover:text-[#c9a227]">Paint Correction</a></li>
              <li><a href="#wrap-studio" className="transition-colors hover:text-[#c9a227]">Vinyl Wraps</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#gallery" className="transition-colors hover:text-[#c9a227]">Our Work</a></li>
              <li><a href="#reviews" className="transition-colors hover:text-[#c9a227]">Reviews</a></li>
              <li><a href="#book" className="transition-colors hover:text-[#c9a227]">Book Now</a></li>
              <li><a href="#contact" className="transition-colors hover:text-[#c9a227]">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a227]" />
                <a
                  href={siteConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#c9a227]"
                >
                  {siteConfig.address}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#c9a227]" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-[#c9a227]">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#c9a227]" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[#c9a227]">
                  {siteConfig.email}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs font-bold transition-colors hover:border-[#c9a227]/30 hover:bg-white/5"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs font-bold transition-colors hover:border-[#c9a227]/30 hover:bg-white/5"
                aria-label="Instagram"
              >
                IG
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            &copy; 2026 Shade & Shine. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Serving Norfolk County &amp; surrounding areas
          </p>
        </div>
      </div>
    </footer>
  );
}
