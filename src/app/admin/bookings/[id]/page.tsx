"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBooking, updateBooking, confirmBooking, getWhatsAppMessage, reopenBooking } from "@/lib/admin/api";
import { BookingRequest, statusLabels, statusColors } from "@/types/admin";
import { serviceTiers, serviceExtras } from "@/config/services";
import {
  ArrowLeft,
  Phone,
  Mail01,
  MarkerPin01,
  Calendar,
  Clock,
  Copy01,
  CheckVerified02,
  MessageChatSquare,
  XClose,
  AlertTriangle,
  Send01,
  LinkExternal01,
  CalendarCheck01,
} from "@untitledui/icons";

function getServiceName(id: string) {
  return serviceTiers.find((s) => s.id === id)?.name || id;
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateCalendarLink(booking: BookingRequest): string {
  if (!booking.confirmed_start_at) return "";
  const serviceName = getServiceName(booking.requested_service);
  const title = encodeURIComponent(`Dominik Detailing — ${serviceName}`);
  const start = new Date(booking.confirmed_start_at)
    .toISOString()
    .replace(/-|:|\./g, "");
  const end = booking.confirmed_end_at
    ? new Date(booking.confirmed_end_at).toISOString().replace(/-|:|\./g, "")
    : start;
  const dates = `${start}/${end}`;
  const details = encodeURIComponent(
    `Address: ${booking.address}${booking.postcode ? " / " + booking.postcode : ""}\nPhone: ${booking.customer_phone}`
  );
  const location = encodeURIComponent(
    booking.address + (booking.postcode ? " " + booking.postcode : "")
  );
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
}

function toWhatsAppNumber(phone?: string | null) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `44${digits.slice(1)}`;
  return digits;
}

