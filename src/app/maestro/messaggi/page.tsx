import { Card, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageComposer } from "@/components/forms/ActionForms";
import { sendMessage } from "@/app/actions/hub";
import { formatDateTime, getProfile } from "@/lib/auth";

export default async function MaestroMessaggiPage() {
  const { supabase, user } = await getProfile();

  const { data: memberships } = await supabase
    .from("conversation_participants")
    .select("conversation_id, conversations(id, subject, updated_at)")
    .eq("profile_id", user.id);

  const conversations =
    memberships
      ?.map((m) => {
        const c = Array.isArray(m.conversations)
          ? m.conversations[0]
          : m.conversations;
        return c;
      })
      .filter(Boolean) ?? [];

  const firstId = conversations[0]?.id;
  let messages: {
    id: string;
    body: string;
    created_at: string;
    sender_id: string;
    profiles: { full_name: string | null } | { full_name: string | null }[] | null;
  }[] = [];

  if (firstId) {
    const { data } = await supabase
      .from("messages")
      .select(
        "id, body, created_at, sender_id, profiles!messages_sender_id_fkey(full_name)",
      )
      .eq("conversation_id", firstId)
      .order("created_at", { ascending: true });
    messages = data ?? [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messaggi</h1>
        <p className="text-sm text-ski-slate">
          Conversazioni con allievi e staff.
        </p>
      </div>

      {!conversations.length ? (
        <EmptyState
          title="Nessuna conversazione"
          description="Le chat create nel database appariranno qui."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <Card className="h-fit space-y-2 p-3">
            {conversations.map((c) =>
              c ? (
                <div
                  key={c.id}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    c.id === firstId
                      ? "bg-ski-blue text-white"
                      : "bg-ski-ice text-ski-ink"
                  }`}
                >
                  <p className="font-medium">
                    {c.subject ?? "Conversazione"}
                  </p>
                  <p
                    className={`text-xs ${c.id === firstId ? "text-white/80" : "text-ski-slate"}`}
                  >
                    {formatDateTime(c.updated_at)}
                  </p>
                </div>
              ) : null,
            )}
          </Card>

          <Card>
            <CardTitle className="mb-4">
              {conversations[0]?.subject ?? "Conversazione"}
            </CardTitle>
            <div className="mb-4 max-h-[420px] space-y-3 overflow-y-auto">
              {messages.map((m) => {
                const sender = Array.isArray(m.profiles)
                  ? m.profiles[0]
                  : m.profiles;
                const mine = m.sender_id === user.id;
                return (
                  <div
                    key={m.id}
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      mine
                        ? "ml-8 bg-ski-blue text-white"
                        : "mr-8 bg-ski-ice text-ski-ink"
                    }`}
                  >
                    <p className="mb-1 text-xs opacity-80">
                      {sender?.full_name ?? "Utente"} ·{" "}
                      {formatDateTime(m.created_at)}
                    </p>
                    <p>{m.body}</p>
                  </div>
                );
              })}
            </div>
            {firstId ? (
              <MessageComposer
                conversationId={firstId}
                action={sendMessage}
              />
            ) : null}
          </Card>
        </div>
      )}
    </div>
  );
}
