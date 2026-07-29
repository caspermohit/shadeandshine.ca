"use client";

import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = HTMLMotionProps<"a"> & {
  strength?: number;
};

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      {...props}
      style={{ x: springX, y: springY, ...(props.style as object) }}
      onMouseMove={(e) => {
        onMove(e);
        props.onMouseMove?.(e);
      }}
      onMouseLeave={(e) => {
        onLeave();
        props.onMouseLeave?.(e);
      }}
      className={cn(className)}
    >
      {children}
    </motion.a>
  );
}
