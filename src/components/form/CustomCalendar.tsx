"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Calendar } from "@untitledui/icons";

interface CustomCalendarProps {
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  disabled?: boolean;
  id?: string;
  triggerClassName?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function formatDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateKey(key: string): Date | null {
  const [y, m, d] = key.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return null;
  return date;
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

export default function CustomCalendar({
  value,
  onChange,
  minDate,
  disabled = false,
  id,
  triggerClassName,
}: CustomCalendarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { pos, measure } = useDropdownPosition(triggerRef);

  const selectedDate = useMemo(() => parseDateKey(value), [value]);
  const minDateObj = useMemo(() => (minDate ? parseDateKey(minDate) : null), [minDate]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());

  const close = useCallback(() => setOpen(false), []);

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

  const { firstDay, daysInMonth } = getMonthData(viewYear, viewMonth);

  const monthName = new Date(viewYear, viewMonth).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const nextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const isDateDisabled = (date: Date) => {
    if (minDateObj) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      if (d < minDateObj) return true;
    }
    return false;
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const triggerBase =
    "w-full rounded-lg border border-white/[0.06] bg-[#0a0a0f] px-3.5 py-2.5 text-[13px] text-white outline-none transition hover:bg-[#141419] focus:bg-[#141419] flex items-center justify-between";

  const handleOpenToggle = () => {
    if (disabled) return;
    setOpen((v) => {
      const next = !v;
      if (next) {
        const target = selectedDate || today;
        setViewYear(target.getFullYear());
        setViewMonth(target.getMonth());
        measure();
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenToggle();
    } else if (e.key === "Escape") {
      close();
    }
  };

  const dropdown = open && pos && (
    <div
      className="fixed z-[60] rounded-lg border border-white/[0.06] bg-[#0f0f14] shadow-xl shadow-black/40 overflow-hidden p-3"
      style={{ top: pos.top, left: pos.left, width: 280 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#9696a3] hover:bg-white/[0.04] hover:text-white transition"
          aria-label="Previous month"
        >
          <ChevronDown size={16} className="rotate-90" />
        </button>
        <span className="text-[13px] font-semibold text-white">{monthName}</span>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#9696a3] hover:bg-white/[0.04] hover:text-white transition"
          aria-label="Next month"
        >
          <ChevronDown size={16} className="-rotate-90" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="flex h-8 items-center justify-center text-[11px] font-medium text-[#686878]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const date = new Date(viewYear, viewMonth, dayNum);
          date.setHours(0, 0, 0, 0);
          const key = formatDateKey(date);
          const disabledDay = isDateDisabled(date);
          const selected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={key}
              type="button"
              disabled={disabledDay}
              onClick={() => {
                if (!disabledDay) {
                  onChange(key);
                  close();
                }
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-[12px] font-medium transition ${
                selected
                  ? "bg-[#c5a059] text-[#09090d]"
                  : disabledDay
                    ? "text-[#484855] cursor-not-allowed"
                    : "text-white hover:bg-white/[0.06] cursor-pointer"
              } ${isToday && !selected ? "ring-1 ring-[#c5a059]/40" : ""}`}
            >
              {dayNum}
            </button>
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
        onClick={handleOpenToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`${triggerBase} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-white/[0.1]"} ${open ? "bg-[#141419]" : ""} ${triggerClassName || ""}`}
      >
        <span className={displayValue ? "text-white" : "text-[#484855]"}>
          {displayValue || "Select date"}
        </span>
        <Calendar size={16} className="shrink-0 text-[#686878]" />
      </button>

      {typeof window !== "undefined" && dropdown
        ? createPortal(dropdown, document.body)
        : dropdown}
    </div>
  );
}
