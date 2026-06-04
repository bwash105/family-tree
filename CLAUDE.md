# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at http://localhost:3000
npm run build     # production build
npm run lint      # ESLint
npx tsc --noEmit  # TypeScript check (no dedicated script)
```

## Architecture

**Stack:** Next.js 14 (App Router), Supabase (Postgres + Auth + Storage), TypeScript, Tailwind CSS.

**Auth:** Magic link (email OTP). Flow: `/auth/login` → email → `/auth/confirm?token_hash=...&type=magiclink` → `/tree`.

**Key patterns:**
- Server Components fetch data directly via `src/lib/supabase/server.ts`
- Client Components use `src/lib/supabase/client.ts`
- All mutations go through Server Actions in `src/lib/actions/`
- The `(app)` route group layout guards all protected routes server-side

**Database (4 tables):**
- `profiles` — one per auth user, auto-created by trigger, has optional `person_id` FK to their own family record
- `people` — every family member (may or may not have an account)
- `relationships` — parent_child (a=parent, b=child) or spouse edges between people
- `heritage_notes` — stories/facts attached to a person

**Tree visualization:** `react-d3-tree` loaded via `next/dynamic({ ssr: false })` in `src/app/(app)/tree/page.tsx`. Data is built by `src/lib/tree/buildTreeData.ts`.

**Photos:** Supabase Storage. Two public buckets: `avatars` and `person-photos`. `PhotoUploader` component calls `getSignedUploadUrl` server action, then uploads directly via PUT to the signed URL.

**Mobile:** Bottom nav (`src/components/layout/BottomNav.tsx`) hidden on md+. FAB on people list. Min 44px tap targets throughout. `touch-manipulation` on all interactive elements.

## Setup

1. Create a Supabase project at supabase.com
2. Copy `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Run migrations: `npx supabase link --project-ref <ref> && npx supabase db push`
4. Set Auth redirect URLs in Supabase dashboard to include your production URL
