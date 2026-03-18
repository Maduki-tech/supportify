# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun dev          # Start dev server (Next.js Turbo mode)
bun build        # Production build
bun lint         # ESLint
bun lint:fix     # ESLint with auto-fix
bun check        # Lint + typecheck
bun typecheck    # TypeScript type checking
bun format:write # Prettier formatting

# Database
bun db:push      # Push schema changes to database
bun db:generate  # Generate Drizzle migrations
bun db:migrate   # Run migrations
bun db:studio    # Open Drizzle Studio GUI
```

## Architecture

**Supportify** is a T3 Stack support ticket management SaaS. The data model is: Organizations → Projects → Tickets, with Users belonging to an Organization.

### Stack
- **Next.js 15** (App Router) + **React 19**
- **Clerk** for authentication (middleware at `src/middleware.ts` protects all routes except `/sign-in` and `/sign-up`)
- **tRPC v11** for type-safe API with React Query
- **Drizzle ORM** + **PostgreSQL**
- **Tailwind v4** + **shadcn/ui** (style: radix-nova, icons: lucide)

### tRPC Setup
- Server context (`src/server/api/trpc.ts`): provides `db` and Clerk `userId`
- Two procedure types: `publicProcedure` and `protectedProcedure` (requires auth)
- Root router at `src/server/api/root.ts` merges: `organization`, `project`, `ticket`, `user`
- Client-side: `src/trpc/react.tsx` — use `api` from here in client components
- Server-side: `src/trpc/server.ts` — use `api` from here in RSCs, with `HydrateClient` for hydration

### Database Schema
Tables use `supportify_` prefix (enforced in `drizzle.config.ts`). All tables have `createdAt`, `updatedAt`, `deletedAt` timestamps for soft deletes.

Key relations: `users.orgID → organization.id`, `projects.organizationID → organization.id`, `tickets.projectID → projects.id`, `tickets.assigneeID → users.id`

Users are synced from Clerk via `user.syncFromClerk` mutation — the DB `users` table stores `clerkID` to link to Clerk's identity.

### Environment
Validated with Zod in `src/env.js`. Required vars: `DATABASE_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`. Set `SKIP_ENV_VALIDATION=true` to bypass during builds.

### Path Aliases
`~/*` maps to `./src/*` (e.g., `~/server/db/schema`).

### ESLint
Drizzle plugin enforces `.where()` on all `db.delete()` and `db.update()` calls — do not omit where clauses.
