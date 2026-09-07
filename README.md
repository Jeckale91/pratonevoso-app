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
Opzionale: NEXT_PUBLIC_SITE_URL per i redirect di conferma email.

## MVP
Auth email/password + Google OAuth + middleware.
Registrazione con scelta ruolo **allievo** o **maestro** (mai admin da self-signup).
Dopo login: allievo → `/hub`, maestro/admin → `/maestro`.
Allievo: /hub (dashboard, lezioni, schede, badge, messaggi).
Maestro/admin: /maestro (allievi, lezioni, schede, badge, messaggi).

## Google OAuth (Supabase)
1. In [Google Cloud Console](https://console.cloud.google.com/) crea un progetto (o usane uno esistente), abilita l’API Google Identity e crea credenziali **OAuth 2.0 Client ID** (tipo Web).
2. Authorized redirect URI di Google:  
   `https://otuxlaqyfmpyubjiuaob.supabase.co/auth/v1/callback`
3. Copia **Client ID** e **Client Secret**.
4. In Supabase Dashboard → **Authentication** → **Providers** → **Google**: abilita il provider e incolla Client ID / Secret.
5. In Supabase → **Authentication** → **URL Configuration**:
   - **Site URL**: URL dell’app (es. `http://localhost:3000` in locale, o il dominio di produzione)
   - **Redirect URLs** (allow list): includi  
     `http://localhost:3000/auth/callback`  
     e l’equivalente di produzione (es. `https://tuodominio.it/auth/callback`)

L’app usa il redirect `/auth/callback` (scambio codice / OTP, eventuale ruolo da cookie `pratonevoso_pending_role`, poi redirect a `/hub` o `/maestro`).

## Database
profiles, levels, maestro_allievo, lessons, bookings, sheet_templates, sheets, badges, badge_awards, conversations, conversation_participants, messages.
Tipi in src/lib/database.types.ts. Schema gia live: niente migrazioni da questa app.
Il trigger `handle_new_user` legge `raw_user_meta_data.role` se `allievo` o `maestro`.

## Brand
Blu #046BD2 / #034EA2, lime #D2F700, ghiaccio #F0F5FA. Asset in public/brand/.

## Contatti
Piazzale Dodero 12, 12083 Prato Nevoso (CN). 0174 334166. scuolascipratonevoso.it
