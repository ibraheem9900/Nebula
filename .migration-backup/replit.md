# Nebula

Nebula is an AI productivity workspace with a scroll-controlled landing experience and a local-state dashboard prototype.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/nebula run dev` — run the Nebula web app
- `pnpm --filter @workspace/nebula run build` — build the deployable static site
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Deployment: Vercel uses `vercel.json` to build `@workspace/nebula` and publish `artifacts/nebula/dist/public`

## Where things live

- `artifacts/nebula/src/App.tsx` — landing page, scroll-scrubbed video, and route entry points
- `artifacts/nebula/src/dashboard.tsx` — local-state dashboard shell and the seven app pages
- `artifacts/nebula/src/index.css` — Nebula visual tokens, typography, responsive utilities, and motion
- `attached_assets/Website-Builder-Pro-Aug-20-00-32-39_1787098958820.mp4` — scroll-controlled product video source

## Architecture decisions

- The landing page remains separate from the dashboard; `/dashboard` and its child routes are the product workspace.
- Dashboard interactions intentionally use local React state; no backend or authentication is required for the prototype.
- The landing video scrubs on desktop scroll, while reduced-motion and mobile users receive safe playback fallbacks.

## Product

Users can explore Nebula, scrub through its product story, and preview a responsive workspace with dashboard stats, tasks, AI chat, calendar, team, analytics, and settings flows.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
