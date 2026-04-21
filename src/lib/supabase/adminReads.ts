import 'server-only'
import { supabaseAdmin } from './server'

// Small server-only helpers for admin reads. These use the service role client and
// are intended only for internal owner/admin server routes.

export async function listBookingRequests(limit = 50, offset = 0) {
  const { data, error } = await supabaseAdmin
    .from('booking_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, Math.max(offset + limit - 1, offset))

  if (error) throw error
  return data
}

export async function getBookingRequestById(id: string) {
  const { data, error } = await supabaseAdmin.from('booking_requests').select('*').eq('id', id).single()
  if (error) throw error
  return data
}
