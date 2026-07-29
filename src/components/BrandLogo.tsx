"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  /** Display height in px. Ignored when `fluid` is true. */
  height?: number;
  /** Fill parent width; height follows aspect ratio. */
  fluid?: boolean;
  priority?: boolean;
};

/** Official Shade & Shine wordmark (white mark for dark surfaces). */
export function BrandLogo({
  className,
  height = 40,
  fluid = false,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt="Shade & Shine"
      width={1692}
      height={992}
      priority={priority}
      sizes={fluid ? "(max-width: 768px) 280px, 480px" : `${Math.round(height * 1.7)}px`}
      className={cn(
        "object-contain",
        fluid ? "h-auto w-full" : null,
        className
      )}
      style={fluid ? undefined : { height, width: "auto", maxWidth: "100%" }}
    />
  );
}
