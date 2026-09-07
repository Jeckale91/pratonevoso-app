import { Card, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, getProfile } from "@/lib/auth";

export default async function HubBadgePage() {
  const { supabase, user } = await getProfile();
  const { data: awards } = await supabase
    .from("badge_awards")
    .select(
      "id, note, awarded_at, badges(name, description, icon, color), profiles!badge_awards_awarded_by_fkey(full_name)",
    )
    .eq("allievo_id", user.id)
    .order("awarded_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Badge</h1>
        <p className="text-sm text-ski-slate">
          I riconoscimenti per i tuoi progressi sulla neve.
        </p>
      </div>

      {!awards?.length ? (
        <EmptyState title="La collezione è ancora vuota" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {awards.map((award) => {
            const badge = Array.isArray(award.badges)
              ? award.badges[0]
              : award.badges;
            const maestro = Array.isArray(award.profiles)
              ? award.profiles[0]
              : award.profiles;
            return (
              <Card key={award.id}>
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                    style={{
                      backgroundColor: badge?.color
                        ? `${badge.color}22`
                        : "#046BD222",
                    }}
                  >
                    {badge?.icon ?? "🏅"}
                  </div>
                  <div>
                    <CardTitle>{badge?.name ?? "Badge"}</CardTitle>
                    {badge?.description ? (
                      <p className="mt-1 text-sm text-ski-slate">
                        {badge.description}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-ski-slate">
                      {formatDate(award.awarded_at)}
                      {maestro?.full_name
                        ? ` · da ${maestro.full_name}`
                        : ""}
                    </p>
                    {award.note ? (
                      <p className="mt-2 rounded-xl bg-ski-ice px-3 py-2 text-sm italic text-ski-slate">
                        “{award.note}”
                      </p>
                    ) : null}
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
