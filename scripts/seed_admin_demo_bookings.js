#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* Minimal dev-only seed script for admin demo bookings
   - Uses NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
   - Deletes prior demo rows created by this script (customer_email LIKE 'demo+%')
   - Inserts clearly fake demo rows
*/
const { createClient } = require('@supabase/supabase-js')

async function main() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Remove prior demo rows (only those created by this script)
  // Keep this simple and deterministic: all seeded rows use demo*@example.com emails.
  try {
    await supabase.from('booking_requests').delete().like('customer_email', 'demo%@example.com')
  } catch {
    // ignore
  }

  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const tomorrowEnd = new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000)

  const demoRows = [
    {
      customer_name: 'Demo Pending',
      customer_email: 'demo+pending@example.com',
      customer_phone: '+447700900001',
      vehicle: 'DemoCar 1',
      address: '1 Demo Street',
      postcode: 'DM1 1AA',
      vehicle_make: 'DemoMake',
      vehicle_model: 'Model A',
      registration: 'DEMO1',
      colour: 'Matte Demo',
      vehicle_size: 'small',
      requested_service: 'mini-valet',
      requested_date: tomorrow.toISOString().slice(0, 10),
      requested_time: 'Morning (8am - 12pm)',
      selected_extras: ['hydrophobic-windows'],
      notes: 'This is a demo pending request',
      status: 'pending',
      customer_notification_sent: false,
    },
    {
      customer_name: 'Demo Reviewing',
      customer_email: 'demo+reviewing@example.com',
      customer_phone: '+447700900002',
      vehicle: 'DemoCar 2',
      address: '2 Demo Avenue',
      postcode: 'DM2 2BB',
      vehicle_make: 'DemoMake',
      vehicle_model: 'Model B',
      registration: 'DEMO2',
      colour: 'Demo Blue',
      vehicle_size: 'medium',
      requested_service: 'full-valet',
      requested_date: tomorrow.toISOString().slice(0, 10),
      requested_time: 'Afternoon (12pm - 4pm)',
      selected_extras: ['clay-bar', 'engine-bay'],
      notes: 'Reviewing for extra services',
      status: 'reviewing',
      customer_notification_sent: false,
    },
    {
      customer_name: 'Demo Proposed',
      customer_email: 'demo+proposed@example.com',
      customer_phone: '+447700900003',
      vehicle: 'DemoCar 3',
      address: '3 Demo Road',
      postcode: 'DM3 3CC',
      vehicle_make: 'DemoMake',
      vehicle_model: 'Model C',
      registration: 'DEMO3',
      colour: 'Demo Red',
      vehicle_size: 'large',
      requested_service: 'premium-detailing',
      requested_date: tomorrow.toISOString().slice(0, 10),
      requested_time: 'Morning (8am - 12pm)',
      proposed_start_at: tomorrow.toISOString(),
      proposed_end_at: tomorrowEnd.toISOString(),
      selected_extras: ['leather-treatment'],
      notes: 'Proposed times set by admin',
      status: 'proposed',
      customer_notification_sent: false,
    },
    {
      customer_name: 'Demo Confirmed',
      customer_email: 'demo+confirmed@example.com',
      customer_phone: '+447700900004',
      vehicle: 'DemoCar 4',
      address: '4 Demo Lane',
      postcode: 'DM4 4DD',
      vehicle_make: 'DemoMake',
      vehicle_model: 'Model D',
      registration: 'DEMO4',
      colour: 'Demo Green',
      vehicle_size: 'medium',
      requested_service: 'maintenance-wash',
      requested_date: tomorrow.toISOString().slice(0, 10),
      requested_time: 'Afternoon (12pm - 4pm)',
      confirmed_start_at: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      confirmed_end_at: new Date(tomorrow.getTime() + 5 * 60 * 60 * 1000).toISOString(),
      selected_extras: ['child-seats'],
      notes: 'Confirmed booking for demo',
      status: 'confirmed',
      customer_notification_sent: true,
    },
    {
      customer_name: 'Demo Declined',
      customer_email: 'demo+declined@example.com',
      customer_phone: '+447700900005',
      vehicle: 'DemoCar 5',
      address: '5 Demo Crescent',
      postcode: 'DM5 5EE',
      vehicle_make: 'DemoMake',
      vehicle_model: 'Model E',
      registration: 'DEMO5',
      colour: 'Demo Yellow',
      vehicle_size: 'small',
      requested_service: 'mini-valet',
      requested_date: tomorrow.toISOString().slice(0, 10),
      requested_time: 'Evening (4pm - 6pm)',
      selected_extras: [],
      notes: 'Declined due to scheduling conflict',
      status: 'declined',
      customer_notification_sent: false,
    },
  ]

  const { data, error } = await supabase.from('booking_requests').insert(demoRows)
  if (error) {
    console.error('Seed failed', error.message || error)
    process.exit(1)
  }

  console.log('DEMO_SEED_OK', Array.isArray(data) ? data.length : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
