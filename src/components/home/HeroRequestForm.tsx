"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { serviceTiers } from "@/config/services";

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
      className="mx-auto grid max-w-4xl gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div className="bg-[#f5f5f5] p-4">
        <label htmlFor="hero-location" className="block text-xs font-semibold text-[#111]">
          Location
        </label>
        <input
          id="hero-location"
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Enter your address or postcode"
          className="mt-1 w-full bg-transparent text-sm text-[#111] placeholder:text-[#999] outline-none"
        />
      </div>
      <div className="bg-[#f5f5f5] p-4">
        <label htmlFor="hero-date" className="block text-xs font-semibold text-[#111]">
          Date
        </label>
        <input
          id="hero-date"
          type="date"
          min={minDate}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Select a preferred date"
          className="mt-1 w-full bg-transparent text-sm text-[#111] placeholder:text-[#999] outline-none"
        />
      </div>
      <div className="bg-[#f5f5f5] p-4">
        <label htmlFor="hero-time" className="block text-xs font-semibold text-[#111]">
          Time
        </label>
        <select
          id="hero-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1 w-full bg-transparent text-sm text-[#111] outline-none"
        >
          <option value="">Select a preferred time</option>
          <option value="morning">Morning (8am - 12pm)</option>
          <option value="afternoon">Afternoon (12pm - 4pm)</option>
          <option value="evening">Evening (4pm - 6pm)</option>
        </select>
      </div>
      <div className="bg-[#f5f5f5] p-4">
        <label htmlFor="hero-service" className="block text-xs font-semibold text-[#111]">
          Service
        </label>
        <select
          id="hero-service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="mt-1 w-full bg-transparent text-sm text-[#111] outline-none"
        >
          <option value="">Choose a service</option>
          {serviceTiers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <button
          type="submit"
          className="w-full bg-[#3b82f6] py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#2563eb]"
        >
          Book Now
        </button>
      </div>
    </form>
  );
}
