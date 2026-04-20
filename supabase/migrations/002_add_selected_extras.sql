-- Add selected_extras array column to booking_requests
alter table booking_requests
  add column if not exists selected_extras text[] not null default '{}';
