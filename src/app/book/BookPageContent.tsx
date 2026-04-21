"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { serviceTiers, serviceExtras, timeWindows } from "@/config/services";
import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { bookingSchema } from "@/lib/validations/booking";
import {
  Phone,
  Mail01,
  Calendar,
  Clock,
  CheckVerified02,
  ArrowRight,
  Gift01,
  MessageChatSquare,
  MarkerPin01,
} from "@untitledui/icons";

const bookingFormSchema = bookingSchema.extend({
  keyCollectionSame: z.literal("on").optional(),
  discountCode: z.string().max(50).optional(),
});

type BookingFormInput = z.input<typeof bookingFormSchema>;
type BookingFormData = z.output<typeof bookingFormSchema>;

export default function BookPageContent() {
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BookingFormInput, undefined, BookingFormData>({
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

  const keyCollectionSame = useWatch({ control, name: "keyCollectionSame" }) === "on";
  const selectedExtras = useWatch({ control, name: "selectedExtras", defaultValue: [] }) || [];

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
        current.filter((x) => x !== id),
        { shouldValidate: true, shouldDirty: true }
      );
    } else {
      setValue("selectedExtras", [...current, id], { shouldValidate: true, shouldDirty: true });
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
        address: data.address,
        postcode: data.postcode,
        vehicleMake: data.vehicleMake || undefined,
        vehicleModel: data.vehicleModel || undefined,
        registration: data.registration || undefined,
        colour: data.colour || undefined,
        keyCollectionAddress: keyCollectionSame ? undefined : data.keyCollectionAddress || undefined,
        requestedService: data.requestedService,
        selectedExtras: data.selectedExtras,
        requestedDate: data.requestedDate,
        requestedTime: data.requestedTime,
        notes: data.notes || undefined,
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

  const inputBase =
    "w-full rounded-lg border border-white/[0.06] bg-[#0a0a0f] px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#3a3a45] outline-none transition focus:border-[#1d4ed8]/50 focus:ring-1 focus:ring-[#1d4ed8]/20 focus:bg-[#141419]";
  const labelBase = "block text-[12px] font-semibold text-[#8a8a95]";
  const errorBase = "mt-1 text-[11px] text-[#dc2626]";

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#09090d] text-white">
        <SiteHeader />
        <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center md:px-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/10 text-[#22c55e]">
            <CheckVerified02 size={32} />
          </div>
          <h1 className="mt-6 text-[32px] font-bold tracking-tight md:text-[40px]">
            Request Received
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-[#5a5a65]">
            Thank you. We have received your booking request and will review it shortly. You will hear back from us within 24 hours to confirm your appointment.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#1e40af]"
            >
              Back to Home
            </Link>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-6 py-3 text-[13px] font-semibold text-white transition hover:border-white/20"
            >
              <MessageChatSquare size={16} />
              Message on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-[12px] text-[#3a3a45]">
            Need to make changes? Call us at{" "}
            <a href={siteConfig.phoneHref} className="text-[#5a5a65] hover:text-white">
              {siteConfig.phone}
            </a>
          </p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[13px] text-[#5a5a65] transition hover:text-white"
          >
            <ArrowRight size={14} className="rotate-180" />
            Back to home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-[32px] font-bold tracking-tight md:text-[48px]">
            Schedule Your <span className="text-[#1d4ed8]">Appointment</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-[#5a5a65]">
            Choose your preferred date, time, and service. We&apos;ll confirm your appointment within 24 hours.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 md:p-8">
            <h2 className="text-[16px] font-semibold">Book Your Service</h2>
            <p className="mt-1 text-[13px] text-[#5a5a65]">
              Fill out the form to schedule your appointment
            </p>

            <a
              href={siteConfig.phoneHref}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/5 py-3 text-[13px] font-semibold text-[#22c55e] transition hover:bg-[#22c55e]/10"
            >
              <Phone size={16} />
              Don&apos;t feel like filling forms? Call us now!
            </a>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              {/* Hidden postcode */}
              <input type="hidden" {...register("postcode")} />

              {/* Row 1: 4 selects */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label htmlFor="requestedService" className={labelBase}>
                    Select Service <span className="text-[#dc2626]">*</span>
                  </label>
                  <select id="requestedService" {...register("requestedService")} className={`${inputBase} mt-1.5`}>
                    <option value="" className="bg-[#0a0a0f]">Choose a service</option>
                    {serviceTiers.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#0a0a0f]">
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {errors.requestedService && <p className={errorBase}>{errors.requestedService.message}</p>}
                </div>

                <div>
                  <label className={labelBase}>Select Extras (Optional)</label>
                  <select
                    className={`${inputBase} mt-1.5`}
                    onChange={(e) => {
                      if (e.target.value) {
                        toggleExtra(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="" className="bg-[#0a0a0f]">Choose extras</option>
                    {serviceExtras.map((extra) => (
                      <option key={extra.id} value={extra.id} className="bg-[#0a0a0f]">
                        {extra.name} (+&pound;{extra.price})
                      </option>
                    ))}
                  </select>
                  {selectedExtras.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedExtras.map((id) => {
                        const extra = serviceExtras.find((e) => e.id === id);
                        return extra ? (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 rounded-full border border-[#1d4ed8]/20 bg-[#1d4ed8]/10 px-2.5 py-1 text-[11px] text-[#1d4ed8]"
                          >
                            {extra.name}
                            <button
                              type="button"
                              onClick={() => toggleExtra(id)}
                              className="ml-0.5 hover:text-white"
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
                  <label htmlFor="requestedDate" className={labelBase}>
                    Select Date <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    id="requestedDate"
                    type="date"
                    min={minDate}
                    {...register("requestedDate")}
                    className={`${inputBase} mt-1.5`}
                  />
                  {errors.requestedDate && <p className={errorBase}>{errors.requestedDate.message}</p>}
                </div>

                <div>
                  <label htmlFor="requestedTime" className={labelBase}>
                    Select Time <span className="text-[#dc2626]">*</span>
                  </label>
                  <select id="requestedTime" {...register("requestedTime")} className={`${inputBase} mt-1.5`}>
                    <option value="" className="bg-[#0a0a0f]">Select time</option>
                    {timeWindows.map((tw) => (
                      <option key={tw} value={tw} className="bg-[#0a0a0f]">
                        {tw}
                      </option>
                    ))}
                  </select>
                  {errors.requestedTime && <p className={errorBase}>{errors.requestedTime.message}</p>}
                </div>
              </div>

              {/* Row 2-4: Contact fields (left 1/2) + Map (right 1/2, spans 3 rows) */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="customerName" className={labelBase}>
                      Person of contact <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      placeholder="Name/Surname"
                      {...register("customerName")}
                      className={`${inputBase} mt-1.5`}
                    />
                    {errors.customerName && <p className={errorBase}>{errors.customerName.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="customerPhone" className={labelBase}>
                      Phone <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      id="customerPhone"
                      type="tel"
                      placeholder="Enter contact number"
                      {...register("customerPhone")}
                      className={`${inputBase} mt-1.5`}
                    />
                    {errors.customerPhone && <p className={errorBase}>{errors.customerPhone.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="customerEmail" className={labelBase}>
                      E-mail (Optional)
                    </label>
                    <input
                      id="customerEmail"
                      type="email"
                      placeholder="Enter contact e-mail"
                      {...register("customerEmail")}
                      className={`${inputBase} mt-1.5`}
                    />
                    {errors.customerEmail && <p className={errorBase}>{errors.customerEmail.message}</p>}
                  </div>
                </div>

                <div className="hidden lg:flex lg:flex-col">
                  <label className={`${labelBase} invisible`}>Service Area</label>
                  <div className="mt-1.5 flex-1 min-h-0 overflow-hidden rounded-lg border border-white/[0.06]">
                    <iframe
                      title="London service area"
                      src="https://www.openstreetmap.org/export/embed.html?bbox=-0.35%2C51.35%2C0.15%2C51.65&layer=mapnik"
                      className="h-full w-full border-0"
                      style={{
                        filter: "invert(90%) hue-rotate(180deg) brightness(0.75) contrast(1.1)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Car Make (1/4) | Model (1/4) | Car Location (1/2) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="sm:col-span-1">
                  <label htmlFor="vehicleMake" className={labelBase}>
                    Car Make
                  </label>
                  <input
                    id="vehicleMake"
                    type="text"
                    placeholder="BMW, Mercedes, etc."
                    {...register("vehicleMake")}
                    className={`${inputBase} mt-1.5`}
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="vehicleModel" className={labelBase}>
                    Model
                  </label>
                  <input
                    id="vehicleModel"
                    type="text"
                    placeholder="M3, E-Class, etc."
                    {...register("vehicleModel")}
                    className={`${inputBase} mt-1.5`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className={labelBase}>
                    Car Location <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Enter address or post code"
                    {...register("address")}
                    className={`${inputBase} mt-1.5`}
                  />
                  {errors.address && <p className={errorBase}>{errors.address.message}</p>}
                </div>
              </div>

              {/* Row 6: Registration (1/4) | Color (1/4) | Key Location (1/2 with toggle) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="sm:col-span-1">
                  <label htmlFor="registration" className={labelBase}>
                    Registration
                  </label>
                  <input
                    id="registration"
                    type="text"
                    placeholder="AB123 CDE"
                    {...register("registration")}
                    className={`${inputBase} mt-1.5`}
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="colour" className={labelBase}>
                    Color
                  </label>
                  <input
                    id="colour"
                    type="text"
                    placeholder="Red, Blue, etc."
                    {...register("colour")}
                    className={`${inputBase} mt-1.5`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="keyCollectionAddress" className={labelBase}>
                    Key Location
                  </label>
                  {/* Make container relative so the switch can be absolutely positioned
                      and vertically centered relative to the input field only. */}
                  <div className="mt-1.5 relative">
                    <input
                      id="keyCollectionAddress"
                      type="text"
                      placeholder={keyCollectionSame ? "Same as car location" : "Enter key collection address"}
                      disabled={keyCollectionSame}
                      {...register("keyCollectionAddress")}
                      // reserve space for the absolutely positioned switch on the right
                      className={`${inputBase} w-full pr-14 disabled:opacity-40`}
                    />

                    <label
                      htmlFor="keyCollectionSame"
                      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex cursor-pointer items-center"
                      aria-label="Use car location as key collection address"
                      title="Toggle same as car location"
                    >
                      <input
                        id="keyCollectionSame"
                        type="checkbox"
                        {...register("keyCollectionSame")}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-[#1a1a20] relative after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#22c55e] peer-checked:after:translate-x-full peer-focus-visible:ring-2 peer-focus-visible:ring-[#1d4ed8]/40" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className={labelBase}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  placeholder="Any special requests or notes about the vehicle..."
                  {...register("notes")}
                  className={`${inputBase} mt-1.5 resize-none`}
                />
              </div>

              <div>
                <label htmlFor="discountCode" className={labelBase}>
                  Discount Code (Optional)
                </label>
                <input
                  id="discountCode"
                  type="text"
                  placeholder="Enter your discount code"
                  {...register("discountCode")}
                  className={`${inputBase} mt-1.5`}
                />
              </div>

              {submitError && (
                <div className="rounded-lg border border-[#dc2626]/20 bg-[#dc2626]/10 p-4 text-[13px] text-[#f87171]">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1d4ed8] py-3.5 text-[13px] font-bold text-white transition hover:bg-[#1e40af] disabled:opacity-50 active:scale-[0.98]"
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
                    <Calendar size={16} />
                    Book Appointment
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-[#3a3a45]">
                This is a booking request, not an instant confirmation. The owner will review and confirm your appointment.
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5">
              <h3 className="text-[13px] font-semibold">Contact Information</h3>
              <p className="mt-0.5 text-[12px] text-[#5a5a65]">Multiple ways to reach us</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Phone size={15} className="mt-0.5 shrink-0 text-[#1d4ed8]" />
                  <div>
                    <p className="text-[12px] font-semibold">Phone &amp; SMS</p>
                    <p className="text-[11px] text-[#5a5a65]">Call or message on WhatsApp</p>
                    <a href={siteConfig.phoneHref} className="text-[13px] text-white hover:underline">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail01 size={15} className="mt-0.5 shrink-0 text-[#1d4ed8]" />
                  <div>
                    <p className="text-[12px] font-semibold">Email</p>
                    <p className="text-[11px] text-[#5a5a65]">Email us your questions</p>
                    <a href={`mailto:${siteConfig.email}`} className="text-[13px] text-white hover:underline">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={15} className="mt-0.5 shrink-0 text-[#1d4ed8]" />
                  <div>
                    <p className="text-[12px] font-semibold">Business Hours</p>
                    <p className="text-[11px] text-[#8a8a95]">{siteConfig.hours.weekday}</p>
                    <p className="text-[11px] text-[#8a8a95]">{siteConfig.hours.saturday}</p>
                    <p className="text-[11px] text-[#dc2626]">{siteConfig.hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.04]">
              <Image
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80"
                alt="London service area"
                fill
                sizes="360px"
                className="object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center gap-2 rounded-full bg-[#0f0f14]/90 px-4 py-2 text-[11px] font-semibold text-white">
                  <MarkerPin01 size={12} />
                  Mobile service across London
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5">
              <h3 className="text-[13px] font-semibold">Why Book With Us?</h3>
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
                  <li key={item} className="flex items-center gap-2 text-[12px] text-[#8a8a95]">
                    <CheckVerified02 size={14} className="shrink-0 text-[#22c55e]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#c5a059]/15 bg-gradient-to-br from-[#c5a059]/8 to-[#0f0f14] p-5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c5a059] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#09090d]">
                <Gift01 size={12} />
                Limited Time Offer
              </span>
              <p className="mt-3 text-[13px] font-semibold">
                Get 20% off your first service when you book online
              </p>
              <p className="mt-2 text-[12px] text-[#5a5a65]">
                Use code: <span className="font-bold text-[#c5a059]">FIRST20</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
