import 'server-only'
import { supabaseAdmin } from '../supabase/server'

// Verify admin access for a server request.
// Preferred flow: Authorization: Bearer <supabase_access_token> (a Supabase session JWT)
// The admin user's email must match ADMIN_EMAIL env var. This keeps a single-owner
// setup simple and secure.
// Fallback (temporary): x-owner-token header matched to OWNER_API_TOKEN if present.
export async function isAdminAuthorized(req: Request) {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL
  const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  const OWNER_API_TOKEN = process.env.OWNER_API_TOKEN

  const allowedAdminEmails = new Set(
    [
      ...(ADMIN_EMAILS ? ADMIN_EMAILS.split(',') : []),
      ...(ADMIN_EMAIL ? [ADMIN_EMAIL] : []),
    ]
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )

  // 1. Prefer Bearer token (Supabase session JWT)
  const auth = req.headers.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const token = auth.slice(7).trim()
    if (!token) return false
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token)
      if (error) {
        console.warn('admin auth: supabase getUser error', { message: error.message })
        return false
      }
      const user = data?.user
      if (!user) return false
      if (allowedAdminEmails.size === 0) {
        // If no admin emails are configured, do not authorize via Supabase user.
        console.warn('admin auth: no admin emails configured; rejecting bearer token')
        return false
      }
      return !!user.email && allowedAdminEmails.has(user.email.toLowerCase())
    } catch (err) {
      console.error('admin auth: unexpected error', err)
      return false
    }
  }

  // 2. Fallback to legacy owner token header (temporary). This is less secure but
  // provides a migration path. If OWNER_API_TOKEN is not set, this will fail.
  const ownerToken = req.headers.get('x-owner-token')
  if (OWNER_API_TOKEN && ownerToken && ownerToken === OWNER_API_TOKEN) {
    console.warn('admin auth: using OWNER_API_TOKEN fallback')
    return true
  }

  return false
}
