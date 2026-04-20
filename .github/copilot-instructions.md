# Copilot Instructions For Dominik Detailing

Before generating code, read `AGENTS.md` and `dominik-detailing-agent-handoff.md`.

Keep this project isolated from `NOCTVM`, `Trading Bot`, and `Portfolio Website`. Do not reuse their credentials, `.vercel` folders, Supabase settings, MCP configs, or generated code unless Ciprian explicitly asks in the same prompt.

Build toward the v1 product: a premium mobile detailing website with a quote-first booking flow, Supabase-backed booking records, a small owner admin panel, and Google Calendar events created only after owner confirmation.

Use Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, Supabase, Resend, Google Calendar API, and Vercel unless a later project decision changes the stack.

Security and workflow rules:

- No customer accounts in v1.
- Admin routes require proper auth.
- Public booking submissions need server validation and later rate limiting.
- `.env.local` stays local and untracked.
- Do not hardcode secrets.
- Keep UI mobile-first, high-contrast, accessible, and conversion-focused.

