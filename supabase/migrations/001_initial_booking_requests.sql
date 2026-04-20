create extension if not exists pgcrypto;

create type booking_status as enum (
  'pending',
  'reviewing',
  'proposed',
  'confirmed',
  'declined',
  'cancelled'
);

create table booking_requests (
  id uuid primary key default gen_random_uuid(),
  status booking_status not null default 'pending',
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  vehicle text not null,
  postcode text not null,
  requested_service text not null,
  requested_date date,
  requested_time text,
  proposed_start_at timestamptz,
  proposed_end_at timestamptz,
  notes text,
  internal_notes text,
  google_calendar_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index booking_requests_status_idx on booking_requests (status);
create index booking_requests_created_at_idx on booking_requests (created_at desc);

create function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger booking_requests_set_updated_at
before update on booking_requests
for each row execute function set_updated_at();
