import { Card, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusPill } from "@/components/ui/BadgePill";
import { formatDateTime, getProfile } from "@/lib/auth";

export default async function HubSchedePage() {
  const { supabase, user } = await getProfile();
  const { data: sheets } = await supabase
    .from("sheets")
    .select(
      "id, title, status, content, assigned_at, completed_at, profiles!sheets_maestro_id_fkey(full_name)",
    )
    .eq("allievo_id", user.id)
    .order("assigned_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Schede tecniche</h1>
        <p className="text-sm text-ski-slate">
          Materiale e progressi assegnati dai tuoi maestri.
        </p>
      </div>

      {!sheets?.length ? (
        <EmptyState title="Nessuna scheda assegnata" />
      ) : (
        <div className="space-y-4">
          {sheets.map((sheet) => {
            const maestro = Array.isArray(sheet.profiles)
              ? sheet.profiles[0]
              : sheet.profiles;
            const content =
              sheet.content && typeof sheet.content === "object"
                ? (sheet.content as Record<string, unknown>)
                : null;
            return (
              <Card key={sheet.id}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <CardTitle>{sheet.title}</CardTitle>
                  <StatusPill status={sheet.status} />
                </div>
                <p className="text-sm text-ski-slate">
                  Assegnata il {formatDateTime(sheet.assigned_at)}
                  {maestro?.full_name ? ` · ${maestro.full_name}` : ""}
                </p>
                {content ? (
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-ski-ice p-3 text-xs text-ski-slate">
                    {JSON.stringify(content, null, 2)}
                  </pre>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
