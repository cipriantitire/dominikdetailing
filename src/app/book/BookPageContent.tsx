"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { serviceTiers, serviceExtras, timeWindows } from "@/config/services";
import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const bookingFormSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(100),
  customerPhone: z.string().min(1, "Phone is required").max(30),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  vehicleMake: z.string().max(100).optional(),
  vehicleModel: z.string().max(100).optional(),
  registration: z.string().max(20).optional(),
  colour: z.string().max(50).optional(),
  vehicleSize: z.string().optional(),
  address: z.string().min(1, "Address is required").max(300),
  postcode: z.string().min(1, "Postcode is required").max(20),
  keyCollectionSame: z.literal("on").optional(),
  keyCollectionAddress: z.string().max(300).optional(),
  requestedService: z.string().min(1, "Please select a service"),
  selectedExtras: z.array(z.string()).optional(),
  requestedDate: z.string().min(1, "Please select a date"),
  requestedTime: z.string().min(1, "Please select a time"),
  notes: z.string().max(1000).optional(),
  discountCode: z.string().max(50).optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookPageContent() {
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      selectedExtras: [],
      keyCollectionSame: "on",
      requestedService: searchParams.get("service") || "",
      postcode: searchParams.get("postcode") || "",
      requestedDate: searchParams.get("date") || "",
      requestedTime: searchParams.get("time") || "",
    },
  });

  const keyCollectionSame = watch("keyCollectionSame") === "on";
  const selectedExtras = watch("selectedExtras") || [];

  useEffect(() => {
    const service = searchParams.get("service");
    const postcode = searchParams.get("postcode");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    if (service) setValue("requestedService", service);
    if (postcode) setValue("postcode", postcode);
    if (date) setValue("requestedDate", date);
    if (time) setValue("requestedTime", time);
  }, [searchParams, setValue]);

  const toggleExtra = (id: string) => {
    const current = selectedExtras;
    if (current.includes(id)) {
      setValue(
        "selectedExtras",
        current.filter((x) => x !== id)
      );
    } else {
      setValue("selectedExtras", [...current, id]);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || undefined,
        vehicle: [data.vehicleMake, data.vehicleModel, data.colour, data.vehicleSize]
          .filter(Boolean)
          .join(" ") || "Not specified",
        postcode: data.postcode,
        requestedService: data.requestedService,
        selectedExtras: data.selectedExtras,
        requestedDate: data.requestedDate,
        requestedTime: data.requestedTime,
        notes: [
          data.notes,
          data.registration ? `Registration: ${data.registration}` : "",
          data.address ? `Address: ${data.address}` : "",
          !data.keyCollectionSame && data.keyCollectionAddress
            ? `Key collection: ${data.keyCollectionAddress}`
            : "",
          data.discountCode ? `Discount code: ${data.discountCode}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      };

      const res = await fetch("/api/booking-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        setSubmitError(json.error || "Something went wrong. Please try again or call us.");
      } else {
        setSubmitSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setSubmitError("Network error. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#090909] text-white">
        <SiteHeader />
        <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center md:px-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#62c275]/10 text-[#62c275]">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
            Request Received
          </h1>
          <p className="mt-4 text-[#a3a3a3]">
            Thank you. We have received your booking request and will review it shortly. You will hear back from us within 24 hours to confirm your appointment.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-md bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
            >
              Back to Home
            </Link>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/25"
            >
              Message on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm text-[#525252]">
            Need to make changes? Call us at{" "}
            <a href={siteConfig.phoneHref} className="text-[#a3a3a3] hover:text-white">
              {siteConfig.phone}
            </a>
          </p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8">
          <Link href="/" className="text-sm text-[#a3a3a3] transition hover:text-white">
            &larr; Back to home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Schedule Your <span className="text-[#3b82f6]">Appointment</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[#a3a3a3]">
            Choose your preferred date, time, and service. We&apos;ll confirm your appointment within 24 hours.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <div className="rounded-xl border border-white/5 bg-[#111] p-5 md:p-8">
            <h2 className="text-lg font-semibold">Book Your Service</h2>
            <p className="mt-1 text-sm text-[#a3a3a3]">
              Fill out the form to schedule your appointment
            </p>

            <a
              href={siteConfig.phoneHref}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#62c275]/30 bg-[#62c275]/5 py-3 text-sm font-semibold text-[#62c275] transition hover:bg-[#62c275]/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Don&apos;t feel like filling forms? Call us now!
            </a>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
              {/* Service, Extras, Date, Time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="requestedService" className="block text-sm font-semibold">
                    Select Service <span className="text-[#d63d2e]">*</span>
                  </label>
                  <select
                    id="requestedService"
                    {...register("requestedService")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#3b82f6]"
                  >
                    <option value="">Choose a service</option>
                    {serviceTiers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — From &pound;{t.startingPrice}
                      </option>
                    ))}
                  </select>
                  {errors.requestedService && (
                    <p className="mt-1 text-xs text-[#d63d2e]">{errors.requestedService.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold">Select Extras (Optional)</label>
                  <div className="relative mt-2">
                    <select
                      className="w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#3b82f6]"
                      onChange={(e) => {
                        if (e.target.value) {
                          toggleExtra(e.target.value);
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="">Choose extras</option>
                      {serviceExtras.map((extra) => (
                        <option key={extra.id} value={extra.id}>
                          {extra.name} (+&pound;{extra.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedExtras.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedExtras.map((id) => {
                        const extra = serviceExtras.find((e) => e.id === id);
                        return extra ? (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 rounded-full bg-[#3b82f6]/10 px-2.5 py-1 text-xs text-[#3b82f6]"
                          >
                            {extra.name}
                            <button
                              type="button"
                              onClick={() => toggleExtra(id)}
                              className="ml-1 hover:text-white"
                              aria-label={`Remove ${extra.name}`}
                            >
                              &times;
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="requestedDate" className="block text-sm font-semibold">
                    Select Date <span className="text-[#d63d2e]">*</span>
                  </label>
                  <input
                    id="requestedDate"
                    type="date"
                    min={minDate}
                    {...register("requestedDate")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#3b82f6]"
                  />
                  {errors.requestedDate && (
                    <p className="mt-1 text-xs text-[#d63d2e]">{errors.requestedDate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="requestedTime" className="block text-sm font-semibold">
                    Select Time <span className="text-[#d63d2e]">*</span>
                  </label>
                  <select
                    id="requestedTime"
                    {...register("requestedTime")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#3b82f6]"
                  >
                    <option value="">Select time</option>
                    {timeWindows.map((tw) => (
                      <option key={tw} value={tw}>
                        {tw}
                      </option>
                    ))}
                  </select>
                  {errors.requestedTime && (
                    <p className="mt-1 text-xs text-[#d63d2e]">{errors.requestedTime.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-semibold">
                    Person of contact <span className="text-[#d63d2e]">*</span>
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    placeholder="Name / Surname"
                    {...register("customerName")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-xs text-[#d63d2e]">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-semibold">
                    Phone <span className="text-[#d63d2e]">*</span>
                  </label>
                  <input
                    id="customerPhone"
                    type="tel"
                    placeholder="Enter contact number"
                    {...register("customerPhone")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                  />
                  {errors.customerPhone && (
                    <p className="mt-1 text-xs text-[#d63d2e]">{errors.customerPhone.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="customerEmail" className="block text-sm font-semibold">
                    E-mail (Optional)
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    placeholder="Enter contact e-mail"
                    {...register("customerEmail")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                  />
                  {errors.customerEmail && (
                    <p className="mt-1 text-xs text-[#d63d2e]">{errors.customerEmail.message}</p>
                  )}
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="vehicleMake" className="block text-sm font-semibold">
                    Car Make
                  </label>
                  <input
                    id="vehicleMake"
                    type="text"
                    placeholder="BMW, Mercedes, etc."
                    {...register("vehicleMake")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                  />
                </div>
                <div>
                  <label htmlFor="vehicleModel" className="block text-sm font-semibold">
                    Model
                  </label>
                  <input
                    id="vehicleModel"
                    type="text"
                    placeholder="M3, E-Class, etc."
                    {...register("vehicleModel")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                  />
                </div>
                <div>
                  <label htmlFor="registration" className="block text-sm font-semibold">
                    Registration
                  </label>
                  <input
                    id="registration"
                    type="text"
                    placeholder="AB12 CDE"
                    {...register("registration")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                  />
                </div>
                <div>
                  <label htmlFor="colour" className="block text-sm font-semibold">
                    Color
                  </label>
                  <input
                    id="colour"
                    type="text"
                    placeholder="Red, Blue, etc."
                    {...register("colour")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="vehicleSize" className="block text-sm font-semibold">
                    Vehicle Size
                  </label>
                  <select
                    id="vehicleSize"
                    {...register("vehicleSize")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#3b82f6]"
                  >
                    <option value="">Select size</option>
                    <option value="Small">Small (e.g., Fiat 500, Mini)</option>
                    <option value="Medium">Medium (e.g., Golf, A3, 1-Series)</option>
                    <option value="Large">Large (e.g., 5-Series, E-Class)</option>
                    <option value="SUV">SUV / 4x4</option>
                    <option value="7-seater">7-Seater / Van</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-semibold">
                    Car Location <span className="text-[#d63d2e]">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Enter address or post code"
                    {...register("address")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-[#d63d2e]">{errors.address.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="postcode" className="block text-sm font-semibold">
                    Postcode <span className="text-[#d63d2e]">*</span>
                  </label>
                  <input
                    id="postcode"
                    type="text"
                    placeholder="e.g. SW1A 1AA"
                    {...register("postcode")}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                  />
                  {errors.postcode && (
                    <p className="mt-1 text-xs text-[#d63d2e]">{errors.postcode.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 sm:col-span-2">
                  <input
                    id="keyCollectionSame"
                    type="checkbox"
                    {...register("keyCollectionSame")}
                    className="h-4 w-4 rounded border-white/10 bg-[#0d0d0d] text-[#3b82f6] accent-[#3b82f6]"
                  />
                  <label htmlFor="keyCollectionSame" className="text-sm text-[#d4d4d4]">
                    Key location same as car location
                  </label>
                </div>
                {!keyCollectionSame && (
                  <div className="sm:col-span-2">
                    <label htmlFor="keyCollectionAddress" className="block text-sm font-semibold">
                      Key Collection Address
                    </label>
                    <input
                      id="keyCollectionAddress"
                      type="text"
                      placeholder="Enter key collection address"
                      {...register("keyCollectionAddress")}
                      className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                    />
                  </div>
                )}
              </div>

              {/* Notes & Discount */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  placeholder="Any special requests or notes about the vehicle..."
                  {...register("notes")}
                  className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label htmlFor="discountCode" className="block text-sm font-semibold">
                  Discount Code (Optional)
                </label>
                <input
                  id="discountCode"
                  type="text"
                  placeholder="Enter your discount code"
                  {...register("discountCode")}
                  className="mt-2 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none transition focus:border-[#3b82f6]"
                />
              </div>

              {submitError && (
                <div className="rounded-md border border-[#d63d2e]/30 bg-[#d63d2e]/10 p-4 text-sm text-[#f06a5d]">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#3b82f6] py-3.5 text-sm font-bold text-white transition hover:bg-[#2563eb] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Book Appointment
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#525252]">
                This is a booking request, not an instant confirmation. The owner will review and confirm your appointment.
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="rounded-xl border border-white/5 bg-[#111] p-5">
              <h3 className="text-sm font-semibold">Contact Information</h3>
              <p className="mt-1 text-xs text-[#a3a3a3]">Multiple ways to reach us</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold">Phone &amp; SMS</p>
                    <p className="text-xs text-[#a3a3a3]">Call or message on WhatsApp</p>
                    <a href={siteConfig.phoneHref} className="text-sm text-white hover:underline">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold">Email</p>
                    <p className="text-xs text-[#a3a3a3]">Email us your questions</p>
                    <a href={`mailto:${siteConfig.email}`} className="text-sm text-white hover:underline">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold">Business Hours</p>
                    <p className="text-xs text-[#d4d4d4]">{siteConfig.hours.weekday}</p>
                    <p className="text-xs text-[#d4d4d4]">{siteConfig.hours.saturday}</p>
                    <p className="text-xs text-[#d63d2e]">{siteConfig.hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-[#111]">
              <Image
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80"
                alt="London service area map"
                fill
                sizes="380px"
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-[#111]/90 px-4 py-2 text-xs font-semibold text-white">
                  Mobile service across London
                </span>
              </div>
            </div>

            {/* Why book with us */}
            <div className="rounded-xl border border-white/5 bg-[#111] p-5">
              <h3 className="text-sm font-semibold">Why Book With Us?</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Free consultation and estimate",
                  "24-hour confirmation guarantee",
                  "Flexible rescheduling policy",
                  "Satisfaction guarantee",
                  "Professional grade results",
                  "Top-notch quality products used",
                  "Loyalty rewards program",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#d4d4d4]">
                    <svg className="h-4 w-4 shrink-0 text-[#62c275]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Offer */}
            <div className="rounded-xl border border-[#d63d2e]/20 bg-gradient-to-br from-[#d63d2e]/10 to-[#111] p-5 text-center">
              <span className="inline-block rounded-full bg-[#d63d2e] px-3 py-1 text-xs font-bold text-white">
                Limited Time Offer
              </span>
              <p className="mt-3 text-sm font-semibold">
                Get 20% off your first service when you book online
              </p>
              <p className="mt-2 text-xs text-[#a3a3a3]">
                Use code: <span className="font-bold text-white">FIRST20</span>
              </p>
              <div className="mt-3 flex justify-center">
                <svg className="h-6 w-6 text-[#d63d2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
