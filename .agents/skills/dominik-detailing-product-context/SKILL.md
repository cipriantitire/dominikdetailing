---
name: dominik-detailing-product-context
description: Use when planning, designing, implementing, reviewing, or testing any Dominik Detailing feature.
---

# Dominik Detailing Product Context

Read the repository root `AGENTS.md` and `dominik-detailing-agent-handoff.md` before making product or architecture decisions.

## Core Product

Dominik Detailing is a premium mobile car detailing website with a quote-first booking workflow and a lightweight owner admin panel.

## Non-Negotiables

- Google Calendar is the source of truth for confirmed jobs and blocked time.
- Supabase is the source of truth for requests, statuses, notes, customer details, and workflow history.
- Do not create Google Calendar events for unconfirmed requests.
- No customer accounts in v1.
- No full slot-booking engine in v1.
- No copied project config from NOCTVM, Trading Bot, or Portfolio Website.

## V1 Build Priorities

1. Marketing site and booking entry points.
2. Detailed booking form with server-side validation.
3. Supabase booking persistence.
4. Owner notification email.
5. Owner admin list/detail workflow.
6. Manual confirm/decline flow.
7. Google Calendar event creation on confirmation.

