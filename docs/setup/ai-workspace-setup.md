# Dominik Detailing AI Workspace Setup

This repo is intentionally isolated from NOCTVM, Trading Bot, and Portfolio Website.

## Open In VS Code

Preferred isolated workspace:

```powershell
code "C:\Users\cipri\Dominik Detailing\Dominik-Detailing.code-workspace"
```

The folder is also listed in `C:\Users\cipri\Vibecoding.code-workspace` so it can appear beside the other projects when needed.

## GitHub

Initialize locally first, then attach the new remote:

```powershell
git init
git branch -M main
git add .
git commit -m "chore: initialize Dominik Detailing workspace"
```

If the GitHub CLI is authenticated as `cipriantitire`, create and push the repo:

```powershell
gh auth status
gh repo create cipriantitire/dominikdetailing --private --source . --remote origin --push
```

If the repo already exists:

```powershell
git remote add origin https://github.com/cipriantitire/dominikdetailing.git
git push -u origin main
```

## Vercel

- Use the newly created Vercel account.
- Import `cipriantitire/dominikdetailing` into Vercel after the first GitHub push.
- Do not copy `.vercel` from any other project.
- If using the Vercel CLI, run `vercel link` only from `C:\Users\cipri\Dominik Detailing`.

## Supabase

- Use the new Dominik Detailing Supabase account/project.
- Put real keys in `.env.local`.
- Keep `.env.example` as placeholders only.
- Do not copy Supabase URLs, service keys, migrations, or generated types from another project.

## AI Agents, Skills, MCPs, And Plugins

- Codex skills/plugins installed under `C:\Users\cipri\.codex` are global tools, not project state.
- Project rules live in `AGENTS.md`.
- Copilot reads `.github/copilot-instructions.md`.
- Local project skills live in `.agents/skills`.
- Local MCP servers live in `.mcp.json`.
- Add account-specific Supabase/Vercel/GitHub MCP entries only after the new accounts are linked and only to this repo's `.mcp.json`.

## Safe Agent Prompt

Use this when starting an agent session:

```text
Work only in C:\Users\cipri\Dominik Detailing. Read AGENTS.md and dominik-detailing-agent-handoff.md first. Do not read, copy, or modify NOCTVM, Trading Bot, or Portfolio Website unless explicitly instructed. Use the v1 manual-confirmation booking architecture: Supabase stores booking workflow records, Google Calendar receives events only after owner confirmation.
```

