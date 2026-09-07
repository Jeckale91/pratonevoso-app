import { Card, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { CreateLessonForm } from "@/components/forms/ActionForms";
import { createLesson } from "@/app/actions/maestro";
import { formatDateTime, getProfile } from "@/lib/auth";

export default async function MaestroLezioniPage() {
  const { supabase, user } = await getProfile();

  const { data: lessons } = await supabase
    .from("lessons")
    .select(
      "id, title, description, starts_at, ends_at, capacity, location, lesson_type, bookings(id, status, profiles!bookings_allievo_id_fkey(full_name))",
    )
    .eq("maestro_id", user.id)
    .order("starts_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lezioni</h1>
        <p className="text-sm text-ski-slate">
          Crea turni e consulta le prenotazioni.
        </p>
      </div>

      <Card>
        <CardTitle className="mb-4">Nuova lezione</CardTitle>
        <CreateLessonForm action={createLesson} />
      </Card>

      {!lessons?.length ? (
        <EmptyState title="Non hai ancora creato lezioni" />
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const activeBookings =
              lesson.bookings?.filter((b) => b.status !== "cancelled") ?? [];
            return (
              <Card key={lesson.id}>
                <CardTitle>{lesson.title}</CardTitle>
                <p className="mt-1 text-sm text-ski-slate">
                  {formatDateTime(lesson.starts_at)} →{" "}
                  {formatDateTime(lesson.ends_at)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {lesson.lesson_type ? (
                    <span className="rounded-full bg-ski-ice px-2 py-1">
                      {lesson.lesson_type}
                    </span>
                  ) : null}
                  {lesson.location ? (
                    <span className="rounded-full bg-ski-ice px-2 py-1">
                      {lesson.location}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-ski-ice px-2 py-1">
                    {activeBookings.length}/{lesson.capacity} prenotati
                  </span>
                </div>
                {lesson.description ? (
                  <p className="mt-3 text-sm text-ski-slate">
                    {lesson.description}
                  </p>
                ) : null}
                {activeBookings.length > 0 ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ski-slate">
                      Allievi prenotati
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {activeBookings.map((b) => {
                        const p = Array.isArray(b.profiles)
                          ? b.profiles[0]
                          : b.profiles;
                        return (
                          <li
                            key={b.id}
                            className="rounded-full bg-ski-blue/10 px-3 py-1 text-sm text-ski-blue"
                          >
                            {p?.full_name ?? "Allievo"}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
