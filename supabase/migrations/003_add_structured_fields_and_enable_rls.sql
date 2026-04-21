-- Add structured fields required by the frontend and enable Row Level Security
-- This migration is idempotent: uses "if not exists" where possible.

alter table booking_requests
  add column if not exists address text;

alter table booking_requests
  add column if not exists vehicle_make text;

alter table booking_requests
  add column if not exists vehicle_model text;

alter table booking_requests
  add column if not exists registration text;

alter table booking_requests
  add column if not exists colour text;

alter table booking_requests
  add column if not exists vehicle_size text;

alter table booking_requests
  add column if not exists key_collection_address text;

-- selected_extras may already be added by a previous migration; ensure it exists
alter table booking_requests
  add column if not exists selected_extras text[] not null default '{}';

-- Enable Row Level Security. Do NOT create broad public policies here.
-- The application routes use the Supabase service_role key which bypasses RLS.
alter table booking_requests enable row level security;

-- Helpful index for querying by requested date and postcode / area
create index if not exists booking_requests_requested_date_idx on booking_requests (requested_date);
create index if not exists booking_requests_postcode_idx on booking_requests (postcode);
