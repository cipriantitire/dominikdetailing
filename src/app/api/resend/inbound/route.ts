import 'server-only'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Minimal Resend inbound webhook handler
// Validates webhook signature using RESEND_WEBHOOK_SECRET and forwards
// emails addressed to dominik@ddetailing.co.uk to the configured forward address.

const SECRET = process.env.RESEND_WEBHOOK_SECRET
const FORWARD_TO = process.env.RESEND_INBOUND_FORWARD_TO
const FORWARD_RECIPIENT = 'dominik@ddetailing.co.uk'

type InboundWebhookPayload = {
  type?: string
  data?: {
    email_id?: string
    to?: string[]
  }
}

export async function POST(req: Request) {
  const bodyText = await req.text()
  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (SECRET) {
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.warn('Resend webhook secret configured but svix headers missing')
      return NextResponse.json({ ok: false, error: 'Missing webhook signature headers' }, { status: 401 })
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY || 'noop')
      resend.webhooks.verify({
        payload: bodyText,
        headers: {
          id: svixId,
          timestamp: svixTimestamp,
          signature: svixSignature,
        },
        webhookSecret: SECRET,
      })
    } catch (err) {
      console.warn('Resend webhook verification failed', { message: String(err) })
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 })
    }
  }

  let payload: InboundWebhookPayload
  try {
    payload = JSON.parse(bodyText) as InboundWebhookPayload
  } catch {
    console.warn('Resend webhook: invalid JSON payload')
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (payload.type !== 'email.received') {
    return NextResponse.json({ ok: true, ignored: true })
  }

  try {
    const recipients = Array.isArray(payload.data?.to)
      ? payload.data.to.map((r) => String(r).toLowerCase())
      : []

    const localPart = FORWARD_RECIPIENT.split('@')[0]
    const shouldForward = recipients.includes(FORWARD_RECIPIENT) || recipients.some((r) => r.includes(`+${localPart}`))

    if (!shouldForward) {
      return NextResponse.json({ ok: true, ignored: true })
    }

    const emailId = payload.data?.email_id
    if (!emailId) {
      console.warn('Inbound email webhook missing email_id')
      return NextResponse.json({ ok: false, error: 'Missing email_id' }, { status: 400 })
    }

    if (!FORWARD_TO) {
      console.warn('Inbound email received but RESEND_INBOUND_FORWARD_TO not configured')
      return NextResponse.json({ ok: false, error: 'Forward target not configured' }, { status: 500 })
    }

    // Construct a simple forward email using Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured, cannot forward inbound email')
      return NextResponse.json({ ok: false, error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }

    const resend = new Resend(resendApiKey)

    await resend.emails.receiving.forward({
      emailId,
      from: FORWARD_RECIPIENT,
      to: FORWARD_TO,
    })

    return NextResponse.json({ ok: true, forwarded: true })
  } catch (err) {
    console.error('Failed to process inbound resend webhook', { message: String(err) })
    return NextResponse.json({ ok: false, error: 'Processing error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, status: 'resend inbound webhook ready' })
}
