import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime, getProfile } from "@/lib/auth";

export default async function MaestroDashboardPage() {
  const { supabase, user, profile } = await getProfile();

  const [{ data: assignments }, { data: lessons }, { data: recentAwards }] =
    await Promise.all([
      supabase
        .from("maestro_allievo")
        .select(
          "id, allievo_id, profiles!maestro_allievo_allievo_id_fkey(id, full_name, level_id, levels(name, color))",
        )
        .eq("maestro_id", user.id),
      supabase
        .from("lessons")
        .select("id, title, starts_at, capacity, location")
        .eq("maestro_id", user.id)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(4),
      supabase
        .from("badge_awards")
        .select(
          "id, awarded_at, badges(name, icon), profiles!badge_awards_allievo_id_fkey(full_name)",
        )
        .eq("awarded_by", user.id)
        .order("awarded_at", { ascending: false })
        .limit(5),
    ]);

  const students =
    assignments?.map((a) => {
      const p = Array.isArray(a.profiles) ? a.profiles[0] : a.profiles;
      const level = p && (Array.isArray(p.levels) ? p.levels[0] : p.levels);
      return { id: a.allievo_id, profile: p, level };
    }) ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-ski-blue to-ski-blue-dark p-6 text-white shadow-lg shadow-ski-blue/20">
        <p className="text-sm text-white/80">Pannello maestro</p>
        <h1 className="mt-1 text-2xl font-bold">
          Ciao, {profile.full_name?.split(" ")[0] ?? "Maestro"}
        </h1>
        <p className="mt-2 text-sm text-white/85">
          Gestisci allievi, lezioni, schede e badge.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/maestro/schede"
            className="rounded-xl bg-ski-lime px-4 py-2 text-sm font-semibold text-ski-ink"
          >
            Assegna scheda
          </Link>
          <Link
            href="/maestro/badge"
            className="rounded-xl bg-white/15 px-4 py-2 text-sm font-medium"
          >
            Premia con badge
          </Link>
          <Link
            href="/maestro/lezioni"
            className="rounded-xl bg-white/15 px-4 py-2 text-sm font-medium"
          >
            Nuova lezione
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle className="mb-3">Allievi assegnati</CardTitle>
          {!students.length ? (
            <EmptyState
              title="Nessun allievo collegato"
              description="Collega gli allievi dalla tabella maestro_allievo."
            />
          ) : (
            <ul className="space-y-2">
              {students.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-ski-ice px-3 py-2"
                >
                  <span className="font-medium">
                    {s.profile?.full_name ?? "Allievo"}
                  </span>
                  {s.level ? (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor: s.level.color
                          ? `${s.level.color}22`
                          : "#046BD222",
                        color: s.level.color ?? "#046BD2",
                      }}
                    >
                      {s.level.name}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <CardTitle>Prossime lezioni</CardTitle>
            <Link href="/maestro/lezioni" className="text-sm text-ski-blue">
              Gestisci
            </Link>
          </div>
          {!lessons?.length ? (
            <EmptyState title="Nessuna lezione in calendario" />
          ) : (
            <ul className="space-y-2">
              {lessons.map((l) => (
                <li key={l.id} className="rounded-xl bg-ski-ice px-3 py-2">
                  <p className="font-medium">{l.title}</p>
                  <p className="text-xs text-ski-slate">
                    {formatDateTime(l.starts_at)}
                    {l.location ? ` · ${l.location}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardTitle className="mb-3">Badge assegnati di recente</CardTitle>
        {!recentAwards?.length ? (
          <EmptyState title="Ancora nessun badge assegnato" />
        ) : (
          <ul className="space-y-2">
            {recentAwards.map((a) => {
              const badge = Array.isArray(a.badges) ? a.badges[0] : a.badges;
              const allievo = Array.isArray(a.profiles)
                ? a.profiles[0]
                : a.profiles;
              return (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-xl bg-ski-ice px-3 py-2 text-sm"
                >
                  <span>
                    {badge?.icon ?? "🏅"} {badge?.name} →{" "}
                    {allievo?.full_name ?? "Allievo"}
                  </span>
                  <span className="text-xs text-ski-slate">
                    {formatDateTime(a.awarded_at)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
