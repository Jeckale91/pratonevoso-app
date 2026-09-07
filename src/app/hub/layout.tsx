import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/auth";

const nav = [
  { href: "/hub", label: "Dashboard", icon: "⛷️" },
  { href: "/hub/lezioni", label: "Lezioni", icon: "📅" },
  { href: "/hub/schede", label: "Schede", icon: "📋" },
  { href: "/hub/badge", label: "Badge", icon: "🏅" },
  { href: "/hub/messaggi", label: "Messaggi", icon: "💬" },
];

export default async function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getProfile();

  return (
    <AppShell
      title="Area Allievo"
      subtitle="Scuola Sci Pratonevoso"
      nav={nav}
      userName={profile.full_name}
    >
      {children}
    </AppShell>
  );
}
