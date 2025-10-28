"use client";

import * as React from "react";

type CarouselCtx = {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
};
const Ctx = React.createContext<CarouselCtx | null>(null);

/**
 * Simple snap-scrolling carousel with clear, circular black arrows.
 * - Arrows sit INSIDE the frame, left/right, vertically centered
 * - Content gets left/right padding so arrows never cover the first/last card
 */
export function Carousel({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  return (
    <Ctx.Provider value={{ containerRef }}>
      <div className="relative w-full">{children}</div>
    </Ctx.Provider>
  );
}

export function CarouselContent({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(Ctx);
  if (!ctx) return null;

  return (
    <div
      ref={ctx.containerRef}
      className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-14 py-2"
      // Optional: hide scrollbar on WebKit; remove if you want scrollbars visible
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
}

export function CarouselItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`snap-start shrink-0 ${className}`}>
      {/* card width */}
      <div className="w-[260px] md:w-[360px]">{children}</div>
    </div>
  );
}

/* ------- Circular arrow buttons ------- */
const btn =
  "absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center " +
  "h-10 w-10 rounded-full bg-black text-white shadow-lg ring-1 ring-black/60 " +
  "hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/40";

export function CarouselPrevious() {
  const ctx = React.useContext(Ctx);
  if (!ctx) return null;
  return (
    <button
      type="button"
      aria-label="Previous"
      onClick={() => ctx.containerRef.current?.scrollBy({ left: -360, behavior: "smooth" })}
      className={`${btn} left-3`}
    >
      ‹
    </button>
  );
}

export function CarouselNext() {
  const ctx = React.useContext(Ctx);
  if (!ctx) return null;
  return (
    <button
      type="button"
      aria-label="Next"
      onClick={() => ctx.containerRef.current?.scrollBy({ left: 360, behavior: "smooth" })}
      className={`${btn} right-3`}
    >
      ›
    </button>
  );
}
