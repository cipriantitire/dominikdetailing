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
import CustomSelect from "@/components/form/CustomSelect";
import CustomMultiSelect from "@/components/form/CustomMultiSelect";
import CustomCalendar from "@/components/form/CustomCalendar";
import { bookingSchema } from "@/lib/validations/booking";
import { isValidUkPostcode, normalizeUkPostcode } from "@/lib/location/ukPostcode";
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
  discountCode: z.string().max(50).optional(),
});

type BookingFormInput = z.input<typeof bookingFormSchema>;
type BookingFormData = z.output<typeof bookingFormSchema>;

type PostcodeContext = {
  postcode: string;
  country?: string;
  region?: string;
  district?: string;
  ward?: string;
  parish?: string;
  latitude?: number;
  longitude?: number;
};

type PostcodeLookupResponse = {
  ok?: boolean;
  postcode?: string;
  message?: string;
  error?: string;
  postcodeContext?: PostcodeContext | null;
  location?: {
    latitude?: number;
    longitude?: number;
  } | null;
};

const DEFAULT_MAP_EMBED_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=-0.35%2C51.35%2C0.15%2C51.65&layer=mapnik";

const buildMapEmbedSrc = (latitude: number, longitude: number) => {
  const delta = 0.02;
  const minLon = longitude - delta;
  const minLat = latitude - delta;
  const maxLon = longitude + delta;
  const maxLat = latitude + delta;

  const params = new URLSearchParams({
    bbox: `${minLon},${minLat},${maxLon},${maxLat}`,
    layer: "mapnik",
    marker: `${latitude},${longitude}`,
  });

  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
};

