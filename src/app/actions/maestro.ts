"use server";

import { revalidatePath } from "next/cache";
import { getProfile } from "@/lib/auth";

export type ActionState = { error?: string; success?: string };

async function requireMaestro() {
  const ctx = await getProfile();
  if (ctx.profile.role !== "maestro" && ctx.profile.role !== "admin") {
    return { ...ctx, error: "Accesso riservato ai maestri." as const };
  }
  return { ...ctx, error: null };
}

export async function assignSheet(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const allievoId = String(formData.get("allievo_id") ?? "");
  const templateId = String(formData.get("template_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();

  if (!allievoId || !title) {
    return { error: "Seleziona allievo e titolo della scheda." };
  }

  const ctx = await requireMaestro();
  if (ctx.error) return { error: ctx.error };
  const { supabase, user } = ctx;

  let content: import("@/lib/database.types").Json = {};
  if (templateId) {
    const { data: template } = await supabase
      .from("sheet_templates")
      .select("title, content")
      .eq("id", templateId)
      .maybeSingle();
    if (template?.content != null) {
      content = template.content;
    }
  }

  const { error } = await supabase.from("sheets").insert({
    allievo_id: allievoId,
    maestro_id: user.id,
    template_id: templateId || null,
    title,
    content,
    status: "assigned",
  });

  if (error) return { error: "Assegnazione scheda non riuscita." };

  revalidatePath("/maestro");
  revalidatePath("/maestro/schede");
  return { success: "Scheda assegnata." };
}

export async function awardBadge(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const allievoId = String(formData.get("allievo_id") ?? "");
  const badgeId = String(formData.get("badge_id") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!allievoId || !badgeId) {
    return { error: "Seleziona allievo e badge." };
  }

  const ctx = await requireMaestro();
  if (ctx.error) return { error: ctx.error };
  const { supabase, user } = ctx;

  const { error } = await supabase.from("badge_awards").insert({
    allievo_id: allievoId,
    badge_id: badgeId,
    awarded_by: user.id,
    note: note || null,
  });

  if (error) return { error: "Assegnazione badge non riuscita." };

  revalidatePath("/maestro");
  revalidatePath("/maestro/badge");
  return { success: "Badge assegnato!" };
}

export async function createLesson(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "");
  const endsAt = String(formData.get("ends_at") ?? "");
  const capacity = Number(formData.get("capacity") ?? 6);
  const location = String(formData.get("location") ?? "").trim();
  const lessonType = String(formData.get("lesson_type") ?? "collettiva").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !startsAt || !endsAt) {
    return { error: "Titolo e orari sono obbligatori." };
  }

  const ctx = await requireMaestro();
  if (ctx.error) return { error: ctx.error };
  const { supabase, user } = ctx;

  const { error } = await supabase.from("lessons").insert({
    title,
    description: description || null,
    maestro_id: user.id,
    starts_at: new Date(startsAt).toISOString(),
    ends_at: new Date(endsAt).toISOString(),
    capacity: Number.isFinite(capacity) ? capacity : 6,
    location: location || null,
    lesson_type: lessonType || null,
  });

  if (error) return { error: "Creazione lezione non riuscita." };

  revalidatePath("/maestro");
  revalidatePath("/maestro/lezioni");
  revalidatePath("/hub/lezioni");
  return { success: "Lezione creata." };
}
