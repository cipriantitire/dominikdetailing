"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listBookings, reopenBooking, getWhatsAppMessage } from "@/lib/admin/api";
import { BookingRequest, statusLabels, statusColors } from "@/types/admin";
import { ArrowRight, Phone, MarkerPin01, Calendar, MessageChatSquare, Mail01 } from "@untitledui/icons";

function formatShortDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeOnly, setActiveOnly] = useState(false)
  const [sort, setSort] = useState('newest')
  const [refreshing, setRefreshing] = useState(false)
  const [reopeningIds, setReopeningIds] = useState<Record<string, boolean>>({})
  const [waLoadingIds, setWaLoadingIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      const result = await listBookings(50, 0, { q: q || undefined, status: statusFilter, activeOnly, sort });
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error);
      } else {
        setBookings(result.data);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [q, statusFilter, activeOnly, sort]);

  async function handleRefresh() {
    setRefreshing(true)
    setError("")
    const result = await listBookings(50, 0, { q: q || undefined, status: statusFilter, activeOnly, sort })
    if (!result.ok) {
      setError(result.error)
    } else {
      setBookings(result.data)
    }
    setRefreshing(false)
  }

  async function handleReopen(id: string) {
    setReopeningIds((s) => ({ ...s, [id]: true }))
    setError("")
    try {
      const res = await reopenBooking(id)
      if (!res.ok) {
        setError(res.error)
      } else {
        setBookings((prev) => prev.map((b) => (b.id === id ? res.data : b)))
      }
    } catch {
      setError("Could not reopen booking")
    }
    setReopeningIds((s) => ({ ...s, [id]: false }))
  }

  function sanitizePhoneForWa(phone: string) {
    return phone.replace(/[^0-9]/g, "");
  }

  async function handleOpenWhatsAppRow(id: string, phone: string) {
    setWaLoadingIds((s) => ({ ...s, [id]: true }));
    setError("");
    try {
      const res = await getWhatsAppMessage(id);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const msg = res.data;
      const digits = sanitizePhoneForWa(phone);
      const url = `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Could not open WhatsApp");
    }
    setWaLoadingIds((s) => ({ ...s, [id]: false }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[13px] text-[#686878]">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#dc2626]/20 bg-[#dc2626]/10 p-4 text-[13px] text-[#f87171]">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-balance md:text-[28px]">
            Booking Requests
          </h1>
          <p className="mt-1 text-[13px] text-[#686878]">
            <span className="tabular-nums">{bookings.length}</span> total request{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, email, postcode, reg"
            className="w-full rounded-md bg-[#0b0b0f] px-3 py-2 text-sm text-white border border-white/[0.04] outline-none transition-colors focus:border-[#1d4ed8]/50"
          />
          <div className="flex gap-2 flex-wrap items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md bg-[#0b0b0f] px-3 py-2 text-sm text-white border border-white/[0.04] outline-none"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="proposed">Proposed</option>
              <option value="confirmed">Confirmed</option>
              <option value="declined">Declined</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <label className="inline-flex items-center gap-2 rounded-md border border-white/[0.04] bg-[#0b0b0f] px-3 py-2 text-sm text-[#686878]">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="h-4 w-4 accent-[#1d4ed8]"
              />
              Active only
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md bg-[#0b0b0f] px-3 py-2 text-sm text-white border border-white/[0.04] outline-none"
            >
              <option value="newest">Newest created</option>
              <option value="oldest">Oldest created</option>
              <option value="requested_date">Requested date</option>
              <option value="confirmed_date">Confirmed date</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-white/[0.03] px-3 py-2 text-sm text-white transition-colors hover:bg-white/[0.05] disabled:opacity-50 active:scale-[0.96]"
              title="Refresh list"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-8 rounded-xl border border-white/[0.04] bg-[#0f0f14] p-8 text-center">
          <p className="text-[14px] text-[#686878] text-pretty">
            No booking requests yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => router.push(`/admin/bookings/${booking.id}`)}
              className="group flex cursor-pointer flex-row items-start justify-between gap-3 rounded-xl border border-white/[0.04] bg-[#0f0f14] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-[colors,transform,border-color] hover:border-white/[0.08] active:scale-[0.98] md:items-center md:gap-4"
            >
              {/* Left column: details */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[booking.status]}`}
                  >
                    {statusLabels[booking.status]}
                  </span>
                  <span className="text-[12px] text-[#484855]">
                    {new Date(booking.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  {booking.customer_notification_sent && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#22c55e]">
                      Notified
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <p className="truncate text-[14px] font-semibold text-white">
                    {booking.customer_name}
                  </p>
                  <span className="text-[12px] text-[#484855]">·</span>
                  <p className="truncate text-[13px] text-[#9696a3]">
                    {booking.requested_service}
                  </p>
                </div>

                <div className="mt-1.5 flex flex-col gap-1 text-[12px] text-[#686878] md:flex-row md:items-center md:gap-x-4 md:gap-y-1">
                  <span className="flex items-center gap-1.5 tabular-nums">
                    <Calendar size={12} />
                    {booking.status === "confirmed" && booking.confirmed_start_at
                      ? formatShortDate(booking.confirmed_start_at)
                      : booking.proposed_start_at
                        ? formatShortDate(booking.proposed_start_at)
                        : booking.requested_date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MarkerPin01 size={12} />
                    {booking.postcode || booking.address}
                  </span>
                  <span className="flex items-center gap-1.5 tabular-nums">
                    <Phone size={12} />
                    {booking.customer_phone}
                  </span>
                </div>
              </div>

              {/* Right column: buttons */}
              <div
                className="flex shrink-0 self-stretch flex-col items-end justify-between py-1"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Actions group */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-md text-[#484855]"
                    title="Open booking"
                  >
                    <ArrowRight
                      size={16}
                      className="transition-colors group-hover:text-white"
                    />
                  </div>
                  {(booking.status === "declined" || booking.status === "cancelled") && (
                    <button
                      onClick={() => handleReopen(booking.id)}
                      disabled={!!reopeningIds[booking.id]}
                      className="inline-flex min-h-[40px] items-center rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2 text-[12px] font-medium text-[#9696a3] transition-colors hover:bg-white/[0.03] disabled:opacity-50 active:scale-[0.96]"
                      title="Reopen"
                    >
                      {reopeningIds[booking.id] ? "Reopening..." : "Reopen"}
                    </button>
                  )}
                </div>

                {/* Contact group */}
                <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.04] bg-white/[0.02] p-0.5">
                  {booking.customer_phone && (
                    <a
                      href={`tel:${booking.customer_phone}`}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-[#9696a3] transition-colors hover:text-white active:scale-[0.96]"
                      title="Call"
                    >
                      <Phone size={14} />
                    </a>
                  )}
                  {booking.customer_phone && (
                    <button
                      onClick={() => handleOpenWhatsAppRow(booking.id, booking.customer_phone)}
                      disabled={!!waLoadingIds[booking.id]}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-[#22c55e] transition-colors hover:text-white disabled:opacity-50 active:scale-[0.96]"
                      title="Open WhatsApp"
                    >
                      <MessageChatSquare size={14} />
                    </button>
                  )}
                  {booking.customer_email && (
                    <a
                      href={`mailto:${booking.customer_email}`}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-[#1d4ed8] transition-colors hover:text-white active:scale-[0.96]"
                      title="Email"
                    >
                      <Mail01 size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
