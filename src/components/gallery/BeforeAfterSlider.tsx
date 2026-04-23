"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  className = "",
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gestureLockedRef = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    gestureLockedRef.current = false;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;

    // Gesture-direction detection (same pattern as DomeGallery)
    if (!gestureLockedRef.current) {
      const dx = Math.abs(e.clientX - (containerRef.current.dataset.startX ? Number(containerRef.current.dataset.startX) : e.clientX));
      const dy = Math.abs(e.clientY - (containerRef.current.dataset.startY ? Number(containerRef.current.dataset.startY) : e.clientY));
      const dist2 = dx * dx + dy * dy;
      if (dist2 < 100) {
        // Not enough movement yet — store start if first move
        if (!containerRef.current.dataset.startX) {
          containerRef.current.dataset.startX = String(e.clientX);
          containerRef.current.dataset.startY = String(e.clientY);
        }
        return;
      }
      gestureLockedRef.current = true;
      if (dy > dx) {
        // Vertical gesture → page scroll, abandon slider drag
        containerRef.current.removeAttribute("data-startX");
        containerRef.current.removeAttribute("data-startY");
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {}
        return;
      }
      // Horizontal gesture confirmed → start sliding
      setDragging(true);
      updatePos(e.clientX);
      return;
    }

    if (dragging) {
      updatePos(e.clientX);
    }
  };

  const onPointerUp = () => {
    setDragging(false);
    gestureLockedRef.current = false;
    if (containerRef.current) {
      containerRef.current.removeAttribute("data-startX");
      containerRef.current.removeAttribute("data-startY");
    }
  };

  const beforeOpacity = Math.min(1, pos / 20);
  const afterOpacity = Math.min(1, (100 - pos) / 20);

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "pan-y" }}
    >
      {/* Before image (full background) */}
      <Image
        src={beforeSrc}
        alt={beforeAlt}
        fill
        className="pointer-events-none rounded-xl object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        draggable={false}
      />

      {/* After image (clipped overlay, visible on the right side) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80"
        style={{ left: `${pos}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
        style={{ left: `${pos}%` }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M4 2v8M8 2v8"
            stroke="#09090d"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Labels */}
      <span
        className="absolute top-3 left-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: beforeOpacity }}
      >
        Before
      </span>
      <span
        className="absolute top-3 right-3 rounded bg-[#c5a059]/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#09090d] transition-opacity duration-200"
        style={{ opacity: afterOpacity }}
      >
        After
      </span>
    </div>
  );
}
