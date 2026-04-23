"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "@untitledui/icons";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  triggerClassName?: string;
}

function useDropdownPosition(triggerRef: React.RefObject<HTMLButtonElement | null>) {
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, [triggerRef]);

  return { pos, measure };
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  id,
  triggerClassName,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { pos, measure } = useDropdownPosition(triggerRef);

  const selectedOption = options.find((o) => o.value === value);

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    if (open) {
      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }
  }, [open, close]);

  useEffect(() => {
    if (open && listRef.current && highlightedIndex >= 0) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [open, highlightedIndex]);

  useEffect(() => {
    if (open) {
      measure();
      const handleScroll = () => measure();
      const handleResize = () => measure();
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [open, measure]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlightedIndex(options.findIndex((o) => o.value === value));
        } else {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1
          );
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlightedIndex(options.findIndex((o) => o.value === value));
        } else if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          close();
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
    }
  };

  const triggerBase =
    "w-full rounded-lg border border-white/[0.06] bg-[#0a0a0f] px-3.5 py-2.5 text-[13px] text-white outline-none transition hover:bg-[#141419] focus:bg-[#141419] flex items-center justify-between";

  const dropdown = open && pos && (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute z-[60] rounded-lg border border-white/[0.06] bg-[#0f0f14] shadow-xl shadow-black/40 overflow-hidden"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      <div ref={listRef} role="listbox" className="max-h-60 overflow-auto py-1">
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isHighlighted = index === highlightedIndex;
          return (
            <div
              key={option.value}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setHighlightedIndex(index)}
              onTouchStart={() => setHighlightedIndex(index)}
              onClick={() => {
                onChange(option.value);
                close();
              }}
              className={`flex cursor-pointer items-center justify-between px-3.5 py-2.5 text-[13px] transition ${
                isHighlighted
                  ? "bg-white/[0.04] text-white"
                  : "text-[#9696a3]"
              } ${isSelected ? "text-[#c5a059]" : ""}`}
            >
              <span>{option.label}</span>
              {isSelected && <Check size={14} className="text-[#c5a059] shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative" id={id}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!disabled) {
            if (!open) measure();
            setOpen((v) => !v);
          }
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`${triggerBase} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-white/[0.1]"} ${open ? "bg-[#141419]" : ""} ${triggerClassName || ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selectedOption ? "text-white" : "text-[#484855]"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[#686878] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {typeof window !== "undefined" && dropdown
        ? createPortal(dropdown, document.body)
        : dropdown}
    </div>
  );
}
