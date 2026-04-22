-- Add confirmation fields: confirmed_start_at, confirmed_end_at, customer_notification_sent
-- Idempotent migration: only adds columns if they do not already exist

alter table booking_requests
  add column if not exists confirmed_start_at timestamptz;

alter table booking_requests
  add column if not exists confirmed_end_at timestamptz;

alter table booking_requests
  add column if not exists customer_notification_sent boolean not null default false;
