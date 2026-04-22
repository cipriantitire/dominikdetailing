import { BookingRequest, AdminApiResponse } from "@/types/admin";

const ADMIN_API_BASE = "/api/admin/booking-requests";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` };
  }
  return {};
}

export async function listBookings(
  limit = 50,
  offset = 0,
  opts: { q?: string; status?: string; activeOnly?: boolean; sort?: string } = {}
): Promise<AdminApiResponse<BookingRequest[]>> {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (opts.q) params.set('q', opts.q)
  if (opts.status) params.set('status', opts.status)
  if (opts.activeOnly) params.set('activeOnly', 'true')
  if (opts.sort) params.set('sort', opts.sort)
  const res = await fetch(`${ADMIN_API_BASE}?${params.toString()}`, { headers, cache: 'no-store' })
  const json = await res.json();
  if (!res.ok || !json.ok) {
    return { ok: false, error: json.error || "Could not load bookings" };
  }
  return { ok: true, data: json.data as BookingRequest[] };
}

export async function getBooking(
  id: string
): Promise<AdminApiResponse<BookingRequest>> {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${ADMIN_API_BASE}?id=${encodeURIComponent(id)}`,
    { headers, cache: "no-store" }
  );
  const json = await res.json();
  if (!res.ok || !json.ok) {
    return { ok: false, error: json.error || "Could not load booking" };
  }
  return { ok: true, data: json.booking as BookingRequest };
}

export async function updateBooking(
  id: string,
  updates: {
    status?: "reviewing" | "proposed" | "declined" | "cancelled";
    proposed_start_at?: string | null;
    proposed_end_at?: string | null;
    internal_notes?: string | null;
  }
): Promise<AdminApiResponse<BookingRequest>> {
  const headers = await getAuthHeaders();
  const res = await fetch(ADMIN_API_BASE, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    return { ok: false, error: json.error || "Could not update booking" };
  }
  return { ok: true, data: json.booking as BookingRequest };
}

export async function confirmBooking(
  id: string,
  confirmed_start_at: string,
  confirmed_end_at?: string | null,
  send_customer_email?: boolean
): Promise<AdminApiResponse<BookingRequest>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${ADMIN_API_BASE}/confirm`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      confirmed_start_at,
      confirmed_end_at: confirmed_end_at ?? null,
      send_customer_email: send_customer_email ?? false,
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    return { ok: false, error: json.error || "Could not confirm booking" };
  }
  return { ok: true, data: json.booking as BookingRequest };
}

export async function getWhatsAppMessage(
  id: string
): Promise<AdminApiResponse<string>> {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${ADMIN_API_BASE}/whatsapp?id=${encodeURIComponent(id)}`,
    { headers, cache: "no-store" }
  );
  const json = await res.json();
  if (!res.ok || !json.ok) {
    return { ok: false, error: json.error || "Could not load message" };
  }
  return { ok: true, data: json.message as string };
}

export async function reopenBooking(id: string): Promise<AdminApiResponse<BookingRequest>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${ADMIN_API_BASE}/reopen`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    return { ok: false, error: json.error || "Could not reopen booking" };
  }
  return { ok: true, data: json.booking as BookingRequest };
}
