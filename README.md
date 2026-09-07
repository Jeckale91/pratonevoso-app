# Scuola Sci Pratonevoso App

App ufficiale Scuola Sci Pratonevoso (Prato Nevoso, CN).
UI in italiano, mobile-first.

## Stack
Next.js App Router, TypeScript, Tailwind, @supabase/ssr.

## Setup
1. Copia .env.example in .env.local e valorizza le chiavi pubbliche Supabase
2. Installa le dipendenze con Bun
3. Avvia con: bun run dev
4. Apri http://localhost:3000

Build: bun run build && bun run start

## Env
NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (mai service_role).
Con @supabase/ssr preferire l anon JWT legacy.

## MVP
Auth email/password + middleware.
Allievo: /hub (dashboard, lezioni, schede, badge, messaggi).
Maestro/admin: /maestro (allievi, lezioni, schede, badge, messaggi).

## Database
profiles, levels, maestro_allievo, lessons, bookings, sheet_templates, sheets, badges, badge_awards, conversations, conversation_participants, messages.
Tipi in src/lib/database.types.ts. Schema gia live: niente migrazioni da questa app.

## Brand
Blu #046BD2 / #034EA2, lime #D2F700, ghiaccio #F0F5FA. Asset in public/brand/.

## Contatti
Piazzale Dodero 12, 12083 Prato Nevoso (CN). 0174 334166. scuolascipratonevoso.it
