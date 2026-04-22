import 'server-only'
import { Resend } from 'resend'

type SendTemplateOpts = {
  templateId?: string | null
  from?: string | null
  to: string
  variables?: Record<string, unknown>
  replyTo?: string | null
  subjectFallback?: string | null
}

// Thin wrapper that sends a Resend template if configured. This never throws
// and logs errors safely. If templateId is not provided, the function is a
// no-op so callers can safely fall back to inline HTML behaviour.
export async function sendResendTemplate(opts: SendTemplateOpts) {
  const { templateId, from, to, variables, replyTo, subjectFallback } = opts

  if (!templateId) {
    console.info('sendResendTemplate: no template configured, skipping')
    return
  }

  if (!from) {
    console.info('sendResendTemplate: no from address configured, skipping')
    return
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.info('sendResendTemplate: RESEND_API_KEY not configured, skipping')
    return
  }

  try {
    const resend = new Resend(apiKey)
    const sendOpts: Parameters<Resend['emails']['send']>[0] & {
      template?: { id: string; variables?: Record<string, string | number> }
    } = {
      from: from ?? undefined,
      to,
      template: { id: templateId },
    }

    if (variables) {
      sendOpts.template = {
        id: templateId,
        variables: Object.fromEntries(
          Object.entries(variables).map(([key, value]) => [key, typeof value === 'number' ? value : String(value)]),
        ),
      }
    }

    if (replyTo) {
      // @ts-expect-error - reply_to exists at runtime
      sendOpts.reply_to = replyTo
    }

    if (subjectFallback) {
      sendOpts.subject = subjectFallback
    }

    await resend.emails.send(sendOpts as Parameters<Resend['emails']['send']>[0])
  } catch (err: unknown) {
    // Keep logs generic and avoid exposing secrets
    let message = String(err)
    if (err && typeof err === 'object' && err !== null) {
      const obj = err as Record<string, unknown>
      if ('message' in obj && typeof obj.message === 'string') {
        message = obj.message
      } else {
        try {
          message = JSON.stringify(obj)
        } catch {
          message = String(err)
        }
      }
    }
    console.error('Resend template send failed', { templateId, to, message })
  }
}
