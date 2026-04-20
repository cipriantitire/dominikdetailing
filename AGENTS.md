# Dominik Detailing Agent Rules

This file is the primary project instruction file for Codex, Copilot Chat, and other AI coding agents working in this repository.

## Workspace Boundary

- Treat `C:\Users\cipri\Dominik Detailing` as the only workspace for this project.
- Do not read, copy, import, or mutate files from `NOCTVM`, `Trading Bot`, or `Portfolio Website` unless Ciprian explicitly asks for that in the same turn.
- Never copy `.env`, `.env.local`, `.vercel`, Supabase configs, lockfiles, deployment settings, MCP configs, or generated artifacts from another project into this repo.
- Project-specific credentials must belong to the new Dominik Detailing GitHub, Vercel, and Supabase setup only.

## Product Direction

Build a premium mobile car detailing website with a quote-first booking system and a lightweight owner admin panel.

The source of truth split is mandatory:

- Supabase stores requests, statuses, customer details, notes, and workflow metadata.
- Google Calendar stores confirmed jobs and blocked time.
- Do not create a Google Calendar event until an owner confirms the booking.

V1 is not a marketplace, SaaS scheduler, customer portal, CRM, or full payment platform.

## Technical Defaults

- Use Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, Supabase Postgres, Resend, Google Calendar API, and Vercel.
- Keep service tiers and extras in code config for v1 unless a later requirement needs database management.
- Use server-side validation for all booking/admin mutations; frontend validation is only for UX.
- Add rate limiting to public submission endpoints once the app has API routes.
- Use proper admin auth for owner pages. Do not ship a public admin route.
- No customer auth in v1.

## UX Rules

- Mobile-first conversion matters more than dashboard complexity.
- Keep the booking flow fast: hero prefill, detailed booking page, clear thank-you state.
- Admin language must be non-technical and obvious for the owner.
- Always distinguish `Customer requested` from `We plan to schedule`.
- Keep the premium dark detailing aesthetic, but avoid generic AI-looking cyan/purple slop.

## AI Workflow

- Read `dominik-detailing-agent-handoff.md` before broad product, architecture, design, or data model work.
- For Copilot Chat, also follow `.github/copilot-instructions.md`.
- Use `.mcp.json` only for this repo's local MCP servers. Do not point MCP servers at other projects.
- Global Codex skills/plugins live under the user profile and are shared tooling; do not vendor-copy entire skill/plugin libraries into this repo.
- If using agents, pass this file and the handoff as required context.

## Git And Deployment Guardrails

- Local repo target: `cipriantitire/dominikdetailing`.
- Do not create or link a Vercel project using another account's `.vercel` folder.
- Do not push secrets. Keep `.env.local` untracked and use `.env.example` for placeholders.
- Make small commits with clear messages once implementation starts.

