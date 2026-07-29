"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { easeOutExpo, staggerContainer } from "@/lib/motion";

const charVariant: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.85, ease: easeOutExpo },
  },
};

export function TextReveal({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={cn(className)} aria-label={text}>
      <motion.span
        className="inline"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          ...staggerContainer,
          visible: {
            transition: {
              staggerChildren: 0.04,
              delayChildren: delay,
            },
          },
        }}
        aria-hidden
      >
        {words.map((word, wi) => (
          <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
            {word.split("").map((char, ci) => (
              <span key={`${wi}-${ci}`} className="inline-block overflow-hidden align-bottom">
                <motion.span className="inline-block" variants={charVariant}>
                  {char}
                </motion.span>
              </span>
            ))}
            {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
