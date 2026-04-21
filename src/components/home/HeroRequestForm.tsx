"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BorderBeam from "border-beam";
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

  const inputFocus = "transition focus:bg-[#141419] focus:ring-1 focus:ring-[#1d4ed8]/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-4xl flex-col gap-2"
    >
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0f0f14]/80 backdrop-blur-md">
        <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-[#0f0f14] p-4 transition hover:bg-[#13131a]">
            <label htmlFor="hero-location" className="block text-left text-[11px] font-semibold uppercase tracking-wider text-[#686878]">
              Location
            </label>
            <input
              id="hero-location"
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Postcode"
              className={`mt-1.5 w-full bg-transparent text-[14px] text-white placeholder:text-[#484855] outline-none ${inputFocus}`}
            />
          </div>
          <div className="bg-[#0f0f14] p-4 transition hover:bg-[#13131a]">
            <label htmlFor="hero-date" className="block text-left text-[11px] font-semibold uppercase tracking-wider text-[#686878]">
              Date
            </label>
            <input
              id="hero-date"
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`mt-1.5 w-full bg-transparent text-[14px] text-white outline-none ${inputFocus}`}
            />
          </div>
          <div className="bg-[#0f0f14] p-4 transition hover:bg-[#13131a]">
            <label htmlFor="hero-time" className="block text-left text-[11px] font-semibold uppercase tracking-wider text-[#686878]">
              Time
            </label>
            <select
              id="hero-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`mt-1.5 w-full bg-transparent text-[14px] text-white outline-none ${inputFocus} rounded`}
            >
              <option value="" className="bg-[#0f0f14]">Preferred time</option>
              {timeWindows.map((window) => (
                <option key={window} value={window} className="bg-[#0f0f14]">
                  {window}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-[#0f0f14] p-4 transition hover:bg-[#13131a]">
            <label htmlFor="hero-service" className="block text-left text-[11px] font-semibold uppercase tracking-wider text-[#686878]">
              Service
            </label>
            <select
              id="hero-service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className={`mt-1.5 w-full bg-transparent text-[14px] text-white outline-none ${inputFocus} rounded`}
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
      </div>
      <BorderBeam
        size="line"
        colorVariant="ocean"
        theme="dark"
        strength={1}
        duration={4.5}
        className="w-full"
      >
        <button
          type="submit"
          className="w-full bg-[#1d4ed8] py-3.5 text-[13px] font-bold uppercase tracking-widest text-white transition hover:bg-[#1e40af] active:scale-[0.995]"
        >
          Request Booking
        </button>
      </BorderBeam>
    </form>
  );
}
