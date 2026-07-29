"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";
import { siteConfig } from "@/lib/data";

export function BookingSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Book Now — full-bleed brand banner */}
      <section id="book" className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/banner-facebook.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to transform
              <br />
              your vehicle?
            </h2>
            <p className="mt-4 max-w-md text-zinc-300">
              Book your appointment or request a free quote. We&apos;ll get back
              to you within 24 hours.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c9a227] to-[#e8c547] px-8 py-4 text-sm font-semibold text-black transition-all hover:shadow-xl hover:shadow-[#c9a227]/30"
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-medium text-zinc-100 transition-all hover:border-white/50 hover:bg-white/5"
              >
                <Phone className="h-4 w-4" />
                Call {siteConfig.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact / Quote Form */}
      <section id="contact" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#c9a227]">
                Get In Touch
              </span>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                Request a <span className="gold-gradient">Free Quote</span>
              </h2>
              <p className="mt-4 text-zinc-400">
                Tell us about your vehicle and the services you&apos;re interested in.
                We&apos;ll provide a detailed quote tailored to your needs.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c9a227]/10">
                    <MapPin className="h-5 w-5 text-[#c9a227]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Visit Us</p>
                    <a
                      href={siteConfig.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-500 transition-colors hover:text-[#c9a227]"
                    >
                      {siteConfig.address}
                    </a>
                    <p className="mt-1 text-xs text-zinc-600">
                      Serving Norfolk County &amp; surrounding areas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c9a227]/10">
                    <Phone className="h-5 w-5 text-[#c9a227]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Call Us</p>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="text-sm text-zinc-500 transition-colors hover:text-[#c9a227]"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c9a227]/10">
                    <Mail className="h-5 w-5 text-[#c9a227]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email Us</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-sm text-zinc-500 transition-colors hover:text-[#c9a227]"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c9a227]/10">
                    <Clock className="h-5 w-5 text-[#c9a227]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hours</p>
                    <p className="text-sm text-zinc-500">By Appointment Only</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-[#c9a227]/20 bg-[#0c0c12] p-12 text-center">
                  <CheckCircle className="mb-4 h-12 w-12 text-[#c9a227]" />
                  <h3 className="text-xl font-semibold">Quote Request Sent!</h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    We&apos;ll get back to you within 24 hours with a detailed quote.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-white/5 bg-[#0c0c12] p-8"
                >
                  <div className="grid gap-5">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a227]/50"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({ ...formState, email: e.target.value })
                          }
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a227]/50"
                          placeholder="john@email.com"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formState.phone}
                          onChange={(e) =>
                            setFormState({ ...formState, phone: e.target.value })
                          }
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a227]/50"
                          placeholder="519-555-0123"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                        Service Interested In
                      </label>
                      <select
                        value={formState.service}
                        onChange={(e) =>
                          setFormState({ ...formState, service: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a227]/50"
                      >
                        <option value="">Select a service...</option>
                        <option value="detailing">Auto Detailing</option>
                        <option value="ceramic">Ceramic Coating</option>
                        <option value="tint">Window Tint</option>
                        <option value="correction">Paint Correction</option>
                        <option value="ppf">Paint Protection Film</option>
                        <option value="wrap">Vinyl Wrap</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        value={formState.message}
                        onChange={(e) =>
                          setFormState({ ...formState, message: e.target.value })
                        }
                        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a227]/50"
                        placeholder="Tell us about your vehicle and what you're looking for..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c9a227] to-[#e8c547] py-3.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-[#c9a227]/25"
                    >
                      <Send className="h-4 w-4" />
                      Send Quote Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
