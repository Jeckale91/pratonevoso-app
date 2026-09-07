import { Card, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AwardBadgeForm } from "@/components/forms/ActionForms";
import { awardBadge } from "@/app/actions/maestro";
import { formatDateTime, getProfile } from "@/lib/auth";

export default async function MaestroBadgePage() {
  const { supabase, user } = await getProfile();

  const [{ data: assignments }, { data: badges }, { data: awards }] =
    await Promise.all([
      supabase
        .from("maestro_allievo")
        .select(
          "allievo_id, profiles!maestro_allievo_allievo_id_fkey(id, full_name)",
        )
        .eq("maestro_id", user.id),
      supabase.from("badges").select("id, name").order("name"),
      supabase
        .from("badge_awards")
        .select(
          "id, awarded_at, note, badges(name, icon), profiles!badge_awards_allievo_id_fkey(full_name)",
        )
        .eq("awarded_by", user.id)
        .order("awarded_at", { ascending: false })
        .limit(20),
    ]);

  const allievi =
    assignments
      ?.map((a) => {
        const p = Array.isArray(a.profiles) ? a.profiles[0] : a.profiles;
        return p ? { id: p.id, full_name: p.full_name } : null;
      })
      .filter(Boolean) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Badge</h1>
        <p className="text-sm text-ski-slate">
          Premia i progressi dei tuoi allievi.
        </p>
      </div>

      <Card>
        <CardTitle className="mb-4">Assegna un badge</CardTitle>
        {allievi.length === 0 || !(badges?.length) ? (
          <EmptyState
            title="Dati insufficienti"
            description="Servono allievi assegnati e badge definiti nel database."
          />
        ) : (
          <AwardBadgeForm
            allievi={allievi as { id: string; full_name: string | null }[]}
            badges={badges}
            action={awardBadge}
          />
        )}
      </Card>

      <Card>
        <CardTitle className="mb-3">Storico assegnazioni</CardTitle>
        {!awards?.length ? (
          <EmptyState title="Nessun badge assegnato" />
        ) : (
          <ul className="space-y-2">
            {awards.map((a) => {
              const badge = Array.isArray(a.badges) ? a.badges[0] : a.badges;
              const allievo = Array.isArray(a.profiles)
                ? a.profiles[0]
                : a.profiles;
              return (
                <li key={a.id} className="rounded-xl bg-ski-ice px-3 py-2 text-sm">
                  <p className="font-medium">
                    {badge?.icon ?? "🏅"} {badge?.name} →{" "}
                    {allievo?.full_name ?? "Allievo"}
                  </p>
                  <p className="text-xs text-ski-slate">
                    {formatDateTime(a.awarded_at)}
                    {a.note ? ` · ${a.note}` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
