export type BookingStatus =
  | "pending"
  | "reviewing"
  | "proposed"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "declined";

export interface BookingRequest {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  vehicle: string;
  address: string;
  postcode: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  registration: string | null;
  colour: string | null;
  vehicle_size: string | null;
  key_collection_address: string | null;
  requested_service: string;
  requested_date: string;
  requested_time: string;
  notes: string | null;
  status: BookingStatus;
  selected_extras: string[];
  proposed_start_at: string | null;
  proposed_end_at: string | null;
  internal_notes: string | null;
  confirmed_start_at: string | null;
  confirmed_end_at: string | null;
  customer_notification_sent: boolean | null;
  google_calendar_event_id: string | null;
  created_at: string;
  updated_at: string;
}

export const statusLabels: Record<BookingStatus, string> = {
  pending: "New request",
  reviewing: "Reviewing",
  proposed: "Proposed time",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  declined: "Declined",
};

export const statusColors: Record<BookingStatus, string> = {
  pending: "bg-[#1d4ed8]/10 text-[#1d4ed8] border-[#1d4ed8]/20",
  reviewing: "bg-[#c5a059]/10 text-[#c5a059] border-[#c5a059]/20",
  proposed: "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20",
  confirmed: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20",
  completed: "bg-[#9696a3]/10 text-[#9696a3] border-[#9696a3]/20",
  cancelled: "bg-[#9696a3]/10 text-[#9696a3] border-[#9696a3]/20",
  declined: "bg-[#dc2626]/10 text-[#dc2626] border-[#dc2626]/20",
};

export type AdminApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
