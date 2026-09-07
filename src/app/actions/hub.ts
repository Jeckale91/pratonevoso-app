"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export type ActionState = { error?: string; success?: string };

export async function bookLesson(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const lessonId = String(formData.get("lesson_id") ?? "");
  if (!lessonId) return { error: "Lezione non valida." };

  const { supabase, user } = await requireUser();

  const { data: existing } = await supabase
    .from("bookings")
    .select("id, status")
    .eq("lesson_id", lessonId)
    .eq("allievo_id", user.id)
    .maybeSingle();

  if (existing && existing.status !== "cancelled") {
    return { error: "Hai già prenotato questa lezione." };
  }

  if (existing) {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", existing.id);
    if (error) return { error: "Impossibile aggiornare la prenotazione." };
  } else {
    const { error } = await supabase.from("bookings").insert({
      lesson_id: lessonId,
      allievo_id: user.id,
      status: "confirmed",
    });
    if (error) return { error: "Prenotazione non riuscita." };
  }

  revalidatePath("/hub");
  revalidatePath("/hub/lezioni");
  return { success: "Lezione prenotata!" };
}

export async function cancelBooking(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) return { error: "Prenotazione non valida." };

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("allievo_id", user.id);

  if (error) return { error: "Annullamento non riuscito." };

  revalidatePath("/hub");
  revalidatePath("/hub/lezioni");
  return { success: "Prenotazione annullata." };
}

export async function sendMessage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const conversationId = String(formData.get("conversation_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!conversationId || !body) {
    return { error: "Scrivi un messaggio." };
  }

  const { supabase, user } = await requireUser();

  const { data: participant } = await supabase
    .from("conversation_participants")
    .select("id")
    .eq("conversation_id", conversationId)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!participant) {
    return { error: "Non sei partecipante di questa conversazione." };
  }

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body,
  });

  if (error) return { error: "Invio non riuscito." };

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath("/hub/messaggi");
  revalidatePath("/maestro/messaggi");
  return { success: "Messaggio inviato." };
}
