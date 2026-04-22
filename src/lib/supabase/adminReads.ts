import 'server-only'
import { supabaseAdmin } from './server'

// Small server-only helpers for admin reads. These use the service role client and
// are intended only for internal owner/admin server routes.

type ListOptions = {
  limit?: number
  offset?: number
  q?: string | null
  status?: string | null
  activeOnly?: boolean
  sort?: string | null
}

export async function listBookingRequests(opts: ListOptions = {}) {
  const limit = opts.limit ?? 50
  const offset = opts.offset ?? 0

  let query = supabaseAdmin.from('booking_requests').select('*')

  // Search - case-insensitive ilike across multiple columns
  if (opts.q) {
    const q = String(opts.q).replace(/'/g, "''")
    const orFilter = [
      `customer_name.ilike.'%${q}%'`,
      `customer_phone.ilike.'%${q}%'`,
      `customer_email.ilike.'%${q}%'`,
      `postcode.ilike.'%${q}%'`,
      `registration.ilike.'%${q}%'`,
    ].join(',')
    query = query.or(orFilter)
  }

  // Status filter
  if (opts.status && opts.status !== 'all') {
    query = query.eq('status', opts.status)
  }

  // activeOnly excludes terminal statuses supported in the base schema
  if (opts.activeOnly) {
    query = query.not('status', 'in', '(declined,cancelled)')
  }

  // Sorting
  switch (opts.sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'requested_date':
      query = query.order('requested_date', { ascending: true }).order('created_at', { ascending: false })
      break
    case 'confirmed_date':
      // Orders by confirmed_start_at desc (most recent confirmed first)
      query = query.order('confirmed_start_at', { ascending: false }).order('created_at', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data, error } = await query.range(offset, Math.max(offset + limit - 1, offset))
  if (error) throw error
  return data
}

export async function getBookingRequestById(id: string) {
  const { data, error } = await supabaseAdmin.from('booking_requests').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}
