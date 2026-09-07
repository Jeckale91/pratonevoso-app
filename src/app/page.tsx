import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homeForRole } from "@/lib/auth";
import type { UserRole } from "@/lib/database.types";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    redirect(homeForRole((profile?.role ?? "allievo") as UserRole));
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ski-blue">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(210,247,0,0.18),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.12),_transparent_40%)]" />
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-12 text-white">
        <Image
          src="/brand/LOGO_WHITE.svg"
          alt="Scuola Sci Pratonevoso"
          width={96}
          height={96}
          className="mb-6"
          priority
        />
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-ski-lime">
          Prato Nevoso
        </p>
        <h1 className="text-4xl font-bold leading-tight">
          La tua scuola sci,<br />sempre con te
        </h1>
        <p className="mt-4 text-base text-white/85">
          Prenota lezioni, consulta le schede tecniche, colleziona badge e resta
          in contatto con i maestri.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-xl bg-ski-lime px-5 py-3 text-center text-sm font-semibold text-ski-ink"
          >
            Accedi
          </Link>
          <Link
            href="/registrati"
            className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white backdrop-blur"
          >
            Registrati
          </Link>
        </div>
      </main>
      <footer className="relative z-10 px-6 pb-8 text-center text-xs text-white/70">
        Piazzale Dodero, 12 — 12083 Prato Nevoso (CN) · 0174 334166
      </footer>
    </div>
  );
}
