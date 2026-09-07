import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tables, UserRole } from "@/lib/database.types";

export type Profile = Tables<"profiles">;

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function requireUser() {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function getProfile() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return {
      supabase,
      user,
      profile: {
        id: user.id,
        full_name: user.email ?? "Utente",
        role: "allievo" as UserRole,
        level_id: null,
        avatar_url: null,
        phone: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } satisfies Profile,
    };
  }

  return { supabase, user, profile };
}

export function homeForRole(role: UserRole) {
  return role === "maestro" || role === "admin" ? "/maestro" : "/hub";
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Rome",
  }).format(new Date(iso));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeZone: "Europe/Rome",
  }).format(new Date(iso));
}
