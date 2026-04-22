#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* Remove demo rows inserted by seed_admin_demo_bookings.js */
const { createClient } = require('@supabase/supabase-js')

async function main() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Remove demo rows by email pattern or customer_name prefix
  const { error } = await supabase.from('booking_requests').delete().or("customer_email.like.'demo+%@example.com',customer_name.ilike.'Demo %'")
  if (error) {
    console.error('Cleanup failed', error.message || error)
    process.exit(1)
  }

  console.log('DEMO_CLEANUP_OK')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