export default function BookPageContent() {
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [addressLookupLoading, setAddressLookupLoading] = useState(false);
  const [addressLookupError, setAddressLookupError] = useState("");
  const [postcodeLookupMessage, setPostcodeLookupMessage] = useState("");
  const [postcodeContext, setPostcodeContext] = useState<PostcodeContext | null>(null);
  const [mapEmbedSrc, setMapEmbedSrc] = useState(DEFAULT_MAP_EMBED_SRC);
  const [keyCollectionSame, setKeyCollectionSame] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BookingFormInput, undefined, BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      selectedExtras: [],
      requestedService: searchParams.get("service") || "",
      postcode: searchParams.get("postcode") || "",
      requestedDate: searchParams.get("date") || "",
      requestedTime: searchParams.get("time") || "",
    },
  });
  const selectedExtras = useWatch({ control, name: "selectedExtras", defaultValue: [] }) || [];
  const requestedServiceValue = useWatch({ control, name: "requestedService", defaultValue: "" }) || "";
  const requestedDateValue = useWatch({ control, name: "requestedDate", defaultValue: "" }) || "";
  const requestedTimeValue = useWatch({ control, name: "requestedTime", defaultValue: "" }) || "";

  const serviceOptions = serviceTiers.map((t) => ({ value: t.id, label: t.name }));
  const timeOptions = timeWindows.map((tw) => ({ value: tw, label: tw }));
  const extraOptions = serviceExtras.map((e) => ({ value: e.id, label: `${e.name} (+£${e.price})` }));

  useEffect(() => {
    const service = searchParams.get("service");
    const postcode = searchParams.get("postcode");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    if (service) setValue("requestedService", service);
    if (postcode) setValue("postcode", normalizeUkPostcode(postcode));
    if (date) setValue("requestedDate", date);
    if (time) setValue("requestedTime", time);
  }, [searchParams, setValue]);

  const postcodeRegistration = register("postcode");

  const findAddressOptions = async () => {
    const postcodeValue = getValues("postcode");
    const postcode = normalizeUkPostcode(typeof postcodeValue === "string" ? postcodeValue : "");
    setValue("postcode", postcode, { shouldValidate: true, shouldDirty: true });

    if (!postcode) {
      setPostcodeLookupMessage("");
      setPostcodeContext(null);
      setMapEmbedSrc(DEFAULT_MAP_EMBED_SRC);
      setAddressLookupError("Enter a postcode to find addresses.");
      return;
    }

    if (!isValidUkPostcode(postcode)) {
      setPostcodeLookupMessage("");
      setPostcodeContext(null);
      setMapEmbedSrc(DEFAULT_MAP_EMBED_SRC);
      setAddressLookupError("Enter a valid UK postcode (for example SW1A 1AA).");
      return;
    }

    setAddressLookupLoading(true);
    setAddressLookupError("");
    setPostcodeLookupMessage("");
    setPostcodeContext(null);
    setMapEmbedSrc(DEFAULT_MAP_EMBED_SRC);

    try {
      const response = await fetch(`/api/address-lookup?postcode=${encodeURIComponent(postcode)}`);
      const payload = (await response.json()) as PostcodeLookupResponse;

      if (!response.ok || !payload?.ok) {
        setAddressLookupError(
          payload?.error || "Could not find addresses for this postcode. Please enter your address manually."
        );
        return;
      }

      if (typeof payload.postcode === "string" && payload.postcode.length > 0) {
        setValue("postcode", payload.postcode, { shouldValidate: true, shouldDirty: true });
      }

      const context =
        payload.postcodeContext && typeof payload.postcodeContext === "object"
          ? payload.postcodeContext
          : null;

      setPostcodeContext(context);

      const latitude =
        typeof payload.location?.latitude === "number"
          ? payload.location.latitude
          : typeof context?.latitude === "number"
            ? context.latitude
            : null;

      const longitude =
        typeof payload.location?.longitude === "number"
          ? payload.location.longitude
          : typeof context?.longitude === "number"
            ? context.longitude
            : null;

      if (typeof latitude === "number" && typeof longitude === "number") {
        setMapEmbedSrc(buildMapEmbedSrc(latitude, longitude));
      }

      setPostcodeLookupMessage(
        typeof payload.message === "string" && payload.message.length > 0
          ? payload.message
          : "Postcode confirmed. Enter your street and house number manually."
      );
    } catch {
      setAddressLookupError("Address lookup is unavailable right now. Please type your address manually.");
    } finally {
      setAddressLookupLoading(false);
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
        postcode: normalizeUkPostcode(data.postcode),
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
    "w-full rounded-lg border border-white/[0.06] bg-[#0a0a0f] px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#484855] outline-none transition hover:bg-[#141419] focus:bg-[#141419] focus:border-transparent";
  const labelBase = "block text-[12px] font-semibold text-[#9696a3]";
  const errorBase = "mt-1 text-[11px] text-[#dc2626]";

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#09090d] text-white">
        <SiteHeader />
        <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center md:px-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/10 text-[#22c55e]">
            <CheckVerified02 size={32} />
          </div>
          <h1 className="mt-6 text-[32px] font-bold tracking-tight text-balance md:text-[40px]">
            Request Received
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-[#686878]">
            Thank you. We have received your booking request and will review it shortly. You will hear back from us within 24 hours to confirm your appointment.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-6 py-3 text-[13px] font-semibold text-white transition-[colors,transform] hover:bg-[#1e40af] active:scale-[0.96]"
            >
              Back to Home
            </Link>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-6 py-3 text-[13px] font-semibold text-white transition-[colors,transform,border-color] hover:border-white/20 active:scale-[0.96]"
            >
              <MessageChatSquare size={16} />
              Message on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-[12px] text-[#484855]">
            Need to make changes? Call us at{" "}
            <a href={siteConfig.phoneHref} className="text-[#686878] hover:text-white">
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
      <main className="mx-auto max-w-7xl px-4 pt-12 pb-10 md:px-6 md:pt-[70px] md:pb-14">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[13px] text-[#686878] transition hover:text-white"
          >
            <ArrowRight size={14} className="rotate-180" />
            Back to home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-[32px] font-bold tracking-tight text-balance md:text-[48px]">
            Schedule Your <span className="text-[#1d4ed8]">Appointment</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-[#686878]">
            Choose your preferred date, time, and service. We&apos;ll confirm your appointment within 24 hours.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 md:p-8">
            <h2 className="text-[16px] font-semibold">Book Your Service</h2>
            <p className="mt-1 text-[13px] text-[#686878]">
              Fill out the form to schedule your appointment
            </p>

            <a
              href={siteConfig.phoneHref}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/5 py-3 text-[13px] font-semibold text-[#22c55e] transition-[colors,transform,border-color] hover:bg-[#22c55e]/10 active:scale-[0.96]"
            >
              <Phone size={16} />
              Don&apos;t feel like filling forms? Call us now!
            </a>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">

              {/* Row 1: Service + Extras (full width mobile), Date + Time (half mobile) */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="col-span-2 sm:col-span-1 lg:col-span-1">
                  <label htmlFor="requestedService" className={labelBase}>
                    Select Service <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="mt-1.5">
                    <CustomSelect
                      id="requestedService"
                      value={requestedServiceValue}
                      onChange={(v) => setValue("requestedService", v, { shouldValidate: true, shouldDirty: true })}
                      options={serviceOptions}
                      placeholder="Choose a service"
                    />
                  </div>
                  {errors.requestedService && <p className={errorBase}>{errors.requestedService.message}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1 lg:col-span-1">
                  <label className={labelBase}>Select Extras (Optional)</label>
                  <div className="mt-1.5">
                    <CustomMultiSelect
                      value={selectedExtras}
                      onChange={(v) => setValue("selectedExtras", v, { shouldValidate: true, shouldDirty: true })}
                      options={extraOptions}
                      placeholder="Choose extras"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label htmlFor="requestedDate" className={labelBase}>
                    Select Date <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="mt-1.5">
                    <CustomCalendar
                      id="requestedDate"
                      value={requestedDateValue}
                      onChange={(v) => setValue("requestedDate", v, { shouldValidate: true, shouldDirty: true })}
                      minDate={minDate}
                    />
                  </div>
                  {errors.requestedDate && <p className={errorBase}>{errors.requestedDate.message}</p>}
                </div>

                <div className="col-span-1">
                  <label htmlFor="requestedTime" className={labelBase}>
                    Select Time <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="mt-1.5">
                    <CustomSelect
                      id="requestedTime"
                      value={requestedTimeValue}
                      onChange={(v) => setValue("requestedTime", v, { shouldValidate: true, shouldDirty: true })}
                      options={timeOptions}
                      placeholder="Select time"
                    />
                  </div>
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
                      title={postcodeContext?.postcode ? `Map for ${postcodeContext.postcode}` : "London service area"}
                      src={mapEmbedSrc}
                      className="h-full w-full border-0"
                      style={{
                        filter: "invert(90%) hue-rotate(180deg) brightness(0.75) contrast(1.1)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle & Location — 2×2 grid on mobile, desktop 4-col */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {/* DOM order: Make, Model, Car Location, Registration, Color, Key Location, Map */}
                {/* Mobile order: Make(1), Model(2), Registration(3), Color(4), Map(5), Car Location(6), Key Location(7) */}

                <div className="order-1 sm:order-none col-span-1">
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

                <div className="order-2 sm:order-none col-span-1">
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

                {/* Desktop: Car Location sits on row 1 right (span 2) */}
                <div className="order-6 sm:order-none col-span-2 sm:col-span-2">
                  <label htmlFor="postcode" className={labelBase}>
                    Car Location <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="mt-1.5 space-y-2">
                    <div className="relative">
                      <input
                        id="postcode"
                        type="text"
                        inputMode="text"
                        autoComplete="postal-code"
                        placeholder="UK postcode (e.g. SW1A 1AA)"
                        {...postcodeRegistration}
                        onChange={(event) => {
                          postcodeRegistration.onChange(event);
                          setAddressLookupError("");
                          setPostcodeLookupMessage("");
                          setPostcodeContext(null);
                          setMapEmbedSrc(DEFAULT_MAP_EMBED_SRC);
                        }}
                        onBlur={(event) => {
                          postcodeRegistration.onBlur(event);
                          const normalized = normalizeUkPostcode(event.target.value);
                          setValue("postcode", normalized, { shouldValidate: true, shouldDirty: true });
                        }}
                        className={`${inputBase} w-full pr-[116px]`}
                      />
                      <button
                        type="button"
                        onClick={findAddressOptions}
                        disabled={addressLookupLoading}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md border border-white/[0.08] bg-[#141419] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:border-white/20 hover:bg-[#1a1a20] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {addressLookupLoading ? "Checking..." : "Check"}
                      </button>
                    </div>

                    {errors.postcode && <p className={errorBase}>{errors.postcode.message}</p>}
                    {addressLookupError && <p className={errorBase}>{addressLookupError}</p>}
                    {postcodeLookupMessage && <p className="text-[11px] text-[#22c55e]">{postcodeLookupMessage}</p>}
                    {postcodeContext && (
                      <p className="text-[11px] text-[#686878]">
                        {[
                          postcodeContext.district,
                          postcodeContext.ward,
                          postcodeContext.region,
                          postcodeContext.country,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}

                    <input
                      id="address"
                      type="text"
                      autoComplete="street-address"
                      placeholder="Street and house number"
                      {...register("address")}
                      className={inputBase}
                    />
                    {errors.address && <p className={errorBase}>{errors.address.message}</p>}
                    <p className="text-[11px] text-[#686878]">
                      Check your postcode first, then enter house number and street address manually.
                    </p>
                  </div>
                </div>

                <div className="order-3 sm:order-none col-span-1">
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

                <div className="order-4 sm:order-none col-span-1">
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

                {/* Desktop: Key Location sits on row 2 right (span 2) */}
                <div className="order-7 sm:order-none col-span-2 sm:col-span-2">
                  <label htmlFor="keyCollectionAddress" className={labelBase}>
                    Key Location
                  </label>
                  <div className="mt-1.5 relative">
                    <input
                      id="keyCollectionAddress"
                      type="text"
                      placeholder={keyCollectionSame ? "Same as car location" : "Enter key collection address"}
                      disabled={keyCollectionSame}
                      {...register("keyCollectionAddress")}
                      className={`${inputBase} w-full pr-14 disabled:opacity-40`}
                    />

                    <button
                      type="button"
                      onClick={() => setKeyCollectionSame((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex cursor-pointer items-center"
                      aria-label="Use car location as key collection address"
                      title="Toggle same as car location"
                    >
                      <span className="sr-only">Same as car location</span>
                      <span
                        className={`h-6 w-11 rounded-full relative transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] ${keyCollectionSame ? "bg-[#22c55e] after:translate-x-full" : "bg-[#1a1a20]"}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Mobile-only map, above Car Location */}
                <div className="order-5 sm:order-none col-span-2 sm:hidden">
                  <label className={labelBase}>Service Area</label>
                  <div className="mt-1.5 h-44 overflow-hidden rounded-lg border border-white/[0.06]">
                    <iframe
                      title={postcodeContext?.postcode ? `Map for ${postcodeContext.postcode}` : "London service area"}
                      src={mapEmbedSrc}
                      className="h-full w-full border-0"
                      style={{
                        filter: "invert(90%) hue-rotate(180deg) brightness(0.75) contrast(1.1)",
                      }}
                    />
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1d4ed8] py-3.5 text-[13px] font-bold text-white transition-[colors,transform] hover:bg-[#1e40af] disabled:opacity-50 active:scale-[0.96]"
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

              <p className="text-center text-[11px] text-[#484855]">
                This is a booking request, not an instant confirmation. The owner will review and confirm your appointment.
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5">
              <h3 className="text-[13px] font-semibold">Contact Information</h3>
              <p className="mt-0.5 text-[12px] text-[#686878]">Multiple ways to reach us</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Phone size={15} className="mt-0.5 shrink-0 text-[#1d4ed8]" />
                  <div>
                    <p className="text-[12px] font-semibold">Phone &amp; SMS</p>
                    <p className="text-[11px] text-[#686878]">Call or message on WhatsApp</p>
                    <a href={siteConfig.phoneHref} className="text-[13px] text-white hover:underline">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail01 size={15} className="mt-0.5 shrink-0 text-[#1d4ed8]" />
                  <div>
                    <p className="text-[12px] font-semibold">Email</p>
                    <p className="text-[11px] text-[#686878]">Email us your questions</p>
                    <a href={`mailto:${siteConfig.email}`} className="text-[13px] text-white hover:underline">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={15} className="mt-0.5 shrink-0 text-[#1d4ed8]" />
                  <div>
                    <p className="text-[12px] font-semibold">Business Hours</p>
                    <p className="text-[11px] text-[#9696a3]">{siteConfig.hours.weekday}</p>
                    <p className="text-[11px] text-[#9696a3]">{siteConfig.hours.saturday}</p>
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
                  <li key={item} className="flex items-center gap-2 text-[12px] text-[#9696a3]">
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
              <p className="mt-2 text-[12px] text-[#686878]">
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
