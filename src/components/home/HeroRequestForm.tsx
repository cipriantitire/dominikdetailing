"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BorderBeam from "border-beam";
import { serviceTiers, timeWindows } from "@/config/services";
import { isValidUkPostcode, normalizeUkPostcode } from "@/lib/location/ukPostcode";
import CustomSelect from "@/components/form/CustomSelect";
import CustomCalendar from "@/components/form/CustomCalendar";

const heroTrigger =
  "!border-0 !bg-transparent !px-0 !py-0 text-[14px]";

export default function HeroRequestForm() {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");
  const [locationError, setLocationError] = useState("");

  const serviceOptions = serviceTiers.map((t) => ({ value: t.id, label: t.name }));
  const timeOptions = timeWindows.map((tw) => ({ value: tw, label: tw }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedPostcode = normalizeUkPostcode(postcode);
    if (normalizedPostcode && !isValidUkPostcode(normalizedPostcode)) {
      setLocationError("Enter a valid UK postcode, for example SW1A 1AA.");
      return;
    }

    setLocationError("");
    const params = new URLSearchParams();
    if (normalizedPostcode) params.set("postcode", normalizedPostcode);
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
      className="mx-auto flex w-full max-w-4xl flex-col gap-2"
    >
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0f0f14]/80 backdrop-blur-md">
        <div className="grid grid-cols-2 gap-px bg-white/[0.04] lg:grid-cols-4">
          <div className="col-span-2 bg-[#0f0f14] p-4 transition-[colors] hover:bg-[#13131a] focus-within:bg-[#13131a] lg:col-span-1">
            <label htmlFor="hero-location" className="block text-left text-[11px] font-semibold uppercase tracking-wider text-[#686878]">
              Location
            </label>
            <input
              id="hero-location"
              type="text"
              value={postcode}
              onChange={(e) => {
                setPostcode(e.target.value);
                if (locationError) setLocationError("");
              }}
              onBlur={() => setPostcode((current) => normalizeUkPostcode(current))}
              autoComplete="postal-code"
              placeholder="Enter UK postcode"
              className="mt-1.5 w-full bg-transparent text-[14px] text-white placeholder:text-[#484855] outline-none"
            />
          </div>
          <div className="bg-[#0f0f14] p-4 transition-[colors] hover:bg-[#13131a] focus-within:bg-[#13131a]">
            <label htmlFor="hero-date" className="block text-left text-[11px] font-semibold uppercase tracking-wider text-[#686878]">
              Date
            </label>
            <div className="mt-1.5">
              <CustomCalendar
                id="hero-date"
                value={date}
                onChange={(v) => setDate(v)}
                minDate={minDate}
                triggerClassName={heroTrigger}
              />
            </div>
          </div>
          <div className="bg-[#0f0f14] p-4 transition-[colors] hover:bg-[#13131a] focus-within:bg-[#13131a]">
            <label htmlFor="hero-time" className="block text-left text-[11px] font-semibold uppercase tracking-wider text-[#686878]">
              Time
            </label>
            <div className="mt-1.5">
              <CustomSelect
                id="hero-time"
                value={time}
                onChange={(v) => setTime(v)}
                options={timeOptions}
                placeholder="Preferred time"
                triggerClassName={heroTrigger}
              />
            </div>
          </div>
          <div className="col-span-2 bg-[#0f0f14] p-4 transition-[colors] hover:bg-[#13131a] focus-within:bg-[#13131a] lg:col-span-1">
            <label htmlFor="hero-service" className="block text-left text-[11px] font-semibold uppercase tracking-wider text-[#686878]">
              Service
            </label>
            <div className="mt-1.5">
              <CustomSelect
                id="hero-service"
                value={service}
                onChange={(v) => setService(v)}
                options={serviceOptions}
                placeholder="Select service"
                triggerClassName={heroTrigger}
              />
            </div>
          </div>
        </div>
      </div>
      {locationError && <p className="px-1 text-left text-[11px] text-[#f87171]">{locationError}</p>}
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
          className="w-full bg-[#1d4ed8] py-3.5 text-[13px] font-bold uppercase tracking-widest text-white transition-[colors,transform] hover:bg-[#1e40af] active:scale-[0.96]"
        >
          Request Booking
        </button>
      </BorderBeam>
    </form>
  );
}
