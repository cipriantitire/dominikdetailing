import 'server-only'
import { supabaseAdmin } from './server'

export type AdminUpdatePayload = {
  status?: 'reviewing' | 'proposed' | 'declined' | 'cancelled'
  proposed_start_at?: string | null
  proposed_end_at?: string | null
  internal_notes?: string | null
}

export async function updateBookingRequest(id: string, updates: AdminUpdatePayload) {
  // Only allow the explicit fields above to be written. This keeps the blast radius small.
  const safeUpdates: Record<string, unknown> = {}
  if (updates.status) safeUpdates.status = updates.status
  if (Object.prototype.hasOwnProperty.call(updates, 'proposed_start_at')) safeUpdates.proposed_start_at = updates.proposed_start_at
  if (Object.prototype.hasOwnProperty.call(updates, 'proposed_end_at')) safeUpdates.proposed_end_at = updates.proposed_end_at
  if (Object.prototype.hasOwnProperty.call(updates, 'internal_notes')) safeUpdates.internal_notes = updates.internal_notes

  const { data, error } = await supabaseAdmin
    .from('booking_requests')
    .update(safeUpdates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}
