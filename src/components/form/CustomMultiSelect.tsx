"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "@untitledui/icons";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface CustomMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export default function CustomMultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  id,
}: CustomMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, close]);

  useEffect(() => {
    if (open && listRef.current && highlightedIndex >= 0) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [open, highlightedIndex]);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlightedIndex(0);
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
          setHighlightedIndex(0);
        } else if (highlightedIndex >= 0) {
          toggleOption(options[highlightedIndex].value);
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
    "w-full rounded-lg border border-white/[0.06] bg-[#0a0a0f] px-3.5 py-2.5 text-[13px] text-white outline-none transition focus:border-[#1d4ed8]/50 focus:ring-1 focus:ring-[#1d4ed8]/20 focus:bg-[#141419] flex items-center justify-between";

  const displayText =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? options.find((o) => o.value === value[0])?.label || placeholder
        : `${value.length} selected`;

  return (
    <div ref={containerRef} className="relative" id={id}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`${triggerBase} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-white/[0.1]"} ${open ? "ring-1 ring-[#1d4ed8]/20 border-[#1d4ed8]/50 bg-[#141419]" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value.length > 0 ? "text-white" : "text-[#484855]"}>
          {displayText}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[#686878] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-lg border border-white/[0.06] bg-[#0f0f14] shadow-xl shadow-black/40 overflow-hidden">
          <div ref={listRef} role="listbox" className="max-h-60 overflow-auto py-1">
            {options.map((option, index) => {
              const isSelected = value.includes(option.value);
              const isHighlighted = index === highlightedIndex;
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => toggleOption(option.value)}
                  className={`flex cursor-pointer items-center gap-3 px-3.5 py-2.5 text-[13px] transition ${
                    isHighlighted
                      ? "bg-white/[0.04] text-white"
                      : "text-[#9696a3]"
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                      isSelected
                        ? "border-[#c5a059] bg-[#c5a059]/20"
                        : "border-white/[0.12] bg-transparent"
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-[#c5a059]" />}
                  </div>
                  <span className={isSelected ? "text-white" : ""}>{option.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