function formatDateToICS(dt: string) {
  const d = new Date(dt);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function generateICS(booking: BookingRequest) {
  const serviceName = getServiceName(booking.requested_service);
  const uid = `${booking.id}@dominikdetailing`;
  const dtstamp = formatDateToICS(new Date().toISOString());
  const dtstart = booking.confirmed_start_at ? formatDateToICS(booking.confirmed_start_at) : dtstamp;
  const dtend = booking.confirmed_end_at ? formatDateToICS(booking.confirmed_end_at) : dtstart;
  const descriptionParts = [
    `Service: ${serviceName}`,
    `Phone: ${booking.customer_phone}`,
    booking.selected_extras.length ? `Extras: ${booking.selected_extras.join(', ')}` : '',
    booking.notes ? `Notes: ${booking.notes}` : '',
  ].filter(Boolean);

  const description = descriptionParts.join('\\n');
  const location = `${booking.address}${booking.postcode ? ' ' + booking.postcode : ''}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dominik Detailing//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:Dominik Detailing — ${serviceName}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function downloadICSFile(booking: BookingRequest) {
  const ics = generateICS(booking);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filename = `dominikdetailing-${booking.id}.ics`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);
  const [whatsAppError, setWhatsAppError] = useState("");
  const [whatsAppMessage, setWhatsAppMessage] = useState("");
  const [copiedConfirm, setCopiedConfirm] = useState(false);
  const [copiedInitial, setCopiedInitial] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [reopening, setReopening] = useState(false);

  // Editable fields
  const [internalNotes, setInternalNotes] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [proposedTime, setProposedTime] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      const result = await getBooking(id);
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error);
      } else {
        setBooking(result.data);
        setInternalNotes(result.data.internal_notes || "");
        if (result.data.proposed_start_at) {
          const d = new Date(result.data.proposed_start_at);
          setProposedDate(d.toISOString().split("T")[0]);
          setProposedTime(
            d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          );
        }
        setEmailSent(!!result.data.customer_notification_sent);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function saveChanges() {
    if (!booking) return;
    setSaving(true);
    setSaveError("");

    const updates: Parameters<typeof updateBooking>[1] = {
      internal_notes: internalNotes.trim() || null,
    };

    if (proposedDate) {
      const time = proposedTime || "09:00";
      const [hours, minutes] = time.split(":");
      const start = new Date(proposedDate);
      start.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      updates.proposed_start_at = start.toISOString();
      const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
      updates.proposed_end_at = end.toISOString();
    } else {
      updates.proposed_start_at = null;
      updates.proposed_end_at = null;
    }

    const result = await updateBooking(booking.id, updates);
    if (!result.ok) {
      setSaveError(result.error);
    } else {
      setBooking(result.data);
    }
    setSaving(false);
  }

  async function setStatus(
    status: "reviewing" | "proposed" | "declined" | "cancelled"
  ) {
    if (!booking) return;
    setSaving(true);
    setSaveError("");
    const result = await updateBooking(booking.id, { status });
    if (!result.ok) {
      setSaveError(result.error);
    } else {
      setBooking(result.data);
    }
    setSaving(false);
  }

  async function handleConfirm() {
    if (!booking) return;
    setConfirming(true);
    setConfirmError("");

    let start: string;
    let end: string | null = null;

    if (booking.proposed_start_at) {
      start = booking.proposed_start_at;
      end = booking.proposed_end_at;
    } else if (proposedDate) {
      const time = proposedTime || "09:00";
      const [h, m] = time.split(":");
      const d = new Date(proposedDate);
      d.setHours(parseInt(h), parseInt(m), 0, 0);
      start = d.toISOString();
      const e = new Date(d.getTime() + 4 * 60 * 60 * 1000);
      end = e.toISOString();
    } else {
      const d = new Date(booking.requested_date);
      d.setHours(9, 0, 0, 0);
      start = d.toISOString();
      const e = new Date(d.getTime() + 4 * 60 * 60 * 1000);
      end = e.toISOString();
    }

    const result = await confirmBooking(booking.id, start, end, false);
    if (!result.ok) {
      setConfirmError(result.error);
    } else {
      setBooking(result.data);
      setEmailSent(!!result.data.customer_notification_sent);
    }
    setConfirming(false);
  }

  async function handleSendEmail() {
    if (!booking || !booking.confirmed_start_at) return;
    setSendingEmail(true);
    setEmailError("");
    const result = await confirmBooking(
      booking.id,
      booking.confirmed_start_at,
      booking.confirmed_end_at,
      true
    );
    if (!result.ok) {
      setEmailError(result.error);
    } else {
      setBooking(result.data);
      setEmailSent(true);
    }
    setSendingEmail(false);
  }

  async function fetchWhatsAppMessage(): Promise<string> {
    if (!booking) return "";
    if (whatsAppMessage) return whatsAppMessage;
    setLoadingWhatsApp(true);
    setWhatsAppError("");
    const result = await getWhatsAppMessage(booking.id);
    setLoadingWhatsApp(false);
    if (!result.ok) {
      setWhatsAppError(result.error);
      return "";
    }
    setWhatsAppMessage(result.data);
    return result.data;
  }

  // Prefetch the WhatsApp confirmation message for confirmed bookings so the owner
  // has it ready to open/copy without waiting for the button press.
  useEffect(() => {
    if (!booking) return;
    if (
      booking.status === "confirmed" &&
      booking.confirmed_start_at &&
      !whatsAppMessage
    ) {
      // fetch in microtask to avoid React synchronous setState in effect body
      Promise.resolve().then(() => {
        fetchWhatsAppMessage().catch(() => {});
      });
    }
    // Only trigger when booking id or status changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id, booking?.status, booking?.confirmed_start_at]);

  async function handleOpenWhatsApp() {
    if (!booking) return;
    const msg = await fetchWhatsAppMessage();
    if (!msg) return;
    const phone = toWhatsAppNumber(booking.customer_phone);
    if (!phone) {
      setWhatsAppError("No valid customer phone number for WhatsApp.");
      return;
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleCopyConfirmMessage() {
    const msg = await fetchWhatsAppMessage();
    if (!msg) return;
    navigator.clipboard.writeText(msg);
    setCopiedConfirm(true);
    setTimeout(() => setCopiedConfirm(false), 2000);
  }

  function copyInitialWhatsAppMessage() {
    if (!booking) return;
    const extras = booking.selected_extras
      .map((eid) => serviceExtras.find((e) => e.id === eid)?.name)
      .filter(Boolean)
      .join(", ");
    const msg = `Hi ${booking.customer_name}, this is Dominik Detailing. I've received your request for ${getServiceName(booking.requested_service)} on ${booking.requested_date}. ${extras ? `Extras: ${extras}. ` : ""}I'll confirm the exact time with you shortly. Thanks!`;
    navigator.clipboard.writeText(msg);
    setCopiedInitial(true);
    setTimeout(() => setCopiedInitial(false), 2000);
  }

  function handleCopySummary() {
    if (!booking) return;
    const extras = booking.selected_extras
      .map((eid) => serviceExtras.find((e) => e.id === eid)?.name)
      .filter(Boolean)
      .join(", ");
    const parts: string[] = [
      `Name: ${booking.customer_name}`,
      `Phone: ${booking.customer_phone}`,
    ];
    if (booking.customer_email) parts.push(`Email: ${booking.customer_email}`);
    parts.push(`Service: ${getServiceName(booking.requested_service)}`);
    if (extras) parts.push(`Extras: ${extras}`);
    parts.push(`Requested slot: ${booking.requested_date} ${booking.requested_time}`);
    if (booking.proposed_start_at)
      parts.push(
        `Proposed: ${new Date(booking.proposed_start_at).toLocaleString("en-GB")}`
      );
    if (booking.confirmed_start_at)
      parts.push(
        `Confirmed: ${new Date(booking.confirmed_start_at).toLocaleString("en-GB")}`
      );
    if (booking.address) parts.push(`Address: ${booking.address}`);
    if (booking.postcode) parts.push(`Postcode: ${booking.postcode}`);
    if (booking.notes) parts.push(`Notes: ${booking.notes}`);

    const text = parts.join("\n");
    try {
      navigator.clipboard.writeText(text);
      setSaveError("");
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch (e) {
      setSaveError("Could not copy summary");
    }
  }

  const isPreConfirm =
    booking?.status === "pending" ||
    booking?.status === "reviewing" ||
    booking?.status === "proposed";

  const hasProposedTime =
    !!booking?.proposed_start_at || (!!proposedDate && !!proposedTime);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[13px] text-[#686878]">Loading booking...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="rounded-lg border border-[#dc2626]/20 bg-[#dc2626]/10 p-4 text-[13px] text-[#f87171]">
        {error || "Booking not found"}
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-[53px] z-40 -mx-4 bg-[#09090d]/90 backdrop-blur-xl md:-mx-6">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-5">
          <button
            onClick={() => router.back()}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-lg px-2 -ml-2 text-[13px] text-[#686878] transition-colors hover:text-white active:scale-[0.96]"
          >
            <ArrowLeft size={14} />
            Back to requests
          </button>

          {/* Header */}
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[22px] font-bold tracking-tight text-balance md:text-[26px]">
                  {booking.customer_name}
                </h1>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[booking.status]}`}
                >
                  {statusLabels[booking.status]}
                </span>
                {booking.customer_notification_sent && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-2 py-0.5 text-[11px] text-[#22c55e]">
                  <Mail01 size={10} />
                  Customer notified
                </span>
                )}
                {(booking.status === 'declined' || booking.status === 'cancelled') && (
                  <button
                  onClick={async () => {
                    if (!booking) return
                    setReopening(true)
                    try {
                      const res = await reopenBooking(booking.id)
                      if (!res.ok) {
                        setSaveError(res.error)
                      } else {
                        setBooking(res.data)
                        setSaveError('')
                      }
                    } catch (err) {
                      setSaveError('Could not reopen booking')
                    }
                    setReopening(false)
                  }}
                  disabled={reopening}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[12px] font-semibold text-[#9696a3] transition-colors hover:bg-white/[0.04] disabled:opacity-50 active:scale-[0.96]"
                >
                  {reopening ? 'Reopening...' : 'Reopen'}
                </button>
              )}
              </div>
              <p className="mt-1 text-[12px] text-[#484855] tabular-nums">
                Submitted{" "}
                {new Date(booking.created_at).toLocaleString("en-GB")}
              </p>
            </div>

            {/* Status actions */}
            <div className="flex flex-wrap gap-2">
              {booking.status === "pending" && (
                <button
                  onClick={() => setStatus("reviewing")}
                  disabled={saving}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#c5a059]/25 bg-[#c5a059]/5 px-3 py-2 text-[12px] font-semibold text-[#c5a059] transition-colors hover:bg-[#c5a059]/10 disabled:opacity-50 active:scale-[0.96]"
                >
                  <AlertTriangle size={14} />
                  Mark Reviewing
                </button>
              )}
              {(booking.status === "pending" || booking.status === "reviewing") && (
                <button
                  onClick={() => setStatus("proposed")}
                  disabled={saving}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#8b5cf6]/25 bg-[#8b5cf6]/5 px-3 py-2 text-[12px] font-semibold text-[#8b5cf6] transition-colors hover:bg-[#8b5cf6]/10 disabled:opacity-50 active:scale-[0.96]"
                >
                  <CheckVerified02 size={14} />
                  Mark Proposed
                </button>
              )}
              {isPreConfirm && (
                <>
                  <button
                    onClick={() => setStatus("declined")}
                    disabled={saving}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#dc2626]/25 bg-[#dc2626]/5 px-3 py-2 text-[12px] font-semibold text-[#dc2626] transition-colors hover:bg-[#dc2626]/10 disabled:opacity-50 active:scale-[0.96]"
                  >
                    <XClose size={14} />
                    Decline
                  </button>
                  <button
                    onClick={() => setStatus("cancelled")}
                    disabled={saving}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#686878]/25 bg-white/[0.02] px-3 py-2 text-[12px] font-semibold text-[#686878] transition-colors hover:bg-white/[0.04] disabled:opacity-50 active:scale-[0.96]"
                  >
                    Cancel
                  </button>
                </>
              )}
              {booking.status === "confirmed" && (
                <button
                  onClick={() => setStatus("cancelled")}
                  disabled={saving}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#686878]/25 bg-white/[0.02] px-3 py-2 text-[12px] font-semibold text-[#686878] transition-colors hover:bg-white/[0.04] disabled:opacity-50 active:scale-[0.96]"
                >
                  Cancel booking
                </button>
              )}
            </div>
          </div>

          {/* Errors */}
          {saveError && (
            <div className="mt-3 rounded-lg border border-[#dc2626]/20 bg-[#dc2626]/10 p-3 text-[12px] text-[#f87171]">
              {saveError}
            </div>
          )}
          {confirmError && (
            <div className="mt-3 rounded-lg border border-[#dc2626]/20 bg-[#dc2626]/10 p-3 text-[12px] text-[#f87171]">
              {confirmError}
            </div>
          )}
          {emailError && (
            <div className="mt-3 rounded-lg border border-[#dc2626]/20 bg-[#dc2626]/10 p-3 text-[12px] text-[#f87171]">
              {emailError}
            </div>
          )}
          {whatsAppError && (
            <div className="mt-3 rounded-lg border border-[#dc2626]/20 bg-[#dc2626]/10 p-3 text-[12px] text-[#f87171]">
              {whatsAppError}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-5">
          {/* Customer Requested */}
          <section className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#c5a059]">
              Customer Requested
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <Calendar size={15} className="mt-0.5 shrink-0 text-[#c5a059]" />
                <div>
                  <p className="text-[12px] text-[#686878]">Date</p>
                  <p className="text-[13px] font-medium text-white tabular-nums">
                    {booking.requested_date}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={15} className="mt-0.5 shrink-0 text-[#c5a059]" />
                <div>
                  <p className="text-[12px] text-[#686878]">Time</p>
                  <p className="text-[13px] font-medium text-white tabular-nums">
                    {booking.requested_time}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* We Plan to Schedule */}
          <section className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#1d4ed8]">
              We Plan to Schedule
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[12px] text-[#686878]">
                  Proposed Date
                </label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/[0.06] bg-[#0a0a0f] px-3 py-2 text-[13px] text-white outline-none transition-colors focus:border-[#1d4ed8]/50 focus:ring-1 focus:ring-[#1d4ed8]/20"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#686878]">
                  Proposed Time
                </label>
                <input
                  type="time"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/[0.06] bg-[#0a0a0f] px-3 py-2 text-[13px] text-white outline-none transition-colors focus:border-[#1d4ed8]/50 focus:ring-1 focus:ring-[#1d4ed8]/20"
                />
              </div>
              {booking.proposed_start_at && (
                <p className="text-[12px] text-[#484855] tabular-nums">
                  Currently saved:{" "}
                  {formatDateTime(booking.proposed_start_at)}
                </p>
              )}
            </div>
          </section>

          {/* Confirmed Booking */}
          {booking.status === "confirmed" && (
            <section className="rounded-xl border border-[#22c55e]/15 bg-[#0f0f14] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#22c55e]">
                Confirmed Booking
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CalendarCheck01
                    size={15}
                    className="mt-0.5 shrink-0 text-[#22c55e]"
                  />
                  <div>
                    <p className="text-[12px] text-[#686878]">Date & Time</p>
                    <p className="text-[13px] font-medium text-white">
                      {formatDateTime(booking.confirmed_start_at)}
                    </p>
                    {booking.confirmed_end_at && (
                      <p className="text-[12px] text-[#484855]">
                        Until{" "}
                        {formatDateTime(booking.confirmed_end_at)}
                      </p>
                    )}
                  </div>
                </div>
                {booking.google_calendar_event_id && (
                  <div className="flex items-start gap-3">
                    <Calendar
                      size={15}
                      className="mt-0.5 shrink-0 text-[#22c55e]"
                    />
                    <div>
                      <p className="text-[12px] text-[#686878]">
                        Google Calendar
                      </p>
                      <p className="text-[12px] text-[#22c55e]">
                        Event created
                      </p>
                    </div>
                  </div>
                )}
                    <button
                      onClick={handleCopySummary}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[12px] font-semibold text-[#9696a3] transition-colors hover:bg-white/[0.04] disabled:opacity-50 active:scale-[0.96]"
                    >
                      <Copy01 size={12} />
                      {copiedSummary ? "Copied!" : "Copy summary"}
                    </button>
              </div>
            </section>
          )}

          {/* Customer Info */}
          <section className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#9696a3]">
              Customer Info
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={15} className="mt-0.5 shrink-0 text-[#22c55e]" />
                <div>
                  <p className="text-[12px] text-[#686878]">Phone</p>
                  <a
                    href={`tel:${booking.customer_phone}`}
                    className="text-[13px] font-medium text-white hover:underline tabular-nums"
                  >
                    {booking.customer_phone}
                  </a>
                </div>
              </div>
              {booking.customer_email && (
                <div className="flex items-start gap-3">
                  <Mail01
                    size={15}
                    className="mt-0.5 shrink-0 text-[#1d4ed8]"
                  />
                  <div>
                    <p className="text-[12px] text-[#686878]">Email</p>
                    <a
                      href={`mailto:${booking.customer_email}`}
                      className="text-[13px] font-medium text-white hover:underline"
                    >
                      {booking.customer_email}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MarkerPin01
                  size={15}
                  className="mt-0.5 shrink-0 text-[#1d4ed8]"
                />
                <div>
                  <p className="text-[12px] text-[#686878]">Address</p>
                  <p className="text-[13px] text-white">{booking.address}</p>
                  {booking.postcode && (
                    <p className="text-[12px] text-[#9696a3]">
                      {booking.postcode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Vehicle Info */}
          <section className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#9696a3]">
              Vehicle
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[12px] text-[#686878]">Vehicle</p>
                <p className="text-[13px] text-white">{booking.vehicle}</p>
              </div>
              {booking.vehicle_make && (
                <div>
                  <p className="text-[12px] text-[#686878]">Make</p>
                  <p className="text-[13px] text-white">
                    {booking.vehicle_make}
                  </p>
                </div>
              )}
              {booking.vehicle_model && (
                <div>
                  <p className="text-[12px] text-[#686878]">Model</p>
                  <p className="text-[13px] text-white">
                    {booking.vehicle_model}
                  </p>
                </div>
              )}
              {booking.registration && (
                <div>
                  <p className="text-[12px] text-[#686878]">Registration</p>
                  <p className="text-[13px] font-mono text-white">
                    {booking.registration}
                  </p>
                </div>
              )}
              {booking.colour && (
                <div>
                  <p className="text-[12px] text-[#686878]">Colour</p>
                  <p className="text-[13px] text-white">{booking.colour}</p>
                </div>
              )}
              {booking.key_collection_address && (
                <div>
                  <p className="text-[12px] text-[#686878]">
                    Key Collection
                  </p>
                  <p className="text-[13px] text-white">
                    {booking.key_collection_address}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Service */}
          <section className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#9696a3]">
              Service
            </h2>
            <div className="mt-4">
              <p className="text-[14px] font-medium text-white">
                {getServiceName(booking.requested_service)}
              </p>
              {booking.selected_extras.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {booking.selected_extras.map((eid) => {
                    const extra = serviceExtras.find((e) => e.id === eid);
                    return extra ? (
                      <span
                        key={eid}
                        className="rounded-full border border-[#c5a059]/20 bg-[#c5a059]/10 px-2.5 py-1 text-[11px] text-[#c5a059]"
                      >
                        {extra.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#9696a3]">
              Notes
            </h2>
            <div className="mt-3">
              {booking.notes ? (
                <p className="text-[13px] leading-relaxed text-[#9696a3]">
                  {booking.notes}
                </p>
              ) : (
                <p className="text-[13px] italic text-[#484855] text-pretty">
                  No notes from customer.
                </p>
              )}
            </div>
          </section>

          {/* Internal Notes */}
          <section className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#9696a3]">
              Internal Notes
            </h2>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
              placeholder="Add private notes here..."
              className="mt-3 w-full resize-none rounded-lg border border-white/[0.06] bg-[#0a0a0f] px-3 py-2 text-[13px] text-white placeholder:text-[#484855] outline-none transition-colors focus:border-[#1d4ed8]/50 focus:ring-1 focus:ring-[#1d4ed8]/20"
            />
          </section>
        </div>
      </div>

      {/* Bottom action area */}
      <div className="mt-6 space-y-4">
        {/* Pre-confirm actions */}
        {isPreConfirm && (
          <div className="flex flex-col gap-3 rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)] md:flex-row md:flex-wrap md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                onClick={saveChanges}
                disabled={saving}
                className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-[#1d4ed8] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#1e40af] disabled:opacity-50 active:scale-[0.96]"
              >
                <CheckVerified02 size={14} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={copyInitialWhatsAppMessage}
                className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-[#22c55e]/25 bg-[#22c55e]/5 px-4 py-2.5 text-[12px] font-semibold text-[#22c55e] transition-colors hover:bg-[#22c55e]/10 active:scale-[0.96]"
              >
                <Copy01 size={14} />
                {copiedInitial ? "Copied!" : "Copy WhatsApp Message"}
              </button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                onClick={handleConfirm}
                disabled={confirming || !hasProposedTime}
                className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-[#22c55e] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#16a34a] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96]"
                title={
                  hasProposedTime
                    ? "Confirm this booking"
                    : "Set a proposed date and time first"
                }
              >
                <CheckVerified02 size={14} />
                {confirming ? "Confirming..." : "Confirm booking"}
              </button>
            </div>
          </div>
        )}

        {/* Post-confirm customer actions */}
        {booking.status === "confirmed" && (
          <div className="rounded-xl border border-[#22c55e]/15 bg-[#0f0f14] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <h3 className="text-[13px] font-semibold text-[#22c55e] text-balance">
              Tell the customer
            </h3>
            <p className="mt-1 text-[12px] text-[#686878] text-pretty">
              Send or copy the confirmation so they know the booking is set.
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                onClick={handleSendEmail}
                disabled={
                  sendingEmail ||
                  !booking.customer_email ||
                  booking.customer_notification_sent === true
                }
                className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-[#1d4ed8] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#1e40af] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96]"
                title={
                  !booking.customer_email
                    ? "No customer email on file"
                    : booking.customer_notification_sent
                      ? "Already sent"
                      : "Send confirmation email"
                }
              >
                <Send01 size={14} />
                {sendingEmail
                  ? "Sending..."
                  : emailSent || booking.customer_notification_sent
                    ? "Email sent"
                    : "Send confirmation email"}
              </button>

              <button
                onClick={handleOpenWhatsApp}
                disabled={loadingWhatsApp}
                className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-[#22c55e]/25 bg-[#22c55e]/5 px-4 py-2.5 text-[12px] font-semibold text-[#22c55e] transition-colors hover:bg-[#22c55e]/10 disabled:opacity-50 active:scale-[0.96]"
              >
                <MessageChatSquare size={14} />
                {loadingWhatsApp
                  ? "Loading..."
                  : "Open WhatsApp confirmation"}
              </button>

              <button
                onClick={handleCopyConfirmMessage}
                disabled={loadingWhatsApp}
                className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[12px] font-semibold text-[#9696a3] transition-colors hover:bg-white/[0.04] disabled:opacity-50 active:scale-[0.96]"
              >
                <Copy01 size={14} />
                {copiedConfirm
                  ? "Copied!"
                  : "Copy confirmation message"}
              </button>

              {booking.confirmed_start_at && (
                <a
                  href={generateCalendarLink(booking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[12px] font-semibold text-[#9696a3] transition-colors hover:bg-white/[0.04] active:scale-[0.96]"
                >
                  <CalendarCheck01 size={14} />
                  Customer calendar link
                  <LinkExternal01 size={12} className="text-[#484855]" />
                </a>
              )}
            </div>

            {!booking.customer_email && (
              <p className="mt-3 text-[12px] text-[#484855]">
                No email address for this customer. Use WhatsApp or phone
                instead.
              </p>
            )}
          </div>
        )}

        {/* Terminal state notice */}
        {(booking.status === "declined" ||
          booking.status === "cancelled" ||
          booking.status === "completed") && (
          <div className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 text-center shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <p className="text-[13px] text-[#686878] text-pretty">
              This booking is{" "}
              <span className="font-semibold text-white">
                {statusLabels[booking.status].toLowerCase()}
              </span>
              . No further actions available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
