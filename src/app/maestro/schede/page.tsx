import { Card, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusPill } from "@/components/ui/BadgePill";
import { AssignSheetForm } from "@/components/forms/ActionForms";
import { assignSheet } from "@/app/actions/maestro";
import { formatDateTime, getProfile } from "@/lib/auth";

export default async function MaestroSchedePage() {
  const { supabase, user } = await getProfile();

  const [{ data: assignments }, { data: templates }, { data: sheets }] =
    await Promise.all([
      supabase
        .from("maestro_allievo")
        .select(
          "allievo_id, profiles!maestro_allievo_allievo_id_fkey(id, full_name)",
        )
        .eq("maestro_id", user.id),
      supabase
        .from("sheet_templates")
        .select("id, title")
        .order("title", { ascending: true }),
      supabase
        .from("sheets")
        .select(
          "id, title, status, assigned_at, profiles!sheets_allievo_id_fkey(full_name)",
        )
        .eq("maestro_id", user.id)
        .order("assigned_at", { ascending: false })
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
        <h1 className="text-2xl font-bold">Schede</h1>
        <p className="text-sm text-ski-slate">
          Assegna schede tecniche ai tuoi allievi.
        </p>
      </div>

      <Card>
        <CardTitle className="mb-4">Assegna una scheda</CardTitle>
        {allievi.length === 0 ? (
          <EmptyState
            title="Nessun allievo assegnato"
            description="Collega allievi in maestro_allievo per poter assegnare schede."
          />
        ) : (
          <AssignSheetForm
            allievi={allievi as { id: string; full_name: string | null }[]}
            templates={templates ?? []}
            action={assignSheet}
          />
        )}
      </Card>

      <Card>
        <CardTitle className="mb-3">Schede assegnate</CardTitle>
        {!sheets?.length ? (
          <EmptyState title="Nessuna scheda ancora" />
        ) : (
          <ul className="space-y-2">
            {sheets.map((s) => {
              const allievo = Array.isArray(s.profiles)
                ? s.profiles[0]
                : s.profiles;
              return (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-ski-ice px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs text-ski-slate">
                      {allievo?.full_name ?? "Allievo"} ·{" "}
                      {formatDateTime(s.assigned_at)}
                    </p>
                  </div>
                  <StatusPill status={s.status} />
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
