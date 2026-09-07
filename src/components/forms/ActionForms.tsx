"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import type { ActionState } from "@/app/actions/hub";

function Feedback({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        {state.success}
      </p>
    );
  }
  return null;
}

export function BookLessonButton({
  lessonId,
  action,
}: {
  lessonId: string;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="lesson_id" value={lessonId} />
      <Feedback state={state} />
      <Button type="submit" variant="lime" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Prenotazione…" : "Prenota"}
      </Button>
    </form>
  );
}

export function CancelBookingButton({
  bookingId,
  action,
}: {
  bookingId: string;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction}>
      <input type="hidden" name="booking_id" value={bookingId} />
      <Feedback state={state} />
      <Button type="submit" variant="ghost" disabled={pending}>
        Annulla
      </Button>
    </form>
  );
}

export function MessageComposer({
  conversationId,
  action,
}: {
  conversationId: string;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="conversation_id" value={conversationId} />
      <Textarea
        name="body"
        rows={3}
        required
        placeholder="Scrivi un messaggio…"
      />
      <Feedback state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? "Invio…" : "Invia"}
      </Button>
    </form>
  );
}

export function AssignSheetForm({
  allievi,
  templates,
  action,
}: {
  allievi: { id: string; full_name: string | null }[];
  templates: { id: string; title: string }[];
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-3">
      <div>
        <Label htmlFor="allievo_id">Allievo</Label>
        <select
          id="allievo_id"
          name="allievo_id"
          required
          className="w-full rounded-xl border border-ski-blue/15 bg-white px-3.5 py-2.5 text-sm"
        >
          <option value="">Seleziona…</option>
          {allievi.map((a) => (
            <option key={a.id} value={a.id}>
              {a.full_name ?? "Allievo"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="template_id">Modello (opzionale)</Label>
        <select
          id="template_id"
          name="template_id"
          className="w-full rounded-xl border border-ski-blue/15 bg-white px-3.5 py-2.5 text-sm"
        >
          <option value="">Nessun modello</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="title">Titolo scheda</Label>
        <Input id="title" name="title" required placeholder="Es. Progressi curva" />
      </div>
      <Feedback state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? "Assegnazione…" : "Assegna scheda"}
      </Button>
    </form>
  );
}

export function AwardBadgeForm({
  allievi,
  badges,
  action,
}: {
  allievi: { id: string; full_name: string | null }[];
  badges: { id: string; name: string }[];
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-3">
      <div>
        <Label htmlFor="allievo_id">Allievo</Label>
        <select
          id="allievo_id"
          name="allievo_id"
          required
          className="w-full rounded-xl border border-ski-blue/15 bg-white px-3.5 py-2.5 text-sm"
        >
          <option value="">Seleziona…</option>
          {allievi.map((a) => (
            <option key={a.id} value={a.id}>
              {a.full_name ?? "Allievo"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="badge_id">Badge</Label>
        <select
          id="badge_id"
          name="badge_id"
          required
          className="w-full rounded-xl border border-ski-blue/15 bg-white px-3.5 py-2.5 text-sm"
        >
          <option value="">Seleziona…</option>
          {badges.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="note">Nota (opzionale)</Label>
        <Input id="note" name="note" placeholder="Ottimo lavoro sulle parallele!" />
      </div>
      <Feedback state={state} />
      <Button type="submit" variant="lime" disabled={pending}>
        {pending ? "Assegnazione…" : "Assegna badge"}
      </Button>
    </form>
  );
}

export function CreateLessonForm({
  action,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label htmlFor="title">Titolo</Label>
        <Input id="title" name="title" required placeholder="Lezione collettiva blu" />
      </div>
      <div>
        <Label htmlFor="starts_at">Inizio</Label>
        <Input id="starts_at" name="starts_at" type="datetime-local" required />
      </div>
      <div>
        <Label htmlFor="ends_at">Fine</Label>
        <Input id="ends_at" name="ends_at" type="datetime-local" required />
      </div>
      <div>
        <Label htmlFor="capacity">Posti</Label>
        <Input id="capacity" name="capacity" type="number" min={1} defaultValue={6} />
      </div>
      <div>
        <Label htmlFor="lesson_type">Tipo</Label>
        <select
          id="lesson_type"
          name="lesson_type"
          className="w-full rounded-xl border border-ski-blue/15 bg-white px-3.5 py-2.5 text-sm"
          defaultValue="collettiva"
        >
          <option value="collettiva">Collettiva</option>
          <option value="privata">Privata</option>
          <option value="baby">Baby</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="location">Luogo</Label>
        <Input id="location" name="location" placeholder="Campo scuola / Incontro piazzale" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="description">Descrizione</Label>
        <Textarea id="description" name="description" rows={2} />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <Feedback state={state} />
        <Button type="submit" disabled={pending}>
          {pending ? "Creazione…" : "Crea lezione"}
        </Button>
      </div>
    </form>
  );
}
