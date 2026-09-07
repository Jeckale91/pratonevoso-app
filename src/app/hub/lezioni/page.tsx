import { Card, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusPill } from "@/components/ui/BadgePill";
import {
  BookLessonButton,
  CancelBookingButton,
} from "@/components/forms/ActionForms";
import { bookLesson, cancelBooking } from "@/app/actions/hub";
import { formatDateTime, getProfile } from "@/lib/auth";

export default async function HubLezioniPage() {
  const { supabase, user } = await getProfile();
  const nowIso = new Date().toISOString();

  const [{ data: lessons }, { data: myBookings }] = await Promise.all([
    supabase
      .from("lessons")
      .select(
        "id, title, description, starts_at, ends_at, capacity, location, lesson_type, profiles!lessons_maestro_id_fkey(full_name)",
      )
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true }),
    supabase
      .from("bookings")
      .select("id, lesson_id, status")
      .eq("allievo_id", user.id),
  ]);

  const bookingByLesson = new Map(
    (myBookings ?? [])
      .filter((b) => b.status !== "cancelled")
      .map((b) => [b.lesson_id, b]),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ski-ink">Lezioni</h1>
        <p className="text-sm text-ski-slate">
          Prenota le prossime lezioni disponibili.
        </p>
      </div>

      {!lessons?.length ? (
        <EmptyState
          title="Nessuna lezione aperta"
          description="Torna più tardi: i maestri pubblicheranno i turni."
        />
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const maestro = Array.isArray(lesson.profiles)
              ? lesson.profiles[0]
              : lesson.profiles;
            const booking = bookingByLesson.get(lesson.id);
            return (
              <Card key={lesson.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>{lesson.title}</CardTitle>
                    <p className="mt-1 text-sm text-ski-slate">
                      {formatDateTime(lesson.starts_at)} →{" "}
                      {formatDateTime(lesson.ends_at)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-ski-slate">
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
                        Max {lesson.capacity} posti
                      </span>
                      {maestro?.full_name ? (
                        <span className="rounded-full bg-ski-ice px-2 py-1">
                          Maestro: {maestro.full_name}
                        </span>
                      ) : null}
                    </div>
                    {lesson.description ? (
                      <p className="mt-3 text-sm text-ski-slate">
                        {lesson.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 space-y-2">
                    {booking ? (
                      <>
                        <StatusPill status={booking.status} />
                        <CancelBookingButton
                          bookingId={booking.id}
                          action={cancelBooking}
                        />
                      </>
                    ) : (
                      <BookLessonButton
                        lessonId={lesson.id}
                        action={bookLesson}
                      />
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
