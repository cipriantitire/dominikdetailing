Untitled UI — Install Notes

What I installed:

- npm packages added to the project:
  - @untitledui/icons
  - react-aria-components
  - tailwindcss-react-aria-components
  - tailwind-merge
  - tailwindcss-animate

What I did not change:

- I did not modify any frontend source files or Tailwind config. This change only adds the packages so a frontend engineer can start using Untitled UI components.

Frontend integration checklist (for the frontend agent):

1. Ensure Tailwind is configured (project already uses Tailwind). If not, follow Tailwind's docs first.

2. Manual steps recommended by Untitled UI:
   - Create a theme file (example name: `styles/theme.css`) and include the `@theme { ... }` block from the Untitled UI docs.
   - Import the theme file in your global CSS or layout (e.g. `import '../styles/theme.css'` in _app or root layout).

3. Components & icons:
   - Import components from `@untitledui/react` (see the documentation) and icons from `@untitledui/icons`.

4. Accessibility helpers:
   - Untitled UI builds on `react-aria-components` and `tailwindcss-react-aria-components`. Follow docs for any additional setup.

Notes & recommendations:

- The project uses a custom design language (see AGENTS.md and handoff). When adopting Untitled UI, keep the site tone and color system aligned with the Dominik Detailing brand — swap theme tokens where required.
- If you want, I can wire up a minimal theme.css and Tailwind plugin integration in a follow-up PR so frontend engineers can start using Untitled UI components immediately. I did not add it without your instruction.

References:

- Untitled UI installation docs: https://www.untitledui.com/react/docs/installation
