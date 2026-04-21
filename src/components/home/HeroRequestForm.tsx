"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { serviceTiers, timeWindows } from "@/config/services";

export default function HeroRequestForm() {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (postcode) params.set("postcode", postcode);
    if (date) params.set("date", date);
    if (time) params.set("time", time);
    if (service) params.set("service", service);
    router.push(`/book?${params.toString()}`);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-white/[0.06] bg-[#0f0f14]/80 backdrop-blur-md"
    >
      <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[#0f0f14] p-4">
          <label htmlFor="hero-location" className="block text-[11px] font-semibold uppercase tracking-wider text-[#5a5a65]">
            Location
          </label>
          <input
            id="hero-location"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Postcode"
            className="mt-1.5 w-full bg-transparent text-[14px] text-white placeholder:text-[#3a3a45] outline-none"
          />
        </div>
        <div className="bg-[#0f0f14] p-4">
          <label htmlFor="hero-date" className="block text-[11px] font-semibold uppercase tracking-wider text-[#5a5a65]">
            Date
          </label>
          <input
            id="hero-date"
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1.5 w-full bg-transparent text-[14px] text-white outline-none"
          />
        </div>
        <div className="bg-[#0f0f14] p-4">
          <label htmlFor="hero-time" className="block text-[11px] font-semibold uppercase tracking-wider text-[#5a5a65]">
            Time
          </label>
          <select
            id="hero-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1.5 w-full bg-transparent text-[14px] text-white outline-none"
          >
            <option value="" className="bg-[#0f0f14]">Preferred time</option>
            {timeWindows.map((window) => (
              <option key={window} value={window} className="bg-[#0f0f14]">
                {window}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-[#0f0f14] p-4">
          <label htmlFor="hero-service" className="block text-[11px] font-semibold uppercase tracking-wider text-[#5a5a65]">
            Service
          </label>
          <select
            id="hero-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="mt-1.5 w-full bg-transparent text-[14px] text-white outline-none"
          >
            <option value="" className="bg-[#0f0f14]">Select service</option>
            {serviceTiers.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#0f0f14]">
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-[#1d4ed8] py-3.5 text-[13px] font-bold uppercase tracking-widest text-white transition hover:bg-[#1e40af]"
      >
        Request Booking
      </button>
    </form>
  );
}
