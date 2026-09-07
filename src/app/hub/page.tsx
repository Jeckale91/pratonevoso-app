import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import { BadgePill, StatusPill } from "@/components/ui/BadgePill";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime, getProfile } from "@/lib/auth";

export default async function HubDashboardPage() {
  const { supabase, user, profile } = await getProfile();

  const [{ data: level }, { data: bookings }, { data: sheets }, { data: awards }] =
    await Promise.all([
      profile.level_id
        ? supabase
            .from("levels")
            .select("name, color, description")
            .eq("id", profile.level_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("bookings")
        .select(
          "id, status, lessons(id, title, starts_at, ends_at, location, lesson_type)",
        )
        .eq("allievo_id", user.id)
        .neq("status", "cancelled")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("sheets")
        .select("id, title, status, assigned_at")
        .eq("allievo_id", user.id)
        .order("assigned_at", { ascending: false })
        .limit(4),
      supabase
        .from("badge_awards")
        .select("id, awarded_at, badges(name, icon, color)")
        .eq("allievo_id", user.id)
        .order("awarded_at", { ascending: false })
        .limit(6),
    ]);

  const upcoming =
    bookings
      ?.map((b) => {
        const lesson = Array.isArray(b.lessons) ? b.lessons[0] : b.lessons;
        return { ...b, lesson };
      })
      .filter((b) => b.lesson && new Date(b.lesson.starts_at) >= new Date())
      .sort(
        (a, b) =>
          new Date(a.lesson!.starts_at).getTime() -
          new Date(b.lesson!.starts_at).getTime(),
      )
      .slice(0, 3) ?? [];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-ski-blue p-6 text-white shadow-lg shadow-ski-blue/20">
        <p className="text-sm text-white/80">Benvenuto/a</p>
        <h1 className="mt-1 text-2xl font-bold">
          {profile.full_name ?? "Allievo"}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {level ? (
            <BadgePill color={level.color}>{level.name}</BadgePill>
          ) : (
            <BadgePill>Livello da assegnare</BadgePill>
          )}
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
            Area allievo
          </span>
        </div>
        {level?.description ? (
          <p className="mt-3 text-sm text-white/85">{level.description}</p>
        ) : null}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <CardTitle>Prossime lezioni</CardTitle>
            <Link href="/hub/lezioni" className="text-sm text-ski-blue">
              Vedi tutte
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState
              title="Nessuna lezione in programma"
              description="Prenota dalla sezione Lezioni."
            />
          ) : (
            <ul className="space-y-3">
              {upcoming.map((b) => (
                <li
                  key={b.id}
                  className="rounded-xl border border-ski-blue/10 bg-ski-ice/70 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-ski-ink">
                        {b.lesson?.title}
                      </p>
                      <p className="text-sm text-ski-slate">
                        {b.lesson ? formatDateTime(b.lesson.starts_at) : ""}
                      </p>
                      {b.lesson?.location ? (
                        <p className="text-xs text-ski-slate/80">
                          {b.lesson.location}
                        </p>
                      ) : null}
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <CardTitle>Schede recenti</CardTitle>
            <Link href="/hub/schede" className="text-sm text-ski-blue">
              Vedi tutte
            </Link>
          </div>
          {!sheets?.length ? (
            <EmptyState title="Ancora nessuna scheda" />
          ) : (
            <ul className="space-y-3">
              {sheets.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-ski-blue/10 bg-ski-ice/70 p-3"
                >
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs text-ski-slate">
                      {formatDateTime(s.assigned_at)}
                    </p>
                  </div>
                  <StatusPill status={s.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>I tuoi badge</CardTitle>
          <Link href="/hub/badge" className="text-sm text-ski-blue">
            Collezione
          </Link>
        </div>
        {!awards?.length ? (
          <EmptyState
            title="Nessun badge ancora"
            description="I maestri ti premieranno per i progressi."
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {awards.map((a) => {
              const badge = Array.isArray(a.badges) ? a.badges[0] : a.badges;
              return (
                <span
                  key={a.id}
                  className="inline-flex items-center gap-2 rounded-2xl border border-ski-blue/10 bg-ski-ice px-3 py-2 text-sm font-medium"
                >
                  <span>{badge?.icon ?? "🏅"}</span>
                  {badge?.name ?? "Badge"}
                </span>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
